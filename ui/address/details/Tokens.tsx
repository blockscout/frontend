import {
  Icon, Text,
  Input, InputGroup, InputLeftElement, useColorModeValue,
  Popover, PopoverTrigger, PopoverContent, PopoverBody, Box,
  useDisclosure,
  Flex,
  Link,
} from '@chakra-ui/react';
import _groupBy from 'lodash/groupBy';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';
import type { TokenType } from 'types/api/tokenInfo';

import arrowIcon from 'icons/arrows/east.svg';
import searchIcon from 'icons/search.svg';

import TokenItem from './TokenItem';
import TokensButton from './TokensButton';
import type { Sort } from './utils';
import { SORTABLE_TOKENS, sortTokenGroups, sortingFns, calculateUsdValue, filterTokens } from './utils';

interface Props {
  data: Array<AddressTokenBalance>;
}

const Tokens = ({ data }: Props) => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ erc1155sort, setErc1155Sort ] = React.useState<Sort>('desc');
  const [ erc20sort, setErc20Sort ] = React.useState<Sort>('desc');
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSortClick = React.useCallback((event: React.SyntheticEvent) => {
    const tokenType = (event.currentTarget as HTMLAnchorElement).getAttribute('data-type');
    if (tokenType === 'ERC-1155') {
      setErc1155Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
    if (tokenType === 'ERC-20') {
      setErc20Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
  }, []);

  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'gray.900');

  const modifiedData = data.filter(filterTokens(searchTerm.toLowerCase())).map(calculateUsdValue);
  const groupedData = _groupBy(modifiedData, 'token.type');

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <TokensButton isOpen={ isOpen } onClick={ onToggle } data={ modifiedData }/>
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
            />
          </InputGroup>
          <Flex flexDir="column" rowGap={ 6 }>
            { Object.entries(groupedData).sort(sortTokenGroups).map(([ tokenType, tokenInfo ]) => {
              const type = tokenType as TokenType;
              const arrowTransform = (type === 'ERC-1155' && erc1155sort === 'desc') || (type === 'ERC-20' && erc20sort === 'desc') ?
                'rotate(90deg)' :
                'rotate(-90deg)';
              const sortDirection: Sort = (() => {
                switch (type) {
                  case 'ERC-1155':
                    return erc1155sort;
                  case 'ERC-20':
                    return erc20sort;
                  default:
                    return 'desc';
                }
              })();

              return (
                <Box key={ type }>
                  <Flex justifyContent="space-between">
                    <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">{ type } tokens ({ tokenInfo.length })</Text>
                    { SORTABLE_TOKENS.includes(type) && (
                      <Link data-type={ type } onClick={ handleSortClick }>
                        <Icon as={ arrowIcon } boxSize={ 5 } transform={ arrowTransform } transitionDuration="fast"/>
                      </Link>
                    ) }
                  </Flex>
                  { tokenInfo.sort(sortingFns[type](sortDirection)).map((data) => <TokenItem key={ data.token.address + data.token_id } data={ data }/>) }
                </Box>
              );
            }) }
          </Flex>
          { modifiedData.length === 0 && searchTerm && <Text fontSize="sm">Could not find any matches.</Text> }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(Tokens);
