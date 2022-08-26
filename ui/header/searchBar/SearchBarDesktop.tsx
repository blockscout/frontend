import { SearchIcon } from '@chakra-ui/icons';
import { InputGroup, Input, InputLeftAddon, InputLeftElement, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent } from 'react';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBarDesktop = ({ onChange }: Props) => {
  return (
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
  );
};

export default React.memo(SearchBarDesktop);
