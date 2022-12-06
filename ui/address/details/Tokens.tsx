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

type Sort = 'desc' | 'asc';
const SORTABLE_TOKENS: Array<TokenType> = [ 'ERC-20', 'ERC-1155' ];
const TOKEN_GROUPS_ORDER: Array<TokenType> = [ 'ERC-20', 'ERC-721', 'ERC-1155' ];
type TokenGroup = [string, Array<AddressTokenBalance>];

const sortTokenGroups = (groupA: TokenGroup, groupB: TokenGroup) => {
  return TOKEN_GROUPS_ORDER.indexOf(groupA[0] as TokenType) > TOKEN_GROUPS_ORDER.indexOf(groupB[0] as TokenType) ? 1 : -1;
};

const sortErc1155Tokens = (sort: 'desc' | 'asc') => (dataA: AddressTokenBalance, dataB: AddressTokenBalance) => {
  if (dataA.value === dataB.value) {
    return 0;
  }
  if (sort === 'desc') {
    return Number(dataA.value) > Number(dataB.value) ? -1 : 1;
  }

  return Number(dataA.value) > Number(dataB.value) ? 1 : -1;
};
const sortErc20Tokens = () => () => 0;

const sortErc721Tokens = () => () => 0;

const sortingFns = {
  'ERC-20': sortErc20Tokens,
  'ERC-721': sortErc721Tokens,
  'ERC-1155': sortErc1155Tokens,
};

const filterTokens = (searchTerm: string) => ({ token }: AddressTokenBalance) => {
  if (!token.name) {
    return !searchTerm ? true : token.address.toLowerCase().includes(searchTerm);
  }

  return token.name?.toLowerCase().includes(searchTerm);
};

interface Props {
  data: Array<AddressTokenBalance>;
}

const AddressTokenSelect = ({ data }: Props) => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ erc1155sort, setErc1155Sort ] = React.useState<Sort>('desc');
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSortClick = React.useCallback((event: React.SyntheticEvent) => {
    const tokenType = (event.currentTarget as HTMLAnchorElement).getAttribute('data-type');
    if (tokenType === 'ERC-1155') {
      setErc1155Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
  }, []);

  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'gray.900');

  const filteredData = data.filter(filterTokens(searchTerm.toLowerCase()));
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
            />
          </InputGroup>
          <Flex flexDir="column" rowGap={ 6 }>
            { Object.entries(groupedData).sort(sortTokenGroups).map(([ tokenType, tokenInfo ]) => {
              const type = tokenType as TokenType;
              const arrowTransform = type === 'ERC-1155' && erc1155sort === 'desc' ? 'rotate(90deg)' : 'rotate(-90deg)';
              const sortDirection: Sort = (() => {
                switch (type) {
                  case 'ERC-1155':
                    return erc1155sort;

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
                  { tokenInfo.sort(sortingFns[type](sortDirection)).map((data) => <TokenItem key={ data.token.address } data={ data }/>) }
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
