import * as descriptors from './policies';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy() {
  const policyDescriptor = mergeDescriptors(
    descriptors.app(),
    descriptors.ad(),
    descriptors.cloudFlare(),
    descriptors.flashblocks(),
    descriptors.gasHawk(),
    descriptors.googleAnalytics(),
    descriptors.googleFonts(),
    descriptors.googleReCaptcha(),
    descriptors.growthBook(),
    descriptors.helia(),
    descriptors.marketplace(),
    descriptors.megaEth(),
    descriptors.mixpanel(),
    descriptors.monaco(),
    descriptors.multichain(),
    descriptors.rollbar(),
    descriptors.rollup(),
    descriptors.safe(),
    descriptors.usernameApi(),
    descriptors.walletConnect(),
    descriptors.zetachain(),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
