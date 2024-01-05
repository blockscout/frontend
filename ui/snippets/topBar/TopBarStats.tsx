import { Flex, LightMode, Link, Skeleton, Tooltip, chakra, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
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

  const { data, isPlaceholderData, isError } = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

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
        <Skeleton isLoaded={ !isPlaceholderData }>
          <chakra.span color="text_secondary">{ config.chain.governanceToken.symbol || config.chain.currency.symbol } </chakra.span>
          <span>${ Number(data.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
        </Skeleton>
      ) }
      { data?.coin_price && config.UI.homepage.showGasTracker && <TextSeparator color="divider"/> }
      { data?.gas_prices && data.gas_prices.average !== null && config.UI.homepage.showGasTracker && (
        <Skeleton isLoaded={ !isPlaceholderData }>
          <chakra.span color="text_secondary">Gas </chakra.span>
          <LightMode>
            <Tooltip
              label={ <GasInfoTooltipContent gasPrices={ data.gas_prices }/> }
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
                { data.gas_prices.average } Gwei
              </Link>
            </Tooltip>
          </LightMode>
        </Skeleton>
      ) }
    </Flex>
  );
};

export default React.memo(TopBarStats);
