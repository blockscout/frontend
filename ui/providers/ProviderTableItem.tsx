import { Skeleton, Tr, Td } from "@chakra-ui/react";
import React from "react";

import type { ProvidersPage, ValidatorInfo } from "types/api/boolscan";

import { route } from "nextjs-routes";

import useBoolRpcApi from "lib/api/useBoolRpcApi";
import { formatAmount } from "lib/utils/helpers";
import * as EntityBase from "ui/shared/entities/base/components";

import { tableColumns } from "./data";

const ProviderTableItem = ({
  provider,
  isLoaded,
}: {
  provider: ProvidersPage["items"][0];
  isLoaded: boolean;
}) => {
  const rpcRes = useBoolRpcApi("mining_getProviderInfo", {
    queryParams: [ Number(provider.providerID) ],
  });

  const validatorInfo = React.useMemo<ValidatorInfo | undefined>(() => {
    return rpcRes.data;
  }, [ rpcRes.data ]);

  return (
    <Tr>
      { tableColumns.map((col, i) => {
        return (
          <Td key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
            { col.id === "providerCap" ? (
              <Skeleton
                isLoaded={ !rpcRes.isLoading }
                display="inline-block"
                minW={ 10 }
                lineHeight="24px"
              >
                { formatAmount(validatorInfo?.total_pledge ?? "0") }
              </Skeleton>
            ) : (
              <Skeleton
                isLoaded={ isLoaded }
                display="inline-block"
                minW={ 10 }
                lineHeight="24px"
              >
                { i === 0 ? (
                  <EntityBase.Link
                    href={ route({
                      pathname: "/dhcs/[id]",
                      query: { id: provider.providerID },
                    }) }
                  >
                    { col.render?.(provider) }
                  </EntityBase.Link>
                ) : (
                  col.render?.(provider)
                ) }
              </Skeleton>
            ) }
          </Td>
        );
      }) }
    </Tr>
  );
};

export default ProviderTableItem;
