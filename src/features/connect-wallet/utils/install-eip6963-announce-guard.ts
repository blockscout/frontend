// SPDX-License-Identifier: LicenseRef-Blockscout

let isInstalled = false;

// A non-compliant wallet extension can announce with a null or partial `detail`. wagmi's vendored `mipd`
// store reads `detail.info` unguarded and throws uncaught, which cannot be fixed inside the dependency.
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
