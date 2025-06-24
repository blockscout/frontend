import { HStack, Icon } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import {
  shouldShowClearButton,
  shouldDisableViewToggle,
  getSearchPlaceholder,
  shouldShowActionBar,
} from 'lib/clusters/actionBarUtils';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Button } from 'toolkit/chakra/button';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import ActionBar from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';

type ViewMode = 'leaderboard' | 'directory';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
  isLoading: boolean;
}

interface SegmentedButtonProps {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  isDisabled: boolean;
}

const SegmentedButton = ({ children, isSelected, onClick, isDisabled }: SegmentedButtonProps) => (
  <Button
    size="sm"
    variant="segmented"
    onClick={ onClick }
    selected={ isSelected }
    disabled={ isDisabled }
    cursor={ isSelected ? 'default' : 'pointer' }
    _hover={ isSelected ? { cursor: 'default' } : { color: 'link.primary.hover', cursor: 'pointer' } }
  >
    { children }
  </Button>
);

const ClustersActionBar = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  isLoading,
  pagination,
}: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const [ searchValue, setSearchValue ] = React.useState(searchTerm || '');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSearchValue(searchTerm || '');
  }, [ searchTerm ]);

  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearchChange(value);
  }, [ onSearchChange ]);

  const handleClear = React.useCallback(() => {
    setSearchValue('');
    onSearchChange('');
    inputRef?.current?.focus();
  }, [ onSearchChange ]);

  const handleLeaderboardClick = React.useCallback(() => {
    onViewModeChange('leaderboard');
  }, [ onViewModeChange ]);

  const handleDirectoryClick = React.useCallback(() => {
    onViewModeChange('directory');
  }, [ onViewModeChange ]);

  const clearButtonVisible = shouldShowClearButton(searchValue);
  const viewToggleDisabled = shouldDisableViewToggle(isInitialLoading);
  const placeholder = getSearchPlaceholder();
  const showActionBarOnMobile = shouldShowActionBar(pagination.isVisible, false);
  const showActionBarOnDesktop = shouldShowActionBar(pagination.isVisible, true);

  const searchInput = (
    <Skeleton
      w={{ base: '100%', lg: '360px' }}
      minW={{ base: 'auto', lg: '250px' }}
      borderRadius="base"
      loading={ isInitialLoading }
    >
      <InputGroup
        startElement={ <Icon boxSize={ 5 }><IconSvg name="search"/></Icon> }
        startElementProps={{ px: 2 }}
        endElement={ <ClearButton onClick={ handleClear } visible={ clearButtonVisible }/> }
        endElementProps={{ w: '32px' }}
      >
        <Input
          ref={ inputRef }
          size="sm"
          value={ searchValue }
          onChange={ handleSearchChange }
          placeholder={ placeholder }
          borderWidth="2px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        />
      </InputGroup>
    </Skeleton>
  );

  const viewToggle = (
    <HStack gap={ 0 } borderRadius="md" overflow="hidden" border="2px solid" borderColor="button.segmented.border">
      <SegmentedButton
        isSelected={ viewMode === 'leaderboard' }
        onClick={ handleLeaderboardClick }
        isDisabled={ viewToggleDisabled }
      >
        Leaderboard
      </SegmentedButton>
      <SegmentedButton
        isSelected={ viewMode === 'directory' }
        onClick={ handleDirectoryClick }
        isDisabled={ viewToggleDisabled }
      >
        Directory
      </SegmentedButton>
    </HStack>
  );

  return (
    <>
      <HStack gap={ 3 } mb={ 6 } hideFrom="lg">
        { viewToggle }
        { searchInput }
      </HStack>
      <ActionBar
        mt={ -6 }
        display={{ base: showActionBarOnMobile ? 'flex' : 'none', lg: showActionBarOnDesktop ? 'flex' : 'none' }}
      >
        <HStack gap={ 3 } hideBelow="lg">
          { viewToggle }
          { searchInput }
        </HStack>
        <Pagination { ...pagination } ml="auto"/>
      </ActionBar>
    </>
  );
};

export default React.memo(ClustersActionBar);
