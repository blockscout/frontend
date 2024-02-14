import { Box, DarkMode, Flex, Grid, Popover, PopoverBody, PopoverContent, PopoverTrigger, Portal, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { HomeStats } from 'types/api/stats';

import { route } from 'nextjs-routes';

import dayjs from 'lib/date/dayjs';
import LinkInternal from 'ui/shared/LinkInternal';

import GasInfoTooltipRow from './GasInfoTooltipRow';
import GasInfoUpdateTimer from './GasInfoUpdateTimer';

interface Props {
  children: React.ReactNode;
  data: HomeStats;
  dataUpdatedAt: number;
}

const POPOVER_OFFSET: [ number, number ] = [ 0, 10 ];

const GasInfoTooltip = ({ children, data, dataUpdatedAt }: Props) => {
  const tooltipBg = useColorModeValue('gray.700', 'gray.900');

  if (!data.gas_prices) {
    return null;
  }

  return (
    <Popover trigger="hover" isLazy offset={ POPOVER_OFFSET }>
      <PopoverTrigger>
        { children }
      </PopoverTrigger>
      <Portal>
        <PopoverContent bgColor={ tooltipBg } w="auto">
          <PopoverBody color="white">
            <DarkMode>
              <Flex flexDir="column" fontSize="xs" lineHeight={ 4 } rowGap={ 3 }>
                { data.gas_price_updated_at && (
                  <Flex justifyContent="space-between">
                    <Box color="text_secondary">Last update</Box>
                    <Flex color="text_secondary" justifyContent="flex-end" columnGap={ 2 } ml={ 3 }>
                      { dayjs(data.gas_price_updated_at).format('MMM DD, HH:mm:ss') }
                      { data.gas_prices_update_in !== 0 &&
                            <GasInfoUpdateTimer key={ dataUpdatedAt } startTime={ dataUpdatedAt } duration={ data.gas_prices_update_in }/> }
                    </Flex>
                  </Flex>
                ) }
                <Grid rowGap={ 2 } columnGap="10px" gridTemplateColumns="repeat(3, minmax(min-content, auto))">
                  <GasInfoTooltipRow name="Slow" info={ data.gas_prices.slow }/>
                  <GasInfoTooltipRow name="Normal" info={ data.gas_prices.average }/>
                  <GasInfoTooltipRow name="Fast" info={ data.gas_prices.fast }/>
                </Grid>
                <LinkInternal href={ route({ pathname: '/gas-tracker' }) }>
                    Gas tracker overview
                </LinkInternal>
              </Flex>
            </DarkMode>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default React.memo(GasInfoTooltip);
