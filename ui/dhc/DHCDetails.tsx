import { Skeleton, Grid } from "@chakra-ui/react";
import React from "react";

import type { ProviderDetails } from "types/api/boolscan";

import dayjs from "lib/date/dayjs";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";
import DetailsInfoItem from "ui/shared/DetailsInfoItem";

const DHCDetails = ({
  providerID,
  providerDetails,
  isLoading,
}: {
  providerID: string;
  providerDetails?: ProviderDetails;
  isLoading: boolean;
}) => {
  const formData = React.useMemo(() => {
    return [
      { id: "pid", label: "PID", value: providerID },
      {
        id: "createTime",
        label: "Create Time",
        value: dayjs(Number(providerDetails?.chainTime ?? "0")).format(
          "YYYY-MM-DD HH:mm",
        ),
      },
      {
        id: "device",
        label: "Device",
        value: providerDetails?.deviceId,
      },
      {
        id: "stake",
        label: "Stake",
        value: `${ formatAmount(providerDetails?.totalCap ?? "0") } ${
          currencyUnits.ether
        }`,
      },
    ];
  }, [ providerDetails, providerID ]);

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
            isLoading={ isLoading }
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
