// Syntactic validators for user-controlled VNS name fragments. These run at
// the page boundary (route param read, before any backend call) so that
// crafted input cannot reach `useApiQuery` / `eth_call`.
//
// These are intentionally PERMISSIVE on the allowed character set — VNS uses
// the BENS / Clusters server as the authoritative parser, and any actual ABI
// resolution happens server-side. The job of these helpers is only to keep
// pathological characters (path separators, control codes, URL meta) out of
// the request before the network round trip.

const MAX_TOTAL_LEN = 253;
const MAX_LABEL_LEN = 63;
// Forbid path traversal, URL meta, whitespace, and ASCII controls. The set
// here is the union of "things that break URL paths or JSON bodies" plus
// "Unicode bidi / zero-width that homoglyph-spoof the displayed label".
const FORBIDDEN_CHARS_RE = new RegExp(
  '[' +
    '\\u0000-\\u001F' +   // C0 controls
    '\\u007F' +           // DEL
    '\\u0020' +           // space
    '/' + '\\\\' +        // path separators
    '\\?' + '#' +         // URL meta
    '\\u200B-\\u200D' +   // zero-width
    '\\u202A-\\u202E' +   // bidi
    '\\u2066-\\u2069' +   // bidi isolates
    '\\uFEFF' +           // BOM
  ']',
);
const CLUSTER_FORBIDDEN_CHARS_RE = new RegExp(
  '[' +
    '\\u0000-\\u001F' +
    '\\u007F' +
    '\\u0020' +
    '\\\\' +              // backslash (forward slash OK for sub-clusters)
    '\\?' + '#' +
    '\\u200B-\\u200D' +
    '\\u202A-\\u202E' +
    '\\u2066-\\u2069' +
    '\\uFEFF' +
  ']',
);

/**
 * Returns true iff the given string is a syntactically valid VNS domain name
 * (BENS-shape: dot-separated labels, 1-63 chars per label, <=253 total).
 */
export function isValidVnsName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  if (name.length > MAX_TOTAL_LEN) return false;
  if (name.startsWith('.') || name.endsWith('.')) return false;
  if (name.includes('..')) return false;
  if (FORBIDDEN_CHARS_RE.test(name)) return false;

  const labels = name.split('.');
  for (const label of labels) {
    if (label.length === 0) return false;
    if (label.length > MAX_LABEL_LEN) return false;
  }
  return true;
}

/**
 * Returns true iff the given string is a syntactically valid Clusters name
 * (Clusters spec: ASCII or Unicode chars, slash-separated for sub-clusters,
 * <=253 total).
 */
export function isValidClusterName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  if (name.length > MAX_TOTAL_LEN) return false;
  if (name.startsWith('/') || name.endsWith('/')) return false;
  if (name.includes('//')) return false;
  if (name.includes('/../') || name.startsWith('../') || name.endsWith('/..')) return false;
  if (name === '..' || name === '.') return false;
  if (CLUSTER_FORBIDDEN_CHARS_RE.test(name)) return false;

  const segments = name.split('/');
  for (const segment of segments) {
    if (segment.length === 0) return false;
    if (segment === '..' || segment === '.') return false;
  }
  return true;
}
