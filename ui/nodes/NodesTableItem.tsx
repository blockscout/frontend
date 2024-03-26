import { Tr, Td, Skeleton, Flex } from "@chakra-ui/react";
import React from "react";

import type { NodesPage, StakeValidatorInfo } from "types/api/boolscan";

import { route } from "nextjs-routes";

import useBoolRpcApi from "lib/api/useBoolRpcApi";
import { formatAmount } from "lib/utils/helpers";
import * as EntityBase from "ui/shared/entities/base/components";

import { tableColumns } from "./data";

const NodesTableItem = ({
  isLoaded,
  data,
  index,
}: {
  isLoaded: boolean;
  data: NodesPage["items"][0];
  index: number;
}) => {
  const rpcRes = useBoolRpcApi("staking_validatorInfo", {
    queryParams: [ [ data.validatorAddress ] ],
  });

  const validatorInfo = React.useMemo<StakeValidatorInfo | undefined>(() => {
    return rpcRes.data?.[0];
  }, [ rpcRes.data ]);

  return (
    <Tr>
      { tableColumns.map((col) => {
        let text = col.render?.(data, index);

        if (validatorInfo) {
          if (col.id === "totalStake") {
            text = formatAmount(validatorInfo.total_staking);
          } else if (col.id === "ownerStake") {
            text = formatAmount(validatorInfo.owner_staking);
          } else if (col.id === "nominators") {
            text = validatorInfo.nominators;
          }
        }

        const loaded = !(
          !isLoaded ||
          ([ "totalStake", "ownerStake", "nominators" ].includes(col.id) &&
            rpcRes.isFetching)
        );

        return (
          <Td key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
            <Skeleton
              isLoaded={ loaded }
              display="inline-block"
              minW={ 10 }
              lineHeight="24px"
            >
              { text }
            </Skeleton>

            { col.id === "validatorName" ? (
              <Flex>
                <EntityBase.Link
                  href={ route({
                    pathname: "/validators/[hash]",
                    query: { hash: data.validatorAddress },
                  }) }
                >
                  <EntityBase.Content
                    truncation="constant"
                    fontWeight={ 700 }
                    text={ data.validatorAddress }
                    maxW="100%"
                    isLoading={ !loaded }
                  />
                </EntityBase.Link>
                <EntityBase.Copy
                  text={ data.validatorAddress }
                  // by default we don't show copy icon, maybe this should be revised
                  noCopy={ false }
                />
              </Flex>
            ) : undefined }
          </Td>
        );
      }) }
    </Tr>
  );
};

export default NodesTableItem;
