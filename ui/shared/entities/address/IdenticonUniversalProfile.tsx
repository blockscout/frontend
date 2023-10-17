import algoliasearch from 'algoliasearch';

import { getEnvValue } from 'configs/app/utils';

const makeUniversalProfileIdenticon: (hash: string) => string | undefined = (hash: string) => {
  // eslint-disable-next-line no-restricted-properties
  const algoliaAppID = getEnvValue(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID);
  // eslint-disable-next-line no-restricted-properties
  const algoliaApiKey = getEnvValue(process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);
  // eslint-disable-next-line no-restricted-properties
  const algoliaIndexName = getEnvValue(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME) || '';

  if (algoliaAppID === undefined || algoliaApiKey === undefined) {
    return undefined;
  }

  const algoliaClient = algoliasearch(algoliaAppID, algoliaApiKey);
  const universalProfileIndex = algoliaClient.initIndex(algoliaIndexName);
  let result: string | undefined;
  universalProfileIndex.search(hash)
    .then(() => {
      result = hash;
    })
    .catch(() => {
      result = undefined;
    });

  return result;
};

export default makeUniversalProfileIdenticon;
