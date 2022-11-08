import { InputGroup, Input, InputLeftElement, Icon, LightMode, chakra } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import searchIcon from 'icons/search.svg';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  backgroundColor?: string;
}

const SearchBarMobileHome = ({ onChange, onSubmit, backgroundColor }: Props) => {
  const commonProps = {
    noValidate: true,
    onSubmit: onSubmit,
    width: '100%',
    display: { base: 'block', lg: 'none' },
  };

  return (
    <LightMode>
      <chakra.form
        { ...commonProps }
        bgColor={ backgroundColor }
        h="60px"
        borderRadius="10px"
      >
        <InputGroup size="md">
          <InputLeftElement >
            <Icon as={ searchIcon } boxSize={ 6 } color="blackAlpha.600"/>
          </InputLeftElement>
          <Input
            paddingInlineStart="38px"
            placeholder="Search by addresses / ... "
            ml="1px"
            onChange={ onChange }
            border="none"
          />
        </InputGroup>
      </chakra.form>
    </LightMode>
  );
};

export default SearchBarMobileHome;
