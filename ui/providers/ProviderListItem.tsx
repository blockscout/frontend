import { Skeleton, HStack } from "@chakra-ui/react";
import React from "react";

import type { ProvidersPage, ValidatorInfo } from "types/api/boolscan";

import { route } from "nextjs-routes";

import useBoolRpcApi from "lib/api/useBoolRpcApi";
import { formatAmount } from "lib/utils/helpers";
import * as EntityBase from "ui/shared/entities/base/components";
import ListItemMobile from "ui/shared/ListItemMobile/ListItemMobile";
import DHCStatusTag from "ui/shared/tags/HDCStatusTag";

import { tableColumns } from "./data";

const ProviderListItem = ({
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
    <ListItemMobile rowGap={ 3 }>
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
          <HStack key={ col.id } spacing={ 3 }>
            <Skeleton isLoaded={ isLoaded } fontSize="sm" fontWeight={ 500 }>
              { col.label }
            </Skeleton>
            <Skeleton
              isLoaded={ col.id === "providerCap" ? !rpcRes.isLoading : isLoaded }
              fontSize="sm"
              ml="auto"
              minW={ 10 }
              color="text_secondary"
            >
              { content }
            </Skeleton>
          </HStack>
        );
      }) }
    </ListItemMobile>
  );
};

export default ProviderListItem;
