import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';
import type { ExcludeNull } from 'types/utils/ExcludeNull';

import LinkExternal from 'ui/shared/LinkExternal';

import { formatName } from './utils';

interface Props {
  data: ExcludeNull<TokenInstance['metadata']>;
}

const TokenInstanceMetadataAccordion = ({ data }: Props) => {

  const renderContent = React.useCallback((value: unknown) => {
    switch (typeof value) {
      case 'string': {
        try {
          if (!value.includes('http')) {
            throw new Error();
          }
          const url = new URL(value);
          return <LinkExternal href={ url.toString() }>{ value }</LinkExternal>;
        } catch (error) {
          return value;
        }
      }

      case 'number':
      case 'boolean': {
        return value;
      }

      default: {
        return '-';
      }
    }
  }, []);

  return (
    <ul>
      { Object.entries(data).map(([ key, value ]) => {
        return (
          <Flex
            as="li"
            key={ key }
            alignItems="flex-start"
            py={ 2 }
            pl={{ base: 0, lg: 6 }}
            columnGap={ 3 }
            borderTopWidth="1px"
            borderColor="divider"
            _last={{
              borderBottomWidth: '1px',
            }}
            wordBreak="break-word"
            fontSize="sm"
          >
            <Box w="90px" flexShrink={ 0 } fontWeight={ 600 }>{ formatName(key) }</Box>
            <Box>{ renderContent(value) }</Box>
          </Flex>
        );
      }) }
    </ul>
  );
};

export default TokenInstanceMetadataAccordion;
