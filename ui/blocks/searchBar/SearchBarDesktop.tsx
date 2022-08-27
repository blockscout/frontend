import { SearchIcon } from '@chakra-ui/icons';
import { InputGroup, Input, InputLeftAddon, InputLeftElement, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const SearchBarDesktop = ({ onChange, onSubmit }: Props) => {
  return (
    <form noValidate onSubmit={ onSubmit }>
      <InputGroup>
        <InputLeftAddon w="111px">All filters</InputLeftAddon>
        <InputLeftElement w={ 6 } ml="132px" mr={ 2.5 }>
          <SearchIcon w={ 5 } h={ 5 } color={ useColorModeValue('blackAlpha.600', 'whiteAlpha.600') }/>
        </InputLeftElement>
        <Input
          paddingInlineStart="50px"
          placeholder="Search by addresses / transactions / block / token... "
          ml="1px"
          onChange={ onChange }
          borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
        />
      </InputGroup>
    </form>
  );
};

export default React.memo(SearchBarDesktop);
