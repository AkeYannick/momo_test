const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Bell = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" {...base} aria-hidden>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);
export const Camera = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...base} aria-hidden>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
  </svg>
);
export const Back = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" {...base} aria-hidden><path d="M19 12H5M11 5l-7 7 7 7" /></svg>
);
export const Basket = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00334d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 10h18l-2 9H5z" /><path d="M8 10l3-6M16 10l-3-6" /><circle cx="12" cy="14.5" r="1.4" fill="#00334d" />
  </svg>
);
export const Pin = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#00334d" aria-hidden>
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" /><circle cx="12" cy="9" r="2.6" fill="#ffcc00" />
  </svg>
);
export const Help = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00334d" strokeWidth="3" strokeLinecap="round" aria-hidden>
    <path d="M8.5 9a3.5 3.5 0 1 1 5.2 3c-1 .6-1.7 1.2-1.7 2.4" /><circle cx="12" cy="19" r=".6" fill="#00334d" />
  </svg>
);
export const Megaphone = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#00334d" stroke="#00334d" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
    <path d="M3 10v4a1 1 0 0 0 1 1h3l8 4V5L7 9H4a1 1 0 0 0-1 1z" /><path d="M18 9.5c1.2.7 1.2 4.3 0 5M20 7c2.4 1.6 2.4 8.4 0 10" fill="none" />
  </svg>
);
