import { createHash, randomBytes, randomUUID } from "crypto";

export type LoginRequest = {
  id: string;
  phone: string;
  expiresAt: number;
  verified: boolean;
  createdAt: number;
};

const TTL_S = 300; // lien valable 5 min
const COOLDOWN_S = 30; // 1 SMS / 30 s / numéro
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

/* ---------- Backend Redis (Upstash / Vercel) via l'API REST ---------- */
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

async function redis(...cmd: (string | number)[]) {
  const r = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Redis error ${r.status}`);
  return (await r.json()).result as string | null;
}

/* ---------- Backend mémoire (dev local uniquement) ---------- */
const g = globalThis as unknown as { __mem?: Map<string, { v: string; exp: number }> };
const mem = (g.__mem ??= new Map());
const memGet = (k: string) => {
  const e = mem.get(k);
  if (!e || e.exp < Date.now()) { mem.delete(k); return null; }
  return e.v;
};

const useRedis = !!(REDIS_URL && REDIS_TOKEN);

async function kvSet(k: string, v: string, ttl: number, nx = false) {
  if (useRedis) {
    const res = nx ? await redis("SET", k, v, "EX", ttl, "NX") : await redis("SET", k, v, "EX", ttl);
    return res === "OK";
  }
  if (nx && memGet(k)) return false;
  mem.set(k, { v, exp: Date.now() + ttl * 1000 });
  return true;
}
const kvGet = async (k: string) => (useRedis ? redis("GET", k) : memGet(k));
async function kvGetDel(k: string) {
  if (useRedis) return redis("GETDEL", k);
  const v = memGet(k);
  mem.delete(k);
  return v;
}

/* ---------- API ---------- */
export async function createLoginRequest(phone: string) {
  if (!(await kvSet(`momo:cd:${phone}`, "1", COOLDOWN_S, true))) return { error: "cooldown" as const };

  const token = randomBytes(32).toString("base64url");
  const req: LoginRequest = {
    id: randomUUID(),
    phone,
    expiresAt: Date.now() + TTL_S * 1000,
    verified: false,
    createdAt: Date.now(),
  };
  await kvSet(`momo:req:${req.id}`, JSON.stringify(req), TTL_S * 2);
  await kvSet(`momo:tok:${hash(token)}`, req.id, TTL_S);
  return { req, token };
}

// Usage unique : GETDEL supprime le token en même temps qu'on le lit
export async function consumeToken(token: string) {
  const id = await kvGetDel(`momo:tok:${hash(token)}`);
  if (!id) return null;
  const raw = await kvGet(`momo:req:${id}`);
  if (!raw) return null;
  const r: LoginRequest = JSON.parse(raw);
  if (r.expiresAt < Date.now()) return null;
  r.verified = true;
  await kvSet(`momo:req:${id}`, JSON.stringify(r), TTL_S * 2);
  return r;
}

export async function getRequest(id: string) {
  const raw = await kvGet(`momo:req:${id}`);
  return raw ? (JSON.parse(raw) as LoginRequest) : undefined;
}
