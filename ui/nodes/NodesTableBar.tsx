import { Box, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { isMobile } from 'react-device-detect';

import type { PaginationParams } from 'ui/shared/pagination/types';

import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import Pagination from 'ui/shared/pagination/Pagination';
import StatsDropdownMenu from 'ui/stats/StatsDropdownMenu';

import { statusList } from './data';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  validatorStatus: string;
  onValidatorStatusChange: (id: string) => void;
}
const NodesTableBar = ({
  onSearchChange,
  searchTerm,
  validatorStatus = 'All',
  onValidatorStatusChange,
  pagination,
}: Props) => {
  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      onChange={ onSearchChange }
      placeholder="Search by validator"
      initialValue={ searchTerm }
    />
  );

  const selector = (
    <StatsDropdownMenu
      items={ statusList }
      selectedId={ validatorStatus }
      onSelect={ onValidatorStatusChange }
    />
  );

  // const actionBar = pagination.isVisible && (
  //   <ActionBar py="0">
  //     <Pagination ml="auto" {...pagination} />
  //   </ActionBar>
  // );

  return (
    <ActionBar>
      <Box w="100%">
        <Grid
          gap={ 2 }
          templateAreas={{
            base: `"section" "input"  "actions"`,
            lg: `"section input actions"`,
          }}
          gridTemplateColumns={{
            base: isMobile ?
              'repeat(1, minmax(0, 1fr))' :
              'repeat(2, minmax(0, 1fr))',
            lg: 'auto 1fr',
          }}
        >
          <GridItem w={{ base: '100%', lg: 'auto' }} area="section">
            { selector }
          </GridItem>
          <GridItem w={{ base: '100%', lg: 'auto' }} area="input">
            { searchInput }
          </GridItem>

          <GridItem w={{ base: '100%', lg: 'auto' }} area="actions">
            <Pagination ml="auto" justifyContent="flex-end" { ...pagination }/>
          </GridItem>
        </Grid>
      </Box>
    </ActionBar>
  );
};

export default NodesTableBar;
