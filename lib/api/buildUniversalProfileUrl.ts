import algoliasearch from 'algoliasearch';

import { getEnvValue } from '../../configs/app/utils';

const algolia = {
  appId: getEnvValue('NEXT_PUBLIC_ALGOLIA_APP_ID') || '',
  apiKey: getEnvValue('NEXT_PUBLIC_ALGOLIA_API_KEY') || '',
  index: getEnvValue('NEXT_PUBLIC_ALGOLIA_INDEX_NAME') || '',
};

export const algoliaIndex = algoliasearch(algolia.appId, algolia.apiKey).initIndex(algolia.index);
