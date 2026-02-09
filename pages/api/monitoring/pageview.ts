import type { NextApiRequest, NextApiResponse } from 'next';

import { isKnownBotRequest, isLikelyHumanBrowser } from 'nextjs/utils/checkRealBrowser';

const MONITOR_ENDPOINT = 'https://monitor.blockscout.com/pageview';

// Validates that the request is coming from a browser on the same origin.
// Sec-Fetch-Site header is set automatically by browsers and cannot be spoofed via JS.
function isSameOriginRequest(req: NextApiRequest): boolean {
  const secFetchSite = req.headers['sec-fetch-site'];
  return secFetchSite === 'same-origin';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (process.env.DISABLE_TRACKING === 'true') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!isSameOriginRequest(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!isLikelyHumanBrowser(req) || isKnownBotRequest(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(MONITOR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    res.status(response.status).json({ status: response.ok ? 'ok' : 'error' });
  } catch {
    res.status(500).json({ status: 'error' });
  } finally {
    clearTimeout(timeoutId);
  }
}
