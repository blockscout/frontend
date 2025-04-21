import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { clearRecentSearchKeywords, getRecentSearchKeywords, removeRecentSearchKeyword } from 'lib/recentSearchKeywords';
import { Link } from 'toolkit/chakra/link';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import TextAd from 'ui/shared/ad/TextAd';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

type Props = {
  onClick: (kw: string) => void;
  onClear: () => void;
};

const SearchBarSuggest = ({ onClick, onClear }: Props) => {
  const isMobile = useIsMobile();

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
        <Box pb={ 4 } mb={ 5 } borderColor="border.divider" borderBottomWidth="1px" _empty={{ display: 'none' }}>
          <TextAd/>
        </Box>
      ) }
      <Flex mb={ 3 } justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } color="text.secondary">Recent</Text>
        <Link onClick={ clearKeywords }>Clear all</Link>
      </Flex>
      { keywords.map(kw => (
        <Flex
          key={ kw }
          py={ 3 }
          px={ 1 }
          borderColor="border.divider"
          borderBottomWidth="1px"
          _last={{
            borderBottomWidth: '0',
          }}
          _hover={{
            bgColor: { _light: 'blue.50', _dark: 'gray.800' },
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
              <HashStringShortenDynamic hash={ kw } noTooltip/>
            </Box>
          ) :
            <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ kw }</Text>
          }
          <ClearButton onClick={ removeKeyword(kw) }/>
        </Flex>
      )) }
    </Box>
  );
};

export default SearchBarSuggest;
