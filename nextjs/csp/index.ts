// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest } from 'next/server';

import generateCspPolicy from './generateCspPolicy';
import generateNftHtmlEmbedCspPolicy from './generateNftHtmlEmbedCspPolicy';

const NFT_HTML_EMBED_PATH = '/nft-html-embed.html';

let nftHtmlEmbedCsp: string | undefined = undefined;

export async function get(req?: NextRequest, nonce?: string): Promise<string> {
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

  return generateCspPolicy(isPrivateMode, nonce);
}
