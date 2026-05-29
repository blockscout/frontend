// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochElectionReward, CeloEpochDetails } from 'src/features/chain-variants/celo/types/api';

import EpochRewardTypeTag from 'src/features/chain-variants/celo/components/EpochRewardTypeTag';

import TokenValue from 'src/shared/values/entity/TokenValue';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import EpochElectionRewardDetailsMobile from './EpochElectionRewardDetailsMobile';
import { getRewardNumText } from './utils';

interface Props {
  data: CeloEpochElectionReward;
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  isLoading?: boolean;
}

const EpochElectionRewardsListItem = ({ data, isLoading, type }: Props) => {
  const section = useDisclosure();

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
              <SpriteIcon
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
        <TokenValue
          amount={ data.total }
          token={ data.token }
          accuracy={ 0 }
          loading={ isLoading }
          fontWeight={ 500 }
        />
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
