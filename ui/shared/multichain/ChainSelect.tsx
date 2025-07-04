import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import getIconUrl from 'lib/multichain/getIconUrl';
import { Image } from 'toolkit/chakra/image';
import { Select } from 'toolkit/chakra/select';
import type { SelectOption, SelectProps, ViewMode } from 'toolkit/chakra/select';

const collection = createListCollection<SelectOption>({
  items: multichainConfig()?.chains.map((chain) => ({
    value: chain.slug,
    label: chain.config.chain.name || chain.slug,
    icon: <Image src={ getIconUrl(chain) } alt={ chain.config.chain.name } boxSize={ 5 } borderRadius="full"/>,
  })) || [],
});

interface Props extends Omit<SelectProps, 'collection' | 'placeholder'> {
  loading?: boolean;
  mode?: ViewMode;
}

const ChainSelect = ({ loading, mode, ...props }: Props) => {
  const isInitialLoading = useIsInitialLoading(loading);
  const isMobile = useIsMobile();

  return (
    <Select
      collection={ collection }
      defaultValue={ [ collection.items[0].value ] }
      placeholder="Select chain"
      loading={ isInitialLoading }
      mode={ isMobile && !mode ? 'compact' : mode }
      { ...props }
    />
  );
};

export default React.memo(ChainSelect);
