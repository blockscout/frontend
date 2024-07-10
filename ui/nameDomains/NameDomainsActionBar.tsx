import { Box, Checkbox, CheckboxGroup, Flex, HStack, Image, Link, Text, VStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';
import type { EnsDomainLookupFiltersOptions } from 'types/api/ens';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';

import type { Sort as TSort } from './utils';
import { SORT_OPTIONS } from './utils';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  filterValue: EnsDomainLookupFiltersOptions;
  onFilterValueChange: (nextValue: EnsDomainLookupFiltersOptions) => void;
  protocolsData: Array<bens.ProtocolInfo> | undefined;
  protocolsFilterValue: Array<string>;
  onProtocolsFilterChange: (nextValue: Array<string>) => void;
  sort: TSort | undefined;
  onSortChange: (nextValue: TSort | undefined) => void;
  isLoading: boolean;
  isAddressSearch: boolean;
}

const NameDomainsActionBar = ({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterValueChange,
  sort,
  onSortChange,
  isLoading,
  isAddressSearch,
  pagination,
  protocolsData,
  protocolsFilterValue,
  onProtocolsFilterChange,
}: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      minW={{ base: 'auto', lg: '250px' }}
      size="xs"
      onChange={ onSearchChange }
      placeholder="Search by name or address"
      initialValue={ searchTerm }
      isLoading={ isInitialLoading }
    />
  );

  const handleProtocolReset = React.useCallback(() => {
    onProtocolsFilterChange([]);
  }, [ onProtocolsFilterChange ]);

  const filterGroupDivider = <Box w="100%" borderBottomWidth="1px" borderBottomColor="divider" my={ 4 }/>;

  const appliedFiltersNum = filterValue.length + (protocolsData && protocolsData.length > 1 ? protocolsFilterValue.length : 0);

  const filter = (
    <PopoverFilter appliedFiltersNum={ appliedFiltersNum } contentProps={{ minW: '220px', w: 'fit-content' }} isLoading={ isInitialLoading }>
      <div>
        { protocolsData && protocolsData.length > 1 && (
          <>
            <Flex justifyContent="space-between" fontSize="sm" mb={ 3 }>
              <Text fontWeight={ 600 } variant="secondary">Protocol</Text>
              <Link
                onClick={ handleProtocolReset }
                color={ protocolsData.length > 0 ? 'link' : 'text_secondary' }
                _hover={{
                  color: protocolsData.length > 0 ? 'link_hovered' : 'text_secondary',
                }}
              >
                Reset
              </Link>
            </Flex>
            <CheckboxGroup size="lg" value={ protocolsFilterValue } defaultValue={ protocolsFilterValue } onChange={ onProtocolsFilterChange }>
              <VStack gap={ 5 } alignItems="flex-start">
                { protocolsData.map((protocol) => {
                  const topLevelDomains = protocol.tld_list.map((domain) => `.${ domain }`).join(' ');
                  return (
                    <Checkbox key={ protocol.id } value={ protocol.id }>
                      <Flex alignItems="center">
                        <Image
                          src={ protocol.icon_url }
                          boxSize={ 5 }
                          borderRadius="sm"
                          mr={ 2 }
                          alt={ `${ protocol.title } protocol icon` }
                          fallback={ <IconSvg name="ENS_slim" boxSize={ 5 } mr={ 2 }/> }
                          fallbackStrategy={ protocol.icon_url ? 'onError' : 'beforeLoadOrError' }
                        />
                        <span>{ protocol.short_name }</span>
                        <chakra.span color="text_secondary" whiteSpace="pre"> { topLevelDomains }</chakra.span>
                      </Flex>
                    </Checkbox>
                  );
                }) }
              </VStack>
            </CheckboxGroup>
            { filterGroupDivider }
          </>
        ) }
        <CheckboxGroup size="lg" onChange={ onFilterValueChange } value={ filterValue } defaultValue={ filterValue }>
          <Text variant="secondary" fontWeight={ 600 } mb={ 3 } fontSize="sm">Address</Text>
          <Checkbox value="owned_by" isDisabled={ !isAddressSearch } display="block">
            Owned by
          </Checkbox>
          <Checkbox
            value="resolved_to"
            mt={ 5 }
            isDisabled={ !isAddressSearch }
            display="block"
          >
            Resolved to address
          </Checkbox>
          { filterGroupDivider }
          <Text variant="secondary" fontWeight={ 600 } mb={ 3 } fontSize="sm">Status</Text>
          <Checkbox value="with_inactive" display="block">
            Include expired
          </Checkbox>
        </CheckboxGroup>
      </div>
    </PopoverFilter>
  );

  const sortButton = (
    <Sort
      name="name_domains_sorting"
      defaultValue={ sort }
      options={ SORT_OPTIONS }
      onChange={ onSortChange }
      isLoading={ isInitialLoading }
    />
  );

  return (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filter }
        { sortButton }
        { searchInput }
      </HStack>
      <ActionBar
        mt={ -6 }
        display={{ base: pagination.isVisible ? 'flex' : 'none', lg: 'flex' }}
      >
        <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { filter }
          { searchInput }
        </HStack>
        <Pagination { ...pagination } ml="auto"/>
      </ActionBar>
    </>
  );
};

export default React.memo(NameDomainsActionBar);
