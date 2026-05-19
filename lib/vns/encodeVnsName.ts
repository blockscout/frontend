/**
 * Percent-encode a VNS name for use inside a URL path segment.
 *
 * Wrap any name that goes into a `route({ pathname, query })` substitution
 * or a fetch URL with this helper. `nextjs-routes` does dynamic-segment
 * substitution but does NOT percent-encode, so an unescaped `/` or `?` in
 * the name breaks the URL.
 */
export function encodeVnsName(name: string): string {
  if (!name) return '';
  return encodeURIComponent(name);
}

/**
 * Inverse of `encodeVnsName` with a guard for malformed percent sequences.
 *
 * `decodeURIComponent` throws `URIError` on lone `%` or `%XY` where XY is
 * not hex. This wrapper catches that throw so a crafted URL doesn't surface
 * as a React error boundary on the cluster / domain detail pages.
 */
export function tryDecodeVnsName(encoded: string, fallback: string = ''): string {
  if (!encoded) return '';
  try {
    return decodeURIComponent(encoded);
  } catch {
    return fallback;
  }
}
