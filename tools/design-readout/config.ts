// The only place the token variable is named: an agent instruction that names it will try to set it.
export const TOKEN_ENV = 'FIGMA_API_KEY';

export const FIGMA_API_BASE = 'https://api.figma.com';

// Layer names that mark page chrome, matched as a case- and whitespace-insensitive substring.
export const CHROME_NAMES: ReadonlyArray<string> = [ 'menu', 'navigation', 'top bar', 'search header', 'footer' ];

// A child "spans" its parent when their edges differ by no more than this; Figma reports fractional
// boxes for auto-layout frames.
export const SPAN_TOLERANCE_PX = 1;

// A readout role narrows a color lookup to the semantic tokens under these path prefixes.
export const COLOR_ROLE_PREFIXES = {
  text: [ 'text.' ],
  background: [ 'bg.' ],
  border: [ 'border.' ],
  icon: [ 'icon.' ],
} as const;
