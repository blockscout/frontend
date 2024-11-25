import { Box, Flex, IconButton, Skeleton, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { BlockEpoch, BlockEpochElectionReward } from 'types/api/block';

import getCurrencyValue from 'lib/getCurrencyValue';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import IconSvg from 'ui/shared/IconSvg';

import BlockEpochElectionRewardDetailsMobile from './BlockEpochElectionRewardDetailsMobile';

interface Props {
  data: BlockEpochElectionReward;
  type: keyof BlockEpoch['aggregated_election_rewards'];
  isLoading?: boolean;
}

const BlockEpochElectionRewardsListItem = ({ data, isLoading, type }: Props) => {
  const section = useDisclosure();

  const { valueStr } = getCurrencyValue({
    value: data.total,
    decimals: data.token.decimals,
    accuracy: 2,
  });

  return (
    <Box
      py={ 3 }
      borderBottomWidth="1px"
      borderColor="divider"
      fontSize="sm"
      onClick={ isLoading || !data.count ? undefined : section.onToggle }
      cursor={ isLoading || !data.count ? undefined : 'pointer' }
    >
      <Flex my="3px" columnGap={ 3 } alignItems="center" flexWrap="wrap" rowGap={ 2 }>
        { data.count ? (
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
        ) : <Box boxSize={ 6 }/> }
        <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading }>{ data.count }</Skeleton>
        <Flex columnGap={ 2 } alignItems="center" ml={{ base: 9, lg: 'auto' }} w={{ base: '100%', lg: 'fit-content' }} fontWeight={ 500 }>
          <Skeleton isLoaded={ !isLoading }>{ valueStr }</Skeleton>
          <TokenEntity
            token={ data.token }
            noCopy
            onlySymbol
            w="auto"
            isLoading={ isLoading }
          />
        </Flex>
      </Flex>
      { section.isOpen && (
        <Box mt={ 2 }>
          <BlockEpochElectionRewardDetailsMobile type={ type } token={ data.token }/>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(BlockEpochElectionRewardsListItem);
