import { getEnvValue } from '../utils';

const defaultTxHash = getEnvValue(process.env.NEXT_PUBLIC_GRAPHIQL_TRANSACTION);

export default Object.freeze({
  title: 'GraphQL API documentation',
  isEnabled: true,
  defaultTxHash,
});
