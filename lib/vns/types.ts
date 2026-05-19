// Branded types so a raw `string` cannot accidentally satisfy a parameter that
// expects a validated VNS name. Construct via `asVnsName(name)` which routes
// through the syntactic validator.

import { isValidClusterName, isValidVnsName } from './isValidVnsName';

export type VnsName = string & { readonly __brand: 'VnsName' };
export type ClusterName = string & { readonly __brand: 'ClusterName' };

/**
 * Narrow a raw string to a `VnsName` if it passes syntactic validation;
 * return `null` otherwise. Call this at the route-param boundary, BEFORE
 * any API call.
 */
export function asVnsName(value: string): VnsName | null {
  return isValidVnsName(value) ? (value as VnsName) : null;
}

/**
 * Narrow a raw string to a `ClusterName` if it passes syntactic validation.
 */
export function asClusterName(value: string): ClusterName | null {
  return isValidClusterName(value) ? (value as ClusterName) : null;
}
