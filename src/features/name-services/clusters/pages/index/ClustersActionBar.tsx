// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, VStack, Box } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import {
  getSearchPlaceholder,
  shouldShowActionBar,
} from 'src/features/name-services/clusters/utils/action-bar-utils';

import useIsInitialLoading from 'src/shared/hooks/useIsInitialLoading';
import Pagination from 'src/shared/pagination/Pagination';

import { Button, ButtonGroupRadio } from 'src/toolkit/chakra/button';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

type ViewMode = 'leaderboard' | 'directory';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
  isLoading: boolean;
}

const ClustersActionBar = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  isLoading,
  pagination,
}: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleViewModeChange = React.useCallback((value: string) => {
    onViewModeChange(value as ViewMode);
  }, [ onViewModeChange ]);

  const placeholder = getSearchPlaceholder();
  const showActionBarOnMobile = shouldShowActionBar(pagination.isVisible, false);
  const showActionBarOnDesktop = shouldShowActionBar(pagination.isVisible, true);

  const filters = (
    <Flex columnGap={ 3 } rowGap={ 3 } flexDir={{ base: 'column', lg: 'row' }}>
      <ButtonGroupRadio
        defaultValue={ viewMode }
        onChange={ handleViewModeChange }
        w={{ lg: 'fit-content' }}
        loading={ isInitialLoading }
      >
        <Button value="directory" size="sm" px={ 3 }>
          Directory
        </Button>
        <Button value="leaderboard" size="sm" px={ 3 }>
          Leaderboard
        </Button>
      </ButtonGroupRadio>
      <FilterInput
        initialValue={ searchTerm }
        onChange={ onSearchChange }
        placeholder={ placeholder }
        w={{ base: '100%', lg: '360px' }}
        minW={{ base: 'auto', lg: '250px' }}
        size="sm"
        loading={ isInitialLoading }
      />
    </Flex>
  );

  return (
    <>
      <VStack gap={ 3 } mb={ 6 } hideFrom="lg" align="stretch">
        { filters }
      </VStack>
      <ActionBar
        mt={ -6 }
        display={{ base: showActionBarOnMobile ? 'flex' : 'none', lg: showActionBarOnDesktop ? 'flex' : 'none' }}
      >
        <Box hideBelow="lg">
          { filters }
        </Box>
        <Pagination { ...pagination } ml="auto"/>
      </ActionBar>
    </>
  );
};

export default React.memo(ClustersActionBar);
