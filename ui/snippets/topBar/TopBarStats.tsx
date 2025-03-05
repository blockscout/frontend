import { Flex, Link, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import { HOMEPAGE_STATS } from 'stubs/stats';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import TextSeparator from 'ui/shared/TextSeparator';

const TopBarStats = () => {
  const isMobile = useIsMobile();

  // 价格
  const [dbcInfo, setDbcInfo] = React.useState({
    price: 0,
    change: 0,
  });

  async function fetchDbcInfo() {
    const url = 'https://dbchaininfo.congtu.cloud/query/dbc_info';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: any = await response.json();
      console.log(data, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      setDbcInfo({
        price: data.content.dbc_price,
        change: data.content.percent_change_24h,
      });
      return data;
    } catch (error) {
      console.error('Error fetching DBC info:', error);
      throw error;
    }
  }

  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useApiQuery('stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }
    fetchDbcInfo();

    const endDate = dayjs(dataUpdatedAt).add(data.gas_prices_update_in, 'ms');
    const timeout = endDate.diff(dayjs(), 'ms');

    if (timeout <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      refetch();
    }, timeout);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isPlaceholderData, data?.gas_price_updated_at, dataUpdatedAt, data?.gas_prices_update_in, refetch]);

  if (isError) {
    return <div />;
  }

  return (
    <Flex alignItems="center" fontSize="xs" fontWeight={500}>
      {data?.coin_price && (
        <Flex columnGap={1}>
          <Skeleton isLoaded={!isPlaceholderData}>
            <chakra.span color="text_secondary">{config.chain.currency.symbol} </chakra.span>
            <span>
              $
              {/* {Number(data.coin_price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })} */}
              {dbcInfo.price}
            </span>
          </Skeleton>
          {data.coin_price_change_percentage && (
            <Skeleton isLoaded={!isPlaceholderData}>
              <chakra.span color={dbcInfo.change >= 0 ? 'green.500' : 'red.500'}>{dbcInfo.change}%</chakra.span>
            </Skeleton>
          )}
        </Flex>
      )}
      {!isMobile && data?.secondary_coin_price && config.chain.secondaryCoin.symbol && (
        <Flex columnGap={1} ml={data?.coin_price ? 3 : 0}>
          <Skeleton isLoaded={!isPlaceholderData}>
            <chakra.span color="text_secondary">{config.chain.secondaryCoin.symbol} </chakra.span>
            <span>
              $
              {Number(data.secondary_coin_price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
          </Skeleton>
        </Flex>
      )}
      {data?.coin_price && config.features.gasTracker.isEnabled && <TextSeparator color="divider" />}
      {data?.gas_prices && data.gas_prices.average !== null && config.features.gasTracker.isEnabled && (
        <Skeleton isLoaded={!isPlaceholderData}>
          <chakra.span color="text_secondary">Gas </chakra.span>
          <GasInfoTooltip data={data} dataUpdatedAt={dataUpdatedAt}>
            <Link>
              <GasPrice data={data.gas_prices.average} />
            </Link>
          </GasInfoTooltip>
        </Skeleton>
      )}
    </Flex>
  );
};

export default React.memo(TopBarStats);
