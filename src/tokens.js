// ── Design Tokens ──
// Earthy Neutrals & Greens: sage green (primary accent), warm taupe
// (secondary/Focus Room accent), soft sand (text). Token names kept as-is
// (teal/buf) to avoid touching every call site — only the hex values moved.
export const V = {
  bg: '#16140F', surface: '#211D16', surfaceR: '#282319',
  border: 'rgba(234,225,207,0.06)', borderH: 'rgba(234,225,207,0.12)',
  text: '#EAE1CF', textM: 'rgba(234,225,207,0.45)', textD: 'rgba(234,225,207,0.22)',
  accent: '#9CAF88', accentM: 'rgba(156,175,136,0.13)', accentG: 'rgba(156,175,136,0.25)',
  teal: '#C2AC87', tealM: 'rgba(194,172,135,0.10)',
  red: '#C1614A', green: '#8FBF7A',
  buf: '#8B9A9C', bufM: 'rgba(139,154,156,0.10)',
  mono: "'JetBrains Mono','Fira Code',monospace",
  sans: "'Sora',sans-serif",
};

export const SC = ['#9CAF88','#C2AC87','#C17A5A','#94A06A','#8FBF7A','#D08B62','#B08D5B','#A3AD97'];
