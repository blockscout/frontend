// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import type { ButtonGroupRadioProps } from 'src/toolkit/chakra/button';
import { Button, ButtonGroupRadio } from 'src/toolkit/chakra/button';

import type { TNftDisplayType } from './useAddressNftQuery';

interface Props extends Omit<ButtonGroupRadioProps, 'children'> {
  value: TNftDisplayType;
}

const AddressNftDisplayTypeRadio = ({ value, onChange, ...rest }: Props) => {
  return (
    <ButtonGroupRadio
      defaultValue={ value }
      onChange={ onChange }
      equalWidth
      { ...rest }
    >
      <Button value="collection" size="sm" px={ 3 }>
        <SpriteIcon name="collection" boxSize={ 5 }/>
        <chakra.span hideBelow="lg">By collection</chakra.span>
      </Button>
      <Button value="list" size="sm" px={ 3 }>
        <SpriteIcon name="apps" boxSize={ 5 }/>
        <chakra.span hideBelow="lg">List</chakra.span>
      </Button>
    </ButtonGroupRadio>
  );
};

export default React.memo(AddressNftDisplayTypeRadio);
