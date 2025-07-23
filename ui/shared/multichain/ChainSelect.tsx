import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Image } from 'toolkit/chakra/image';
import { Select } from 'toolkit/chakra/select';
import type { SelectOption, SelectProps } from 'toolkit/chakra/select';

const collection = createListCollection<SelectOption>({
  items: multichainConfig()?.chains.map((chain) => ({
    value: chain.slug,
    label: chain.config.chain.name || chain.slug,
    icon: <Image src={ chain.config.UI.navigation.icon.default } alt={ chain.config.chain.name } boxSize={ 5 } borderRadius="full"/>,
  })) || [],
});

interface Props extends Omit<SelectProps, 'collection' | 'placeholder'> {
  loading?: boolean;
}

const ChainSelect = ({ loading, ...props }: Props) => {
  const isInitialLoading = useIsInitialLoading(loading);

  return (
    <Select
      collection={ collection }
      defaultValue={ [ collection.items[0].value ] }
      placeholder="Select chain"
      loading={ isInitialLoading }
      { ...props }
    />
  );
};

export default React.memo(ChainSelect);
