import { SearchIcon } from '@chakra-ui/icons';
import { InputGroup, Input, InputLeftElement, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent } from 'react';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBarMobile = ({ onChange }: Props) => {
  return (
    <InputGroup size="sm">
      <InputLeftElement >
        <SearchIcon w={ 4 } h={ 4 } color={ useColorModeValue('blackAlpha.600', 'whiteAlpha.600') }/>
      </InputLeftElement>
      <Input
        paddingInlineStart="38px"
        placeholder="Search by addresses / ... "
        ml="1px"
        onChange={ onChange }
        borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      />
    </InputGroup>
  );
};

export default React.memo(SearchBarMobile);
