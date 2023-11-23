import algoliasearch from 'algoliasearch';

import { getEnvValue } from '../../configs/app/utils';

const algolia = {
  appId: getEnvValue('Algolia') || '',
  apiKey: getEnvValue('Algolia') || '',
  index: getEnvValue('Algolia') || '',
};

export const algoliaIndex = algoliasearch(algolia.appId, algolia.apiKey).initIndex(algolia.index);
