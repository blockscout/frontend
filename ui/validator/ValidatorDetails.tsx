import { Skeleton, Grid } from "@chakra-ui/react";
import React from "react";

import type { StakeValidatorInfo } from "types/api/boolscan";

import useApiQuery from "lib/api/useApiQuery";
import dayjs from "lib/date/dayjs";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";
import DetailsInfoItem from "ui/shared/DetailsInfoItem";

const ValidatorDetails = ({
  address,
  validator,
  loading,
}: {
  address: string;
  validator?: StakeValidatorInfo;
  loading: boolean;
}) => {
  const { data, isPending } = useApiQuery("validator_details", {
    queryParams: {
      address,
    },
  });

  const formData = React.useMemo(() => {
    return [
      { id: "name", label: "Name", value: data?.validatorName },
      { id: "fee", label: "Fee", value: `${ data?.validatorFeeRatio ?? "0" }%` },

      { id: "active", label: "Active", value: data?.validatorStatus },
      {
        id: "nominators",
        label: "Nominators",
        value: validator?.nominators ?? "0",
      },
      {
        id: "totalStake",
        label: "Total Stake",
        value: `${ formatAmount(validator?.total_staking ?? '0') } ${ currencyUnits.ether }`,
      },
      {
        id: "ownerStake",
        label: "Owner Stake",
        value: `${ formatAmount(validator?.owner_staking ?? '0') } ${ currencyUnits.ether }`,
      },
      {
        id: "createTime",
        label: "Create Time",
        value: dayjs(Number(data?.validatorRegistrationTime ?? "0")).format(
          "YYYY-MM-DD HH:mm",
        ),
      },
    ];
  }, [ data, validator ]);

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
            isLoading={ isPending || loading }
          >
            <Skeleton isLoaded={ !isPending } display="inline-block">
              <span>{ item.value }</span>
            </Skeleton>
          </DetailsInfoItem>
        );
      }) }
    </Grid>
  );
};

export default ValidatorDetails;
