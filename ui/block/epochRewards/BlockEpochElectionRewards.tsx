import { Box, Heading, Hide, Show, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

import type { BlockEpoch } from 'types/api/block';

import BlockEpochElectionRewardsListItem from './BlockEpochElectionRewardsListItem';
import BlockEpochElectionRewardsTableItem from './BlockEpochElectionRewardsTableItem';

interface Props {
  data: BlockEpoch;
  isLoading?: boolean;
}

const BlockEpochElectionRewards = ({ data, isLoading }: Props) => {
  return (
    <Box mt={ 8 }>
      <Heading as="h4" size="sm" mb={ 3 }>Election rewards</Heading>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }}>
          <Thead>
            <Tr>
              <Th width="24px"/>
              <Th width="180px">Reward type</Th>
              <Th/>
              <Th isNumeric>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            { Object.entries(data.aggregated_election_rewards).map((entry) => {
              const key = entry[0] as keyof BlockEpoch['aggregated_election_rewards'];
              const value = entry[1];

              if (!value) {
                return null;
              }

              return (
                <BlockEpochElectionRewardsTableItem
                  key={ key }
                  type={ key }
                  isLoading={ isLoading }
                  data={ value }
                />
              );
            }) }
          </Tbody>
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        { Object.entries(data.aggregated_election_rewards).map((entry) => {
          const key = entry[0] as keyof BlockEpoch['aggregated_election_rewards'];
          const value = entry[1];

          if (!value) {
            return null;
          }

          return (
            <BlockEpochElectionRewardsListItem
              key={ key }
              type={ key }
              isLoading={ isLoading }
              data={ value }
            />
          );
        }) }
      </Show>
    </Box>
  );
};

export default React.memo(BlockEpochElectionRewards);
