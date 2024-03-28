import { Skeleton, Grid } from "@chakra-ui/react";
import React from "react";

import type { ProviderDetails, ValidatorInfo } from "types/api/boolscan";

import useBoolRpcApi from "lib/api/useBoolRpcApi";
import dayjs from "lib/date/dayjs";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";
import DetailsInfoItem from "ui/shared/DetailsInfoItem";
import DHCStatusTag from "ui/shared/tags/HDCStatusTag";

const DHCDetails = ({
  providerID,
  providerDetails,
  isLoading,
}: {
  providerID: string;
  providerDetails?: ProviderDetails;
  isLoading: boolean;
}) => {
  const rpcRes = useBoolRpcApi("mining_getProviderInfo", {
    queryParams: [ Number(providerID) ],
  });

  const validatorInfo = React.useMemo<ValidatorInfo | undefined>(() => {
    return rpcRes.data;
  }, [ rpcRes.data ]);

  const formData = React.useMemo(() => {
    return [
      { id: "pid", label: "PID", value: providerID },
      {
        id: "status",
        label: "Status",
        value: <DHCStatusTag status={ providerDetails?.deviceState }/>,
      },
      {
        id: "stake",
        label: "Stake",
        value: `${ formatAmount(validatorInfo?.total_pledge ?? "0") } ${
          currencyUnits.ether
        }`,
      },
      {
        id: "device",
        label: "Device",
        value: providerDetails?.deviceId,
      },
      {
        id: "createTime",
        label: "Create Time",
        value: dayjs(Number(providerDetails?.chainTime ?? "0")).format(
          "YYYY-MM-DD HH:mm",
        ),
      },
    ];
  }, [ providerDetails, providerID, validatorInfo ]);

  return (
    <Grid
      columnGap={ 4 }
      rowGap={{ base: 1, lg: 2 }}
      templateColumns={{ base: "minmax(0, 1fr)", lg: "auto minmax(0, 1fr)" }}
      overflow="hidden"
    >
      { formData.map((item) => {
        return (
          <DetailsInfoItem
            key={ item.id }
            title={ item.label }
            alignSelf="center"
            isLoading={ item.id === "stake" ? rpcRes.isLoading : isLoading }
          >
            <Skeleton isLoaded={ !isLoading } display="inline-block">
              <span>{ item.value }</span>
            </Skeleton>
          </DetailsInfoItem>
        );
      }) }
    </Grid>
  );
};

export default DHCDetails;
