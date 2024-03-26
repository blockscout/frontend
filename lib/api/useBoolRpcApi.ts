import type {
  StakeValidatorInfoParams,
  ValidatorInfoParams,
} from "types/api/boolscan";

import useApiQuery from "./useApiQuery";

type RpcName = "staking_validatorInfo" | "mining_getProviderInfo";
type RpcQueryParams<R extends RpcName> = R extends "staking_validatorInfo"
  ? StakeValidatorInfoParams
  : R extends "mining_getProviderInfo"
    ? ValidatorInfoParams
    : never;

interface Params<R extends RpcName> {
  queryParams?: RpcQueryParams<R>;
}

export function getResourceKey<R extends RpcName>(
  resource: string,
  {
    params,
  }: {
    params: {
      [key: string]:
      | Params<R>
      | number
      | string
      | Array<string | number>
      | undefined;
    };
  },
) {
  if (params) {
    return [ resource, { ...params } ];
  }

  return [ resource ];
}
const useBoolRpcApi = <R extends RpcName>(
  methodName: R,
  { queryParams }: Params<R>,
) => {
  const params = {
    jsonrpc: "2.0",
    id: 1,
    method: methodName,
    params: queryParams,
  };
  return useApiQuery("bool_rpc", {
    queryParams: {},
    fetchParams: { method: "post", body: params },
    queryOptions: {
      queryHash: Buffer.from(queryParams?.toString() ?? "").toString("hex"),
    },
  });
};

export default useBoolRpcApi;
