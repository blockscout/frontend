import { Skeleton, Grid } from "@chakra-ui/react";
import React from "react";

import useApiQuery from "lib/api/useApiQuery";
import dayjs from "lib/date/dayjs";
import DetailsInfoItem from "ui/shared/DetailsInfoItem";

const ValidatorDetails = ({ address }: { address: string }) => {
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
        value: data?.validatorAllowNominator ? "YES" : "NO",
      },
      {
        id: "createTime",
        label: "Create Time",
        value: dayjs(Number(data?.validatorRegistrationTime ?? "0")).format(
          "YYYY-MM-DD HH:mm",
        ),
      },
    ];
  }, [ data ]);

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
            isLoading={ isPending }
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
