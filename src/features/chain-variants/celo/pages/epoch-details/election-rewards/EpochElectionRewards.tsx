// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { Heading } from 'src/toolkit/chakra/heading';
import { TableBody, TableColumnHeader, TableContainerScrollable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import EpochElectionRewardsTableItem from './EpochElectionRewardsTableItem';

interface Props {
  data: schemas['CeloEpochDetailed'];
  isLoading?: boolean;
}

const EpochElectionRewards = ({ data, isLoading }: Props) => {
  if (!data.aggregated_election_rewards) {
    return null;
  }

  return (
    <Box mt={ 6 }>
      <Heading level="3" mb={ 3 }>Election rewards</Heading>
      <TableContainerScrollable>
        <TableRoot style={{ tableLayout: 'auto' }} minW="700px">
          <TableHeaderSticky>
            <TableRow>
              <TableColumnHeader width="24px"/>
              <TableColumnHeader width="180px">Reward type</TableColumnHeader>
              <TableColumnHeader/>
              <TableColumnHeader isNumeric>Value</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { Object.entries(data.aggregated_election_rewards).map((entry) => {
              const key = entry[0] as keyof schemas['CeloEpochDetailed']['aggregated_election_rewards'];
              const value = entry[1];

              if (!value) {
                return null;
              }

              return (
                <EpochElectionRewardsTableItem
                  key={ key }
                  type={ key }
                  isLoading={ isLoading }
                  data={ value }
                />
              );
            }) }
          </TableBody>
        </TableRoot>
      </TableContainerScrollable>
    </Box>
  );
};

export default React.memo(EpochElectionRewards);
