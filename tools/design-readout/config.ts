// The only place the token variable is named: an agent instruction that names it will try to set it.
export const TOKEN_ENV = 'FIGMA_API_KEY';

export const FIGMA_API_BASE = 'https://api.figma.com';

// Layer names that mark page chrome, matched as a case- and whitespace-insensitive substring.
export const CHROME_NAMES: ReadonlyArray<string> = [ 'menu', 'navigation', 'top bar', 'search header', 'footer' ];

// A child "spans" its parent when their edges differ by no more than this; Figma reports fractional
// boxes for auto-layout frames.
export const SPAN_TOLERANCE_PX = 1;

// Where a run's record goes, under the main checkout.
export const SIDECAR_DIR = '.ai/design-readout';

// What a Figma text style name claims, read off its `text-<size>` and `font-<weight>` segments. The
// pixel sizes mirror the `text.*` text styles of the theme, which this tool must not import (they
// read app config).
export const TEXT_STYLE_HINT_SIZES_PX: Readonly<Record<string, number>> = { xs: 12, sm: 14, md: 16, xl: 20 };
export const TEXT_STYLE_HINT_WEIGHTS: Readonly<Record<string, number>> = {
  thin: 100, extralight: 200, light: 300, normal: 400, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900,
};

// A readout role narrows a color lookup to the semantic tokens under these path prefixes.
export const COLOR_ROLE_PREFIXES = {
  text: [ 'text.' ],
  background: [ 'bg.' ],
  border: [ 'border.' ],
  icon: [ 'icon.' ],
} as const;
