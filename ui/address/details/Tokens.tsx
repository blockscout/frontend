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

import TokenItemErc1155 from './TokenItemErc1155';
import TokenItemErc20 from './TokenItemErc20';
import TokenItemErc721 from './TokenItemErc721';
import TokensButton from './TokensButton';

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

  const filteredData = data.filter(({ token }) => !token.name && !searchTerm ? true : token.name?.toLowerCase().includes(searchTerm.toLowerCase()));
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
            { groupedData['ERC-20'] && (
              <Box>
                <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">ERC-20 tokens ({ groupedData['ERC-20'].length })</Text>
                { groupedData['ERC-20'].map((data) => <TokenItemErc20 key={ data.token.address } data={ data }/>) }
              </Box>
            ) }
            { groupedData['ERC-721'] && (
              <Box>
                <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">ERC-721 tokens ({ groupedData['ERC-721'].length })</Text>
                { groupedData['ERC-721'].map((data) => <TokenItemErc721 key={ data.token.address } data={ data }/>) }
              </Box>
            ) }
            { groupedData['ERC-1155'] && (
              <Box>
                <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">ERC-1155 tokens ({ groupedData['ERC-1155'].length })</Text>
                { groupedData['ERC-1155'].map((data) => <TokenItemErc1155 key={ data.token.address } data={ data }/>) }
              </Box>
            ) }
          </Flex>
          { filteredData.length === 0 && searchTerm && <Text fontSize="sm">Could not find any matches.</Text> }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(AddressTokenSelect);
