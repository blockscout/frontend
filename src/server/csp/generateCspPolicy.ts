// SPDX-License-Identifier: LicenseRef-Blockscout

import * as descriptors from './policies';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy(isPrivateMode = false, nonce?: string) {
  const policyDescriptor = mergeDescriptors(
    descriptors.app(isPrivateMode),
    // Exclude tracking/analytics sources in private mode
    isPrivateMode ? {} : descriptors.ad(nonce),
    isPrivateMode ? {} : descriptors.connectWallet(),
    descriptors.cloudFlare(),
    descriptors.flashblocks(),
    isPrivateMode ? {} : descriptors.googleAnalytics(),
    descriptors.googleFonts(),
    descriptors.googleReCaptcha(),
    isPrivateMode ? {} : descriptors.growthBook(),
    descriptors.helia(),
    isPrivateMode ? {} : descriptors.marketplace(),
    descriptors.megaEth(),
    isPrivateMode ? {} : descriptors.mixpanel(),
    descriptors.monaco(),
    descriptors.multichain(),
    isPrivateMode ? {} : descriptors.rollbar(),
    isPrivateMode ? {} : descriptors.usercentrics(),
    descriptors.rollup(),
    descriptors.safe(),
    descriptors.usernameApi(),
    descriptors.zetachain(),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
