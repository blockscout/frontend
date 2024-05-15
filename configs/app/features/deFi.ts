import type { Feature } from './types';

import { getEnvValue } from '../utils';
import marketplace from './marketplace';

const swapButtonUrl = getEnvValue('NEXT_PUBLIC_SWAP_BUTTON_URL');
const paymentLinkUrl = getEnvValue('NEXT_PUBLIC_PAYMENT_LINK_URL');

const title = 'Blockscout DeFi';

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

function createFeatureDetails(value: string | undefined) {
  if (value) {
    if (isValidUrl(value)) {
      return { url: value };
    } else if (marketplace.isEnabled) {
      return { dappId: value };
    }
  }
  return undefined;
}

const swapButton = createFeatureDetails(swapButtonUrl);
const paymentLink = createFeatureDetails(paymentLinkUrl);

const isEnabled = Boolean(swapButton) || Boolean(paymentLink);

const config: Feature<{
  swapButton?: { dappId: string } | { url: string };
  paymentLink?: { dappId: string } | { url: string };
}> = isEnabled ?
  Object.freeze({
    title,
    isEnabled: true,
    swapButton,
    paymentLink,
  }) :
  Object.freeze({
    title,
    isEnabled: false,
  });

export default config;
