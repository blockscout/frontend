import { Box, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { clearRecentSearchKeywords, getRecentSearchKeywords, removeRecentSearchKeyword } from 'lib/recentSearchKeywords';
import ClearButton from 'ui/shared/ClearButton';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

type Props = {
  onClick: (kw: string) => void;
  onClear: () => void;
}

const SearchBarSuggest = ({ onClick, onClear }: Props) => {
  const bgHoverColor = useColorModeValue('blue.50', 'gray.800');

  const [ keywords, setKeywords ] = React.useState<Array<string>>(getRecentSearchKeywords());

  const handleClick = React.useCallback((kw: string) => () => {
    onClick(kw);
  }, [ onClick ]);

  const clearKeywords = React.useCallback(() => {
    clearRecentSearchKeywords();
    onClear();
  }, [ onClear ]);

  const removeKeyword = React.useCallback((kw: string) => (e: React.SyntheticEvent) => {
    e.stopPropagation();
    const result = keywords.filter(item => item !== kw);
    setKeywords(result);
    if (result.length === 0) {
      onClear();
    }
    removeRecentSearchKeyword(kw);
  }, [ keywords, onClear ]);

  if (keywords.length === 0) {
    return null;
  }

  return (
    <Box py={ 6 }>
      <Flex mb={ 3 } justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } variant="secondary">Recent</Text>
        <Link onClick={ clearKeywords }>Clear all</Link>
      </Flex>
      { keywords.map(kw => (
        <Box
          key={ kw }
          py={ 3 }
          px={ 1 }
          display="flex"
          flexDir="column"
          rowGap={ 2 }
          borderColor="divider"
          borderBottomWidth="1px"
          _last={{
            borderBottomWidth: '0',
          }}
          _hover={{
            bgColor: bgHoverColor,
          }}
          fontSize="sm"
          _first={{
            mt: 2,
          }}
          onClick={ handleClick(kw) }
        >
          <Flex display="flex" alignItems="center" justifyContent="space-between" cursor="pointer">
            <Text fontWeight={ 700 } mr={ 2 } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              { kw.startsWith('0x') ? <HashStringShortenDynamic hash={ kw } isTooltipDisabled/> : kw }
            </Text>
            <ClearButton onClick={ removeKeyword(kw) }/>
          </Flex>
        </Box>
      )) }
    </Box>
  );
};

export default SearchBarSuggest;
