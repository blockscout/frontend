import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { SelectOption, SelectProps, ViewMode } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import IconSvg from 'ui/shared/IconSvg';

import ChainIcon from './ChainIcon';

const ALL_OPTION = {
  value: 'all',
  label: 'All chains',
  icon: <IconSvg name="apps" boxSize={ 5 }/>,
};

export interface Props extends Omit<SelectProps, 'collection' | 'placeholder'> {
  loading?: boolean;
  mode?: ViewMode;
  chainsConfig: Array<Omit<ExternalChain, 'explorer_url'>>;
  chainIds?: Array<string>;
  withAllOption?: boolean;
}

const ChainSelect = ({ loading, mode, chainsConfig, chainIds, withAllOption, ...props }: Props) => {
  const isInitialLoading = useIsInitialLoading(loading);
  const isMobile = useIsMobile();

  const collection = React.useMemo(() => {

    const chainItems = chainsConfig
      .filter((chain) => !chainIds || chainIds.includes(chain.id))
      .map((chain) => ({
        value: chain.id,
        label: chain.name || `Chain ${ chain.id }`,
        icon: <ChainIcon data={ chain } alt={ `${ chain.name } logo` } borderRadius="none" noTooltip/>,
      })) || [];

    const items = [ withAllOption ? ALL_OPTION : undefined, ...chainItems ].filter(Boolean);

    return createListCollection<SelectOption>({ items });
  }, [ chainIds, chainsConfig, withAllOption ]);

  if (collection.items.length === 0) {
    return null;
  }

  return (
    <Select
      collection={ collection }
      defaultValue={ collection.items.length > 0 ? [ collection.items[0].value ] : undefined }
      placeholder="Select chain"
      loading={ isInitialLoading }
      mode={ isMobile && !mode ? 'compact' : mode }
      w="fit-content"
      flexShrink={ 0 }
      { ...props }
    />
  );
};

export default React.memo(ChainSelect);
