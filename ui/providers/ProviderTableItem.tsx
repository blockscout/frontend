import { Skeleton, Tr, Td } from "@chakra-ui/react";
import React from "react";

import type { ProvidersPage, ValidatorInfo } from "types/api/boolscan";

import { route } from "nextjs-routes";

import useBoolRpcApi from "lib/api/useBoolRpcApi";
import { formatAmount } from "lib/utils/helpers";
import * as EntityBase from "ui/shared/entities/base/components";
import DHCStatusTag from "ui/shared/tags/HDCStatusTag";

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
        let content = col.render?.(provider);

        if (col.id === "providerCap") {
          content = formatAmount(validatorInfo?.total_pledge ?? "0");
        } else if (i === 0) {
          content = (
            <EntityBase.Link
              href={ route({
                pathname: "/dhcs/[id]",
                query: { id: provider.providerID },
              }) }
            >
              { col.render?.(provider) }
            </EntityBase.Link>
          );
        } else if (col.id === "deviceStatus") {
          content = <DHCStatusTag status={ provider.deviceState }/>;
        }

        return (
          <Td key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
            <Skeleton
              isLoaded={ col.id === "providerCap" ? !rpcRes.isLoading : isLoaded }
              display="inline-block"
              minW={ 10 }
              lineHeight="24px"
            >
              { content }
            </Skeleton>
          </Td>
        );
      }) }
    </Tr>
  );
};

export default ProviderTableItem;
