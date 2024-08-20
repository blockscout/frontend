import { Box, Flex, IconButton, Skeleton, Td, Tr, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { BlockEpoch, BlockEpochElectionReward } from 'types/api/block';

import getCurrencyValue from 'lib/getCurrencyValue';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

import BlockEpochElectionRewardsType from './BlockEpochElectionRewardsType';

interface Props {
  data: BlockEpochElectionReward;
  type: keyof BlockEpoch['aggregated_election_rewards'];
  isLoading?: boolean;
}

const BlockEpochElectionRewardsTableItem = ({ isLoading, data, type }: Props) => {
  const section = useDisclosure();

  const { valueStr } = getCurrencyValue({
    value: data.total,
    exchangeRate: data.token.exchange_rate,
    accuracyUsd: 2,
    decimals: data.token.decimals,
  });

  const mainRowBorderColor = section.isOpen ? 'transparent' : 'divider';

  return (
    <>
      <Tr onClick={ section.onToggle } cursor="pointer">
        <Td borderColor={ mainRowBorderColor }>
          <Skeleton isLoaded={ !isLoading } display="flex" borderRadius="sm">
            <IconButton
              aria-label={ section.isOpen ? 'Collapse section' : 'Expand section' }
              variant="link"
              boxSize={ 6 }
              flexShrink={ 0 }
              icon={ (
                <IconSvg
                  name="arrows/east-mini"
                  boxSize={ 6 }
                  transform={ section.isOpen ? 'rotate(270deg)' : 'rotate(180deg)' }
                  transitionDuration="faster"
                />
              ) }
            />
          </Skeleton>
        </Td>
        <Td borderColor={ mainRowBorderColor }>
          <BlockEpochElectionRewardsType type={ type }/>
        </Td>
        <Td borderColor={ mainRowBorderColor }>
          <Box fontWeight={ 400 } lineHeight={ 6 }>{ data.count } group reward{ data.count > 1 ? 's' : '' }</Box>
        </Td>
        <Td borderColor={ mainRowBorderColor }>
          <Flex columnGap={ 2 } alignItems="center" justifyContent="flex-end">
            <span>{ valueStr }</span>
            <TokenEntity
              token={ data.token }
              noCopy
              onlySymbol
              w="auto"
            />
          </Flex>
        </Td>
      </Tr>
      { section.isOpen && (
        <Tr>
          <Td/>
          <Td colSpan={ 3 }>FOO BAR</Td>
        </Tr>
      ) }
    </>
  );
};

export default React.memo(BlockEpochElectionRewardsTableItem);
