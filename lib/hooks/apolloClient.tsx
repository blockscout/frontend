import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

import { getEnvValue } from 'configs/app/utils';

export default async function apolloClient(query: string, limit: number, offset: number) {
  const uri = getEnvValue('NEXT_PUBLIC_STORAGE_API_HOST');
  const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
  });
  const queryGql = gql`query Storage($limit: Int = ${ limit }, $offset: Int = ${ offset }) {${ query }}`;
  try {
    const result = await client.query({
      query: queryGql,
      variables: { limit, offset },
    });
    return result.data;
  } catch (error) {
    const result = error;
    return result;
  }
}
