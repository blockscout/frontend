import { Box, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { clearRecentSearchKeywords, getRecentSearchKeywords, removeRecentSearchKeyword } from 'lib/recentSearchKeywords';
import TextAd from 'ui/shared/ad/TextAd';
import ClearButton from 'ui/shared/ClearButton';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

type Props = {
  onClick: (kw: string) => void;
  onClear: () => void;
};

const SearchBarSuggest = ({ onClick, onClear }: Props) => {
  const isMobile = useIsMobile();
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
      { !isMobile && (
        <Box pb={ 4 } mb={ 5 } borderColor="divider" borderBottomWidth="1px" _empty={{ display: 'none' }}>
          <TextAd/>
        </Box>
      ) }
      <Flex mb={ 3 } justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } variant="secondary">Recent</Text>
        <Link onClick={ clearKeywords }>Clear all</Link>
      </Flex>
      { keywords.map(kw => (
        <Flex
          key={ kw }
          py={ 3 }
          px={ 1 }
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
          alignItems="center"
          justifyContent="space-between"
          cursor="pointer"
          columnGap={ 2 }
          fontWeight={ 700 }
          minW={ 0 }
          flexGrow={ 1 }
        >
          { kw.startsWith('0x') ? (
            <Box overflow="hidden" whiteSpace="nowrap">
              <HashStringShortenDynamic hash={ kw } isTooltipDisabled/>
            </Box>
          ) :
            <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ kw }</Text>
          }
          <ClearButton onClick={ removeKeyword(kw) } flexShrink={ 0 }/>
        </Flex>
      )) }
    </Box>
  );
};

export default SearchBarSuggest;
