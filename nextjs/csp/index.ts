import type { NextRequest } from 'next/server';

import generateCspPolicy from './generateCspPolicy';
import generateNftHtmlEmbedCspPolicy from './generateNftHtmlEmbedCspPolicy';

const NFT_HTML_EMBED_PATH = '/nft-html-embed.html';

let cspPolicies: { 'private': string; 'default': string } | undefined = undefined;
let nftHtmlEmbedCsp: string | undefined = undefined;

async function initializeCspPolicies() {
  if (!cspPolicies) {
    // Generate and cache both policies upfront
    cspPolicies = {
      'private': generateCspPolicy(true),
      'default': generateCspPolicy(false),
    };
  }
}

export async function get(req?: NextRequest): Promise<string> {
  await initializeCspPolicies();

  // Get appProfile from request (header, query param, or cookie)
  const appProfile = req ? (
    req.headers.get('x-app-profile') ||
    req.nextUrl.searchParams.get('app-profile') ||
    req.cookies.get('app_profile')?.value
  ) : undefined;

  const isPrivateMode = appProfile === 'private';

  if (req?.nextUrl.pathname === NFT_HTML_EMBED_PATH && !isPrivateMode) {
    if (!nftHtmlEmbedCsp) {
      nftHtmlEmbedCsp = generateNftHtmlEmbedCspPolicy();
    }

    return nftHtmlEmbedCsp;
  }

  return isPrivateMode ? cspPolicies?.private || '' : cspPolicies?.default || '';
}
