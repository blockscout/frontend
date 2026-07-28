// SPDX-License-Identifier: LicenseRef-Blockscout

import * as descriptors from './policies';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy(isPrivateMode = false, nonce?: string, primerScriptHashes?: Array<string>) {
  const policyDescriptor = mergeDescriptors(
    descriptors.addressProfileApi(),
    descriptors.app(isPrivateMode, primerScriptHashes),
    descriptors.ads(isPrivateMode, nonce),
    descriptors.connectWallet(isPrivateMode),
    descriptors.cloudFlare(isPrivateMode),
    descriptors.flashblocks(),
    descriptors.googleAnalytics(isPrivateMode),
    descriptors.growthbook(isPrivateMode),
    descriptors.marketplace(isPrivateMode),
    descriptors.megaEth(),
    descriptors.mixpanel(isPrivateMode),
    descriptors.monaco(),
    descriptors.multichain(),
    descriptors.rollbar(isPrivateMode),
    descriptors.usercentrics(isPrivateMode),
    descriptors.rollup(),
    descriptors.reCaptcha(isPrivateMode),
    descriptors.safe(),
    descriptors.verifiedFetch(),
    descriptors.zetachain(),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
