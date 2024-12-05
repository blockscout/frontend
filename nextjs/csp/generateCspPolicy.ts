import * as descriptors from './policies';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy() {
  const policyDescriptor = mergeDescriptors(
    descriptors.app(),
    descriptors.ad(),
    descriptors.cloudFlare(),
    descriptors.gasHawk(),
    descriptors.googleAnalytics(),
    descriptors.googleFonts(),
    descriptors.googleReCaptcha(),
    descriptors.growthBook(),
    descriptors.helia(),
    descriptors.marketplace(),
    descriptors.mixpanel(),
    descriptors.monaco(),
    descriptors.rollbar(),
    descriptors.safe(),
    descriptors.usernameApi(),
    descriptors.walletConnect(),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
