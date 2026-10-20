/* eslint-disable @next/next/no-img-element */
// Logo officiel MTN MoMo (fichier : public/momo-logo.png)
export default function Logo({ size = 60 }: { size?: number }) {
  return (
    <img
      src="/momo-logo.png"
      alt="MTN MoMo"
      width={size}
      height={size}
      style={{ display: "block", borderRadius: "50%", flexShrink: 0 }}
    />
  );
}
