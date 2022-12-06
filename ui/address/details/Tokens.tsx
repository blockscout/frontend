import {
  Icon, Text,
  Input, InputGroup, InputLeftElement, useColorModeValue,
  Popover, PopoverTrigger, PopoverContent, PopoverBody, Box,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import _groupBy from 'lodash/groupBy';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import searchIcon from 'icons/search.svg';

import TokenItem from './TokenItem';
import TokensButton from './TokensButton';

const TOKEN_GROUPS_ORDER = [ 'ERC-20', 'ERC-721', 'ERC-1155' ];
type TokenGroup = [string, Array<AddressTokenBalance>];
const sortTokenGroups = (groupA: TokenGroup, groupB: TokenGroup) => {
  return TOKEN_GROUPS_ORDER.indexOf(groupA[0]) > TOKEN_GROUPS_ORDER.indexOf(groupB[0]) ? 1 : -1;
};

interface Props {
  data: Array<AddressTokenBalance>;
}

const AddressTokenSelect = ({ data }: Props) => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleKeyDown = React.useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'gray.900');

  const filteredData = data.filter(({ token }) => {
    if (!token.name) {
      return !searchTerm ? true : token.address.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return token.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const groupedData = _groupBy(filteredData, 'token.type');

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <TokensButton isOpen={ isOpen } onClick={ onToggle } data={ data }/>
      </PopoverTrigger>
      <PopoverContent w="355px" maxH="450px" overflowY="scroll">
        <PopoverBody px={ 4 } py={ 6 } bgColor={ bgColor } boxShadow="2xl" >
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
          <Flex flexDir="column" rowGap={ 6 }>
            { Object.entries(groupedData).sort(sortTokenGroups).map(([ tokenType, tokenInfo ]) => {
              return (
                <Box key={ tokenType }>
                  <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">{ tokenType } tokens ({ tokenInfo.length })</Text>
                  { tokenInfo.map((data) => <TokenItem key={ data.token.address } data={ data }/>) }
                </Box>
              );
            }) }
          </Flex>
          { filteredData.length === 0 && searchTerm && <Text fontSize="sm">Could not find any matches.</Text> }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(AddressTokenSelect);
