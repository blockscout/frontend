import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';

// const ALLOWED_DOMAINS = [ 'eth.blockscout.com', 'localhost' ];
const ALLOWED_DOMAINS = [ 'eth.blockscout.com', 'localhost', 'eth-sepolia.k8s-dev.blockscout.com' ];

// Determines if a user should be tracked based on their UUID.
// Uses the last 4 hex characters of the UUID to get a deterministic number (0-65535),
// then checks if mod 100 < 1 for 1% sampling.
function shouldTrackUser(uuid: string): boolean {
  // Extract last 4 hex characters from UUID (e.g., "0000" from "550e8400-e29b-41d4-a716-446655440000")
  const hexPart = uuid.replace(/-/g, '').slice(-4);
  const numericValue = parseInt(hexPart, 16);
  // return (numericValue % 100) < 1;
  return (numericValue % 100) < 50;

}

// Hook to track page views for client-side navigation.
// Sends tracking data to the monitor service on every route change.
// Only tracks 1% of users based on UUID sampling.
export default function usePageViewTracking(initialReferrer: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Store external referrer from initial load (won't change during session)
  const externalReferrer = React.useRef(initialReferrer);

  React.useEffect(() => {
    if (!config.app.host || !ALLOWED_DOMAINS.includes(config.app.host) || config.app.isPrivateMode) {
      return;
    }

    const uuid = cookies.get(cookies.NAMES.UUID);

    // Skip if no UUID (private mode or tracking disabled)
    if (!uuid) {
      return;
    }

    // Only track 1% of users
    if (!shouldTrackUser(uuid)) {
      return;
    }

    const fullUrl = window.location.href;

    fetch('/node-api/monitoring/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: fullUrl,
        uuid,
        externalReferrer: externalReferrer.current,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});

    // Trigger on pathname or search params change (client-side navigation)
  }, [ pathname, searchParams ]);
}
