import { Icon, Text, Box, Input, InputGroup, InputLeftElement, useColorModeValue, Flex, Link } from '@chakra-ui/react';
import type { Dictionary } from 'lodash';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { TokenType } from 'types/api/token';

import arrowIcon from 'icons/arrows/east.svg';
import searchIcon from 'icons/search.svg';

import type { Sort, EnhancedData } from '../utils/tokenUtils';
import { sortTokenGroups, sortingFns } from '../utils/tokenUtils';
import TokenSelectItem from './TokenSelectItem';

interface Props {
  searchTerm: string;
  erc20sort: Sort;
  erc1155sort: Sort;
  modifiedData: Array<EnhancedData>;
  groupedData: Dictionary<Array<EnhancedData>>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSortClick: (event: React.SyntheticEvent) => void;
}

const TokenSelectMenu = ({ erc20sort, erc1155sort, modifiedData, groupedData, onInputChange, onSortClick, searchTerm }: Props) => {
  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  return (
    <>
      <InputGroup size="xs" mb={ 5 }>
        <InputLeftElement >
          <Icon as={ searchIcon } boxSize={ 4 } color={ searchIconColor }/>
        </InputLeftElement>
        <Input
          paddingInlineStart="38px"
          placeholder="Search by token name"
          ml="1px"
          onChange={ onInputChange }
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
          const hasSort = type === 'ERC-1155' || (type === 'ERC-20' && tokenInfo.some(({ usd }) => usd));

          return (
            <Box key={ type }>
              <Flex justifyContent="space-between">
                <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">{ type } tokens ({ tokenInfo.length })</Text>
                { hasSort && (
                  <Link data-type={ type } onClick={ onSortClick } aria-label={ `Sort ${ type } tokens` }>
                    <Icon as={ arrowIcon } boxSize={ 5 } transform={ arrowTransform } transitionDuration="faster"/>
                  </Link>
                ) }
              </Flex>
              { tokenInfo.sort(sortingFns[type](sortDirection)).map((data) => <TokenSelectItem key={ data.token.address + data.token_id } data={ data }/>) }
            </Box>
          );
        }) }
      </Flex>
      { modifiedData.length === 0 && searchTerm && <Text fontSize="sm">Could not find any matches.</Text> }
    </>
  );
};

export default React.memo(TokenSelectMenu);
