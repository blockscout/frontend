import { Box, createListCollection, Separator } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { OnValueChangeHandler, SelectOption, SelectProps, ViewMode } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';

import ChainIcon from './ChainIcon';

const CHAIN_ICON = <IconSvg name="pie_chart" boxSize={ 5 }/>;

const MULTIPLE_CONFIG = {
  term: 'chains',
  icon: CHAIN_ICON,
};

export const ALL_OPTION: SelectOption = {
  value: 'all',
  label: 'All chains',
  icon: CHAIN_ICON,
  afterElement: <Separator orientation="horizontal" w="full"/>,
};

export const isAllOption = (value: Array<string> | undefined): boolean => {
  return Boolean(value && value.length === 1 && value[0] === ALL_OPTION.value);
};

export interface Props extends Omit<SelectProps, 'collection' | 'placeholder'> {
  loading?: boolean;
  mode?: ViewMode;
  chainsConfig: Array<Omit<ExternalChain, 'explorer_url'>>;
  chainIds?: Array<string>;
  withAllOption?: boolean;
}

const ChainSelect = ({ loading, mode, chainsConfig, chainIds, withAllOption, value, onValueChange, multiple, ...props }: Props) => {

  const [ inputValue, setInputValue ] = React.useState('');

  const isInitialLoading = useIsInitialLoading(loading);
  const isMobile = useIsMobile();

  const allItems = React.useMemo(() => {
    const chainItems = chainsConfig
      .filter((chain) => !chainIds || isInitialLoading || chainIds.includes(chain.id))
      .map((chain) => ({
        value: chain.id,
        label: chain.name || `Chain ${ chain.id }`,
        icon: <ChainIcon data={ chain } alt={ `${ chain.name } logo` } borderRadius="none" noTooltip/>,
      })) || [];

    return [ withAllOption ? ALL_OPTION : undefined, ...chainItems ].filter(Boolean);
  }, [ chainsConfig, chainIds, withAllOption, isInitialLoading ]);

  const collection = React.useMemo(() => {
    return createListCollection<SelectOption>({ items: allItems });
  }, [ allItems ]);

  const handleFilterChange = React.useCallback((value: string) => {
    setInputValue(value);
  }, [ ]);

  const itemFilter = React.useCallback((item: SelectOption) => {
    return item.label.toLowerCase().includes(inputValue.toLowerCase());
  }, [ inputValue ]);

  const handleValueChange: OnValueChangeHandler = React.useCallback((details) => {
    // for controlled multi-selects we need to handle the "all option" selection/deselection manually
    if (value && withAllOption && multiple) {
      const newValue = details.value;

      if (newValue.length === 0) {
        onValueChange?.({
          items: collection.items,
          value: [ ALL_OPTION.value ],
        });
        return;
      }

      if (newValue.includes(ALL_OPTION.value) && !value.includes(ALL_OPTION.value)) {
        onValueChange?.({
          items: collection.items,
          value: [ ALL_OPTION.value ],
        });
        return;
      }

      if (isAllOption(value) && !isAllOption(newValue)) {
        onValueChange?.({
          items: collection.items,
          value: newValue.filter((item) => item !== ALL_OPTION.value),
        });
        return;
      }
    }

    onValueChange?.({ items: collection.items, value: details.value });
  }, [ withAllOption, multiple, value, onValueChange, collection.items ]);

  const contentHeader = allItems.length > 10 ? (
    <Box px="4" pt={ 4 } pb={ 2 } position="sticky" top={ 0 } zIndex={ 1 } bgColor="popover.bg">
      <FilterInput
        placeholder="Find chain"
        initialValue={ inputValue }
        onChange={ handleFilterChange }
      />
    </Box>
  ) : null;

  if (allItems.length === 0) {
    return null;
  }

  return (
    <Select
      collection={ collection }
      defaultValue={ allItems.length > 0 ? [ allItems[0].value ] : undefined }
      placeholder="Select chain"
      loading={ isInitialLoading }
      mode={ isMobile && !mode ? 'compact' : mode }
      w="fit-content"
      flexShrink={ 0 }
      contentHeader={ contentHeader }
      contentProps={ contentHeader ? { pt: 0 } : undefined }
      itemFilter={ itemFilter }
      value={ value }
      onValueChange={ typeof onValueChange === 'function' ? handleValueChange : undefined }
      multiple={ multiple }
      multipleConfig={ MULTIPLE_CONFIG }
      { ...props }
    />
  );
};

export default React.memo(ChainSelect);
