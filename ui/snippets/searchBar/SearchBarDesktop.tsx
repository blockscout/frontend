import { InputGroup, Input, InputLeftAddon, InputLeftElement, Icon, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import searchIcon from 'icons/search.svg';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isHomepage?: boolean;
}

const SearchBarDesktop = ({ onChange, onSubmit, isHomepage }: Props) => {
  return (
    <chakra.form
      noValidate
      onSubmit={ onSubmit }
      display={{ base: 'none', lg: 'block' }}
      w="100%"
      backgroundColor={ isHomepage ? 'white' : 'none' }
      borderRadius="10px"
    >
      <InputGroup>
        <InputLeftAddon w="111px">All filters</InputLeftAddon>
        <InputLeftElement w={ 6 } ml="132px" mr={ 2.5 }>
          <Icon as={ searchIcon } boxSize={ 6 } color={ useColorModeValue('blackAlpha.600', 'whiteAlpha.600') }/>
        </InputLeftElement>
        <Input
          paddingInlineStart="50px"
          placeholder="Search by addresses / transactions / block / token... "
          ml="1px"
          onChange={ onChange }
          border={ isHomepage ? 'none' : '2px solid' }
          borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
          _focusWithin={{ _placeholder: { color: 'gray.300' } }}
          color={ useColorModeValue('black', 'white') }
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(SearchBarDesktop);
