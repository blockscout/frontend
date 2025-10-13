import type { Feature } from './types';
import type { EssentialDappsConfig } from 'types/client/marketplace';

import apis from '../apis';
import chain from '../chain';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from '../utils';
import blockchainInteraction from './blockchainInteraction';

// config file will be downloaded at run-time and saved in the public folder
const enabled = getEnvValue('NEXT_PUBLIC_MARKETPLACE_ENABLED');
const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL');
const submitFormUrl = getEnvValue('NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM');
const suggestIdeasFormUrl = getEnvValue('NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM');
const categoriesUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL');
const featuredApp = getEnvValue('NEXT_PUBLIC_MARKETPLACE_FEATURED_APP');
const bannerContentUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL');
const bannerLinkUrl = getEnvValue('NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL');
const graphLinksUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL');
const essentialDappsConfig = parseEnvJson<EssentialDappsConfig>(getEnvValue('NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG'));

const title = 'Marketplace';

const config: Feature<(
  { configUrl: string } |
  { api: { endpoint: string; basePath?: string } }
) & {
  submitFormUrl: string;
  categoriesUrl: string | undefined;
  suggestIdeasFormUrl: string | undefined;
  featuredApp: string | undefined;
  banner: { contentUrl: string; linkUrl: string } | undefined;
  graphLinksUrl: string | undefined;
  essentialDapps: EssentialDappsConfig | undefined;
}> = (() => {
  if (enabled === 'true' && chain.rpcUrls.length > 0 && submitFormUrl) {
    const props = {
      submitFormUrl,
      categoriesUrl,
      suggestIdeasFormUrl,
      featuredApp,
      banner: bannerContentUrl && bannerLinkUrl ? {
        contentUrl: bannerContentUrl,
        linkUrl: bannerLinkUrl,
      } : undefined,
      graphLinksUrl,
      essentialDapps: blockchainInteraction.isEnabled ? (essentialDappsConfig || undefined) : undefined,
    };

    if (configUrl) {
      return Object.freeze({
        title,
        isEnabled: true,
        configUrl,
        ...props,
      });
    } else if (apis.admin) {
      return Object.freeze({
        title,
        isEnabled: true,
        api: apis.admin,
        ...props,
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
