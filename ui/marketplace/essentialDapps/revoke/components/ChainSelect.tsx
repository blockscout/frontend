import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import essentialDappsChainsConfig from 'configs/essential-dapps-chains';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Select } from 'toolkit/chakra/select';
import type { SelectOption, SelectProps, ViewMode } from 'toolkit/chakra/select';
import ChainIcon from 'ui/optimismSuperchain/components/ChainIcon';

const collection = createListCollection<SelectOption>({
  items: essentialDappsChainsConfig()?.chains.map((chain) => ({
    value: chain.config.chain.id as string,
    label: chain.config.chain.name || chain.slug,
    icon: <ChainIcon data={ chain } borderRadius="none"/>,
  })) || [],
});

interface Props extends Omit<SelectProps, 'collection' | 'placeholder'> {
  loading?: boolean;
  mode?: ViewMode;
}

const ChainSelect = ({ loading, mode, ...props }: Props) => {
  const isInitialLoading = useIsInitialLoading(loading);

  return (
    <Select
      collection={ collection }
      defaultValue={ [ collection.items[0].value ] }
      placeholder="Select chain"
      loading={ isInitialLoading }
      w="fit-content"
      { ...props }
    />
  );
};

export default React.memo(ChainSelect);
