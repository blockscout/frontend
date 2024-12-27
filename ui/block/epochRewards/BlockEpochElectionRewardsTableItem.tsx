import { Flex, IconButton, Skeleton, Td, Tr, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { BlockEpoch, BlockEpochElectionReward } from 'types/api/block';

import getCurrencyValue from 'lib/getCurrencyValue';
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

  const mainRowBorderColor = section.isOpen ? 'transparent' : 'divider';

  return (
    <>
      <Tr
        onClick={ isLoading || !data.count ? undefined : section.onToggle }
        cursor={ isLoading || !data.count ? undefined : 'pointer' }
      >
        <Td borderColor={ mainRowBorderColor }>
          { Boolean(data.count) && (
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
          ) }
        </Td>
        <Td borderColor={ mainRowBorderColor }>
          <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        </Td>
        <Td borderColor={ mainRowBorderColor }>
          <Skeleton isLoaded={ !isLoading } fontWeight={ 400 } my={ 1 }>
            { getRewardNumText(type, data.count) }
          </Skeleton>
        </Td>
        <Td borderColor={ mainRowBorderColor }>
          <Flex columnGap={ 2 } alignItems="center" justifyContent="flex-end" my="2px">
            <Skeleton isLoaded={ !isLoading }>{ valueStr }</Skeleton>
            <TokenEntity
              token={ data.token }
              noCopy
              onlySymbol
              w="auto"
              isLoading={ isLoading }
            />
          </Flex>
        </Td>
      </Tr>
      { section.isOpen && (
        <Tr>
          <Td/>
          <Td colSpan={ 3 } pr={ 0 } pt={ 0 }>
            <BlockEpochElectionRewardDetailsDesktop type={ type } token={ data.token }/>
          </Td>
        </Tr>
      ) }
    </>
  );
};

export default React.memo(BlockEpochElectionRewardsTableItem);
