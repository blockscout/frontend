import { ApolloClient, InMemoryCache } from '@apollo/client';

import { getEnvValue } from 'configs/app/utils';

// Get storage API host, support relative paths
const storageApiHost = getEnvValue('NEXT_PUBLIC_STORAGE_API_HOST');
// If it's a relative path (starts with /), resolve it to full URL in browser
const uri = storageApiHost?.startsWith('/') 
  ? (typeof window !== 'undefined' 
      ? `${window.location.origin}${storageApiHost}`
      : storageApiHost) // SSR: keep relative, browser will resolve
  : storageApiHost;

const client = new ApolloClient({
  uri: uri || 'http://localhost:8080/v1/graphql',
  cache: new InMemoryCache(),
});

export default client;
