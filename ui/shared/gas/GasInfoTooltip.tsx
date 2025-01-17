import {
  Box,
  Flex,
  Grid,
} from '@chakra-ui/react';
import React from 'react';

import type { HomeStats } from 'types/api/stats';
import type { ExcludeUndefined } from 'types/utils';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import type { TooltipProps } from 'toolkit/chakra/tooltip';
import { Tooltip } from 'toolkit/chakra/tooltip';
import LinkInternal from 'ui/shared/links/LinkInternal';

import GasInfoTooltipRow from './GasInfoTooltipRow';
import GasInfoUpdateTimer from './GasInfoUpdateTimer';

interface Props {
  children: React.ReactNode;
  data: HomeStats;
  dataUpdatedAt: number;
  isOpen?: boolean; // for testing purposes only; the tests were flaky, i couldn't find a better way
  placement?: ExcludeUndefined<TooltipProps['positioning']>['placement'];
}

const feature = config.features.gasTracker;

const GasInfoTooltip = ({ children, data, dataUpdatedAt, isOpen, placement }: Props) => {
  if (!data.gas_prices) {
    return null;
  }

  const columnNum =
    Object.values(data.gas_prices).some((price) => price?.fiat_price) &&
    Object.values(data.gas_prices).some((price) => price?.price) &&
    feature.isEnabled && feature.units.length === 2 ?
      3 : 2;

  const content = (
    <Flex flexDir="column" textStyle="xs" rowGap={ 3 }>
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
      <Grid rowGap={ 2 } columnGap="10px" gridTemplateColumns={ `repeat(${ columnNum }, minmax(min-content, auto))` }>
        <GasInfoTooltipRow name="Fast" info={ data.gas_prices.fast }/>
        <GasInfoTooltipRow name="Normal" info={ data.gas_prices.average }/>
        <GasInfoTooltipRow name="Slow" info={ data.gas_prices.slow }/>
      </Grid>
      <LinkInternal href={ route({ pathname: '/gas-tracker' }) } className="dark">
        Gas tracker overview
      </LinkInternal>
    </Flex>
  );

  return (
    <Tooltip
      content={ content }
      positioning={{ placement }}
      { ...(isOpen ? { open: true } : { }) }
      lazyMount
      interactive
      showArrow={ false }
      contentProps={{ p: 4, borderRadius: 'md', className: 'light' }}
    >
      { children }
    </Tooltip>
  );
};

export default React.memo(GasInfoTooltip);
