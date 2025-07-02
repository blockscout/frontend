import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochElectionReward, CeloEpochDetails } from 'types/api/epochs';

import getCurrencyValue from 'lib/getCurrencyValue';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import IconSvg from 'ui/shared/IconSvg';

import EpochElectionRewardDetailsMobile from './EpochElectionRewardDetailsMobile';
import { getRewardNumText } from './utils';

interface Props {
  data: CeloEpochElectionReward;
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  isLoading?: boolean;
}

const EpochElectionRewardsListItem = ({ data, isLoading, type }: Props) => {
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
      borderColor="border.divider"
      fontSize="sm"
      onClick={ isLoading || !data.count ? undefined : section.onToggle }
      cursor={ isLoading || !data.count ? undefined : 'pointer' }
    >
      <Flex my="3px" columnGap={ 3 } alignItems="center" flexWrap="wrap" rowGap={ 2 }>
        { data.count ? (
          <Skeleton loading={ isLoading } display="flex" borderRadius="sm">
            <IconButton
              aria-label={ section.open ? 'Collapse section' : 'Expand section' }
              variant="link"
              boxSize={ 6 }
            >
              <IconSvg
                name="arrows/east-mini"
                boxSize={ 6 }
                transform={ section.open ? 'rotate(270deg)' : 'rotate(180deg)' }
                transitionDuration="faster"
              />
            </IconButton>
          </Skeleton>
        ) : <Box boxSize={ 6 }/> }
        <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        <Skeleton loading={ isLoading } ml="auto">{ getRewardNumText(type, data.count) }</Skeleton>
        <Flex columnGap={ 2 } alignItems="center" ml={{ base: 9, lg: 'auto' }} w={{ base: '100%', lg: 'fit-content' }} fontWeight={ 500 }>
          <Skeleton loading={ isLoading }>{ valueStr }</Skeleton>
          <TokenEntity
            token={ data.token }
            noCopy
            onlySymbol
            w="auto"
            isLoading={ isLoading }
          />
        </Flex>
      </Flex>
      { section.open && (
        <Box mt={ 2 }>
          <EpochElectionRewardDetailsMobile type={ type } token={ data.token }/>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(EpochElectionRewardsListItem);
