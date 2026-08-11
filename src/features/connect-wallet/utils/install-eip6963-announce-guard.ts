// SPDX-License-Identifier: LicenseRef-Blockscout

// https://eips.ethereum.org/EIPS/eip-6963

let isInstalled = false;

/**
 * Drops malformed `eip6963:announceProvider` events before any consumer's listener runs.
 *
 * EIP-6963 requires the event's `detail` to carry a provider `info`, but a non-compliant wallet
 * extension can dispatch one with a null or partial `detail`. Consumers dereference `detail.info`
 * without guarding — wagmi's vendored `mipd` store (`providerDetail.info.uuid`) most of all — and
 * throw an uncaught "Cannot read properties of null (reading 'info')" we cannot fix inside the
 * dependency.
 *
 * Listeners on `window` for a window-targeted event fire in registration order, so installing this
 * before wagmi's config is created (which spins up the `mipd` store) lets it run first and
 * `stopImmediatePropagation()` the malformed event, neutralising it for every downstream consumer at
 * once. Idempotent.
 */
export function installEip6963AnnounceGuard(): void {
  if (isInstalled || typeof window === 'undefined') {
    return;
  }
  isInstalled = true;

  window.addEventListener('eip6963:announceProvider', (event) => {
    const detail = (event as CustomEvent).detail;
    if (detail === null || typeof detail !== 'object' || !('info' in detail) || !detail.info) {
      event.stopImmediatePropagation();
    }
  }, true);
}
