import type { NextRequest } from 'next/server';

import appConfig from 'configs/app';
import * as essentialDappsChainsConfig from 'configs/essential-dapps-chains/config.edge';
import * as multichainConfig from 'configs/multichain/config.edge';
import * as cookiesLib from 'lib/cookies';

import generateCspPolicy from './generateCspPolicy';

const marketplaceFeature = appConfig.features.marketplace;

let cspPolicies: { 'private': string; 'default': string } | undefined = undefined;

async function initializeCspPolicies() {
  if (!cspPolicies) {
    appConfig.features.opSuperchain.isEnabled && await multichainConfig.load();
    marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && await essentialDappsChainsConfig.load();

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
    cookiesLib.getFromCookieString(req.headers.get('cookie') || '', cookiesLib.NAMES.APP_PROFILE)
  ) : undefined;

  const isPrivateMode = appProfile === 'private';

  return isPrivateMode ? cspPolicies!.private : cspPolicies!.default;
}
