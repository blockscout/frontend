/* eslint-disable @stylistic/quotes */
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

  // ✅ 手动添加 font-src 字段，允许加载本地字体、base64 字体、blob 字体
  policyDescriptor['font-src'] = [
    "'self'",
    'data:',
    'blob:',
  ];

  // ✅ （可选）也建议添加对 connect-src 的 ws 支持（用于本地 dev）
  if (!policyDescriptor['connect-src']) {
    // eslint-disable-next-line @stylistic/array-bracket-spacing
    policyDescriptor['connect-src'] = ["'self'", 'ws:'];
  } else if (!policyDescriptor['connect-src'].includes('ws:')) {
    policyDescriptor['connect-src'].push('ws:');
  }

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
