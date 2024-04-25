import useApiQuery from 'lib/api/useApiQuery';
import * as tokenStubs from 'stubs/token';

export default function useTokenQuery(hash: string) {
  return useApiQuery('token', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: tokenStubs.TOKEN_INFO_ERC_20,
    },
  });
}
