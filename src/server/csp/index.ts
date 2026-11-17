// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest } from 'next/server';

import { getPrimerScriptCspHashes } from 'src/server/primedRequests';

import { resolveCustomRpcUrl } from 'src/features/connect-wallet/utils/rpc-urls';

import * as cookies from 'src/shared/storage/cookies';

import generateCspPolicy from './generateCspPolicy';
import generateNftHtmlEmbedCspPolicy from './generateNftHtmlEmbedCspPolicy';

const NFT_HTML_EMBED_PATH = '/nft-html-embed.html';

// stands in for the per-request nonce so that policies with a nonce can be built once too:
// a request only swaps this token for its own nonce instead of merging all descriptors again.
// must be alphanumeric to be a valid nonce value, and distinctive enough to never occur elsewhere in a policy
export const CSP_NONCE_PLACEHOLDER = 'blockscoutCspNoncePlaceholder';

type CspPolicies = { 'private': string; 'default': string };

let cspPolicies: CspPolicies | undefined = undefined;
let cspPolicyTemplates: CspPolicies | undefined = undefined;
let nftHtmlEmbedCsp: string | undefined = undefined;

async function initializeCspPolicies() {
  if (!cspPolicies) {
    // the early-fetch primer scripts are deterministic per runtime config,
    // so their hashes are computed once and baked into the cached policies
    const primerScriptHashes = await getPrimerScriptCspHashes();

    // Generate and cache all policy variants upfront
    cspPolicies = {
      'private': generateCspPolicy(true, undefined, primerScriptHashes),
      'default': generateCspPolicy(false, undefined, primerScriptHashes),
    };
    cspPolicyTemplates = {
      'private': generateCspPolicy(true, CSP_NONCE_PLACEHOLDER, primerScriptHashes),
      'default': generateCspPolicy(false, CSP_NONCE_PLACEHOLDER, primerScriptHashes),
    };
  }
}

function getCustomRpcOrigin(req: NextRequest | undefined): string | undefined {
  const url = resolveCustomRpcUrl(
    req?.cookies.get(cookies.NAMES.CUSTOM_RPC_URL)?.value,
    req?.cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE)?.value,
  );

  return url ? new URL(url).origin : undefined;
}

// the cached policies are shared by every request; the user's own RPC node is spliced in per request
function withCustomRpcOrigin(policy: string, origin: string | undefined): string {
  return origin ? policy.replace('connect-src ', `connect-src ${ origin } `) : policy;
}

export async function get(req?: NextRequest, nonce?: string): Promise<string> {
  await initializeCspPolicies();

  const customRpcOrigin = getCustomRpcOrigin(req);

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
    const template = isPrivateMode ? cspPolicyTemplates?.private : cspPolicyTemplates?.default;
    return withCustomRpcOrigin(template?.replaceAll(CSP_NONCE_PLACEHOLDER, nonce) || '', customRpcOrigin);
  }

  return withCustomRpcOrigin(isPrivateMode ? cspPolicies?.private || '' : cspPolicies?.default || '', customRpcOrigin);
}
