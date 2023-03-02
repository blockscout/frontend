import _mergeWith from 'lodash/mergeWith';

import * as descriptors from './policies';
import { makePolicyString } from './utils';

const concat = (one: Array<unknown> | undefined, two: Array<unknown> | undefined) =>
  one ? one.concat(two || []) : two;

function generateCspPolicy() {
  const policyDescriptor = _mergeWith(
    _mergeWith(
      descriptors.app(),
      descriptors.ad(),
      descriptors.googleAnalytics(),
      descriptors.googleFonts(),
      concat,
    ),
    _mergeWith(
      descriptors.googleReCaptcha(),
      descriptors.sentry(),
      descriptors.walletConnect(),
      concat,
    ),
    concat,
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
