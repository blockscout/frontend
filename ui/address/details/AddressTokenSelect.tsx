import {
  Icon, Text, Button, Menu, MenuButton, MenuGroup, MenuList,
  Input, forwardRef, InputGroup, InputLeftElement, useColorModeValue,
} from '@chakra-ui/react';
import _groupBy from 'lodash/groupBy';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import arrowIcon from 'icons/arrows/east-mini.svg';
import searchIcon from 'icons/search.svg';
import tokensIcon from 'icons/tokens.svg';

import AddressTokenSelectErc20 from './AddressTokenSelectErc20';

const Trigger = forwardRef((props, ref) => {
  return (
    <Button
      { ...props }
      ref={ ref }
      size="sm"
      variant="outline"
      colorScheme="gray"
    >
      <Icon as={ tokensIcon } boxSize={ 5 } mr={ 2 }/>
      <Text fontWeight={ 600 }>2</Text>
      <Text whiteSpace="pre" variant="secondary" fontWeight={ 400 }> ($23 463.73 USD)</Text>
      <Icon as={ arrowIcon } transform={ props.isActive ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="normal" boxSize={ 5 } ml={ 3 }/>
    </Button>
  );
});

interface Props {
  data: Array<AddressTokenBalance>;
}

const AddressTokenSelect = ({ data }: Props) => {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const handleInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleKeyDown = React.useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'gray.900');

  const filteredData = data.filter(({ token }) => token.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const groupedData = _groupBy(filteredData, 'token.type');

  return (
    <Menu>
      { ({ isOpen }) => (
        <>
          <MenuButton isActive={ isOpen } as={ Trigger }/>
          <MenuList px={ 4 } py={ 6 } w="355px" bgColor={ bgColor } boxShadow="2xl">
            <InputGroup size="xs" mb={ 5 }>
              <InputLeftElement >
                <Icon as={ searchIcon } boxSize={ 4 } color={ searchIconColor }/>
              </InputLeftElement>
              <Input
                paddingInlineStart="38px"
                placeholder="Search by token name"
                ml="1px"
                onChange={ handleInputChange }
                borderColor={ inputBorderColor }
                onKeyDown={ handleKeyDown }
              />
            </InputGroup>
            { groupedData['ERC-20'] && (
              <MenuGroup title={ `ERC-20 tokens (${ groupedData['ERC-20'].length })` } mb={ 3 } mt={ 0 } mx={ 0 } color="gray.500">
                { groupedData['ERC-20'].map((data) => <AddressTokenSelectErc20 key={ data.token.address } data={ data }/>) }
              </MenuGroup>
            ) }
          </MenuList>
        </>
      ) }
    </Menu>
  );
};

export default React.memo(AddressTokenSelect);
