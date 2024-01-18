import { Flex, Link, Skeleton, Tooltip, chakra, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import { currencyUnits } from 'lib/units';
import { HOMEPAGE_STATS } from 'stubs/stats';
import GasInfoTooltipContent from 'ui/shared/GasInfoTooltipContent/GasInfoTooltipContent';
import TextSeparator from 'ui/shared/TextSeparator';

const TopBarStats = () => {
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onToggle();
  }, [ onToggle ]);

  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useApiQuery('homepage_stats', {
    fetchParams: {
      headers: {
        'updated-gas-oracle': 'true',
      },
    },
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }

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
  }, [ isPlaceholderData, data?.gas_price_updated_at, dataUpdatedAt, data?.gas_prices_update_in, refetch ]);

  if (isError) {
    return <div/>;
  }

  return (
    <Flex
      alignItems="center"
      fontSize="xs"
      fontWeight={ 500 }
    >
      { data?.coin_price && (
        <Flex columnGap={ 1 }>
          <Skeleton isLoaded={ !isPlaceholderData }>
            <chakra.span color="text_secondary">{ config.chain.governanceToken.symbol || config.chain.currency.symbol } </chakra.span>
            <span>${ Number(data.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
          </Skeleton>
          { data.coin_price_change_percentage && (
            <Skeleton isLoaded={ !isPlaceholderData }>
              <chakra.span color={ Number(data.coin_price_change_percentage) >= 0 ? 'green.500' : 'red.500' }>
                { Number(data.coin_price_change_percentage).toFixed(2) }%
              </chakra.span>
            </Skeleton>
          ) }
        </Flex>
      ) }
      { data?.coin_price && config.UI.homepage.showGasTracker && <TextSeparator color="divider"/> }
      { data?.gas_prices && data.gas_prices.average !== null && config.UI.homepage.showGasTracker && (
        <Skeleton isLoaded={ !isPlaceholderData }>
          <chakra.span color="text_secondary">Gas </chakra.span>
          <Tooltip
            label={ <GasInfoTooltipContent data={ data } dataUpdatedAt={ dataUpdatedAt }/> }
            hasArrow={ false }
            borderRadius="md"
            offset={ [ 0, 16 ] }
            bgColor="blackAlpha.900"
            p={ 0 }
            isOpen={ isOpen }
          >
            <Link
              _hover={{ textDecoration: 'none', color: 'link_hovered' }}
              onClick={ handleClick }
              onMouseEnter={ onOpen }
              onMouseLeave={ onClose }
            >
              { data.gas_prices.average.fiat_price ? `$${ data.gas_prices.average.fiat_price }` : `${ data.gas_prices.average.price } ${ currencyUnits.gwei }` }
            </Link>
          </Tooltip>
        </Skeleton>
      ) }
    </Flex>
  );
};

export default React.memo(TopBarStats);
