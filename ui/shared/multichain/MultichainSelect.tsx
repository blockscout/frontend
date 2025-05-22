import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import { Image } from 'toolkit/chakra/image';
import { Select } from 'toolkit/chakra/select';
import type { SelectOption, SelectProps } from 'toolkit/chakra/select';

const collection = createListCollection<SelectOption>({
  items: multichainConfig.chains.map((chain) => ({
    value: chain.id,
    label: chain.name,
    icon: <Image src={ chain.icon } alt={ chain.name } boxSize={ 5 }/>,
  })),
});

interface Props extends Omit<SelectProps, 'collection' | 'placeholder'> {
  loading?: boolean;
}

const MultichainSelect = (props: Props) => {
  return (
    <Select
      collection={ collection }
      defaultValue={ [ collection.items[0].value ] }
      placeholder="Select subchain"
      { ...props }
    />
  );
};

export default React.memo(MultichainSelect);
