import { Grid } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import React from "react";

import type { StakeValidatorInfo } from "types/api/boolscan";

import useApiQuery from "lib/api/useApiQuery";
import useBoolRpcApi from "lib/api/useBoolRpcApi";
import { WEI } from "lib/consts";
import dayjs from "lib/date/dayjs";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";
import ChartWidget from "ui/shared/chart/ChartWidget";

const DHCStatistic = ({ address }: { address: string }) => {
  const queryParams = React.useMemo(() => {
    return {
      startTime: dayjs().subtract(10, "day").valueOf(),
      endTime: dayjs().valueOf(),
    };
  }, []);
  const { data, isPending, isError } = useApiQuery("validator_statistic", {
    queryParams: {
      address,
      ...queryParams,
    },
  });

  const rpcRes = useBoolRpcApi("staking_validatorInfo", {
    queryParams: [ [ address ] ],
  });

  const validatorInfo = React.useMemo<StakeValidatorInfo | undefined>(() => {
    return rpcRes.data?.[0];
  }, [ rpcRes.data ]);

  // const [selectedDates, setSelectedDates] = React.useState<Date[]>([
  //   new Date(),
  //   new Date(),
  // ]);

  const statisticData = React.useMemo(() => {
    return {
      reward:
        data?.map((item) => {
          return {
            date: new Date(item.day),
            value: BigNumber(item.reward).dividedBy(WEI).toNumber(),
          };
        }) ?? [],
      punish:
        data?.map((item) => {
          return {
            date: new Date(item.day),
            value: BigNumber(item.punish).dividedBy(WEI).toNumber(),
          };
        }) ?? [],
    };
  }, [ data ]);

  return (
    <Grid
      templateColumns={{ lg: "repeat(1, minmax(0, 1fr))" }}
      gap={ 4 }
      paddingTop={ 4 }
    >
      { /* <RangeDatepicker
        selectedDates={selectedDates}
        onDateChange={setSelectedDates}
        propsConfigs={{
          dayOfMonthBtnProps: {
            defaultBtnProps: {
              backgroundColor: useColorModeValue("orange.50", "black"),
            },
            selectedBtnProps: {
              backgroundColor: useColorModeValue("orange.100", "black"),
            },
            _hover: {
              backgroundColor: useColorModeValue("orange.200", "black"),
            },
          },
        }}
      /> */ }
      <ChartWidget
        items={ statisticData.reward }
        title="Reward"
        isLoading={ isPending }
        isError={ isError }
        description={ `Total: ${ formatAmount(
          validatorInfo?.total_staking ?? "0",
        ) } ${ currencyUnits.ether }` }
        minH="230px"
      />

      <ChartWidget
        items={ statisticData.punish }
        title="Punish"
        isLoading={ isPending }
        isError={ isError }
        description="Total: -"
        minH="230px"
      />
    </Grid>
  );
};

export default DHCStatistic;
