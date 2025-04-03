import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { BlockEpoch, BlockEpochElectionReward } from 'types/api/block';

import getCurrencyValue from 'lib/getCurrencyValue';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import IconSvg from 'ui/shared/IconSvg';

import BlockEpochElectionRewardDetailsDesktop from './BlockEpochElectionRewardDetailsDesktop';
import { getRewardNumText } from './utils';

interface Props {
  data: BlockEpochElectionReward;
  type: keyof BlockEpoch['aggregated_election_rewards'];
  isLoading?: boolean;
}

const BlockEpochElectionRewardsTableItem = ({ isLoading, data, type }: Props) => {
  const section = useDisclosure();

  const { valueStr } = getCurrencyValue({
    value: data.total,
    decimals: data.token.decimals,
  });

  const mainRowBorderColor = section.open ? 'transparent' : 'border.divider';

  return (
    <>
      <TableRow
        onClick={ isLoading || !data.count ? undefined : section.onToggle }
        cursor={ isLoading || !data.count ? undefined : 'pointer' }
      >
        <TableCell borderColor={ mainRowBorderColor }>
          { Boolean(data.count) && (
            <Skeleton loading={ isLoading } display="flex" borderRadius="sm">
              <IconButton
                aria-label={ section.open ? 'Collapse section' : 'Expand section' }
                variant="link"
              >
                <IconSvg
                  name="arrows/east-mini"
                  boxSize={ 6 }
                  transform={ section.open ? 'rotate(270deg)' : 'rotate(180deg)' }
                  transitionDuration="faster"
                />
              </IconButton>
            </Skeleton>
          ) }
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor }>
          <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor }>
          <Skeleton loading={ isLoading } fontWeight={ 400 } my={ 1 }>
            { getRewardNumText(type, data.count) }
          </Skeleton>
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor }>
          <Flex columnGap={ 2 } alignItems="center" justifyContent="flex-end" my="2px">
            <Skeleton loading={ isLoading }>{ valueStr }</Skeleton>
            <TokenEntity
              token={ data.token }
              noCopy
              onlySymbol
              w="auto"
              isLoading={ isLoading }
            />
          </Flex>
        </TableCell>
      </TableRow>
      { section.open && (
        <TableRow>
          <TableCell/>
          <TableCell colSpan={ 3 } pr={ 0 } pt={ 0 }>
            <BlockEpochElectionRewardDetailsDesktop type={ type } token={ data.token }/>
          </TableCell>
        </TableRow>
      ) }
    </>
  );
};

export default React.memo(BlockEpochElectionRewardsTableItem);
