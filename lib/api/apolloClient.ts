import { ApolloClient, InMemoryCache } from '@apollo/client';

import { getEnvValue } from 'configs/app/utils';

const client = new ApolloClient({
  uri: getEnvValue('NEXT_PUBLIC_STORAGE_API_HOST'),
  cache: new InMemoryCache(),
});

export default client;
