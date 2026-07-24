// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest } from 'next/server';

import { getPrimerScriptCspHashes } from 'src/server/primedRequests';

import generateCspPolicy from './generateCspPolicy';
import generateNftHtmlEmbedCspPolicy from './generateNftHtmlEmbedCspPolicy';

const NFT_HTML_EMBED_PATH = '/nft-html-embed.html';

let cspPolicies: { 'private': string; 'default': string } | undefined = undefined;
let nftHtmlEmbedCsp: string | undefined = undefined;
let primerScriptHashes: Array<string> = [];

async function initializeCspPolicies() {
  if (!cspPolicies) {
    // the early-fetch primer scripts are deterministic per runtime config,
    // so their hashes are computed once and baked into the cached policies
    primerScriptHashes = await getPrimerScriptCspHashes();

    // Generate and cache both policies upfront
    cspPolicies = {
      'private': generateCspPolicy(true, undefined, primerScriptHashes),
      'default': generateCspPolicy(false, undefined, primerScriptHashes),
    };
  }
}

export async function get(req?: NextRequest, nonce?: string): Promise<string> {
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

  if (nonce) {
    return generateCspPolicy(isPrivateMode, nonce, primerScriptHashes);
  }

  return isPrivateMode ? cspPolicies?.private || '' : cspPolicies?.default || '';
}
