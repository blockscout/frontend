import * as descriptors from './policies';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy() {
  const policyDescriptor = mergeDescriptors(
    descriptors.app(),
    descriptors.ad(),
    descriptors.cloudFlare(),
    descriptors.googleAnalytics(),
    descriptors.googleFonts(),
    descriptors.googleReCaptcha(),
    descriptors.growthBook(),
    descriptors.mixpanel(),
    descriptors.monaco(),
    descriptors.safe(),
    descriptors.sentry(),
    descriptors.walletConnect(),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
