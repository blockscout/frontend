import type { ChakraProps } from '@chakra-ui/react';
import { Box, AccordionItem, AccordionIcon, AccordionPanel, AccordionButton } from '@chakra-ui/react';
import React from 'react';

import LinkExternal from 'ui/shared/LinkExternal';

import TokenInstanceMetadataAccordion from './TokenInstanceMetadataAccordion';
import { formatName } from './utils';

interface Props {
  name: string;
  value: unknown;
  level: number;
}

const TokenInstanceMetadataAccordionItem = ({ name, value, level }: Props) => {

  const title = <Box w="90px" flexShrink={ 0 } fontWeight={ 600 } wordBreak="break-word">{ formatName(name) }</Box>;

  const commonProps: ChakraProps = {
    display: 'flex',
    alignItems: 'flex-start',
    py: 2,
    pl: { base: 0, lg: 6 },
    columnGap: 3,
    borderTopWidth: '1px',
    borderColor: 'divider',
    wordBreak: 'break-all',
    _last: {
      borderBottomWidth: level === 0 ? '1px' : '0px',
    },
    _first: {
      borderTopWidth: level === 0 ? '1px' : '0px',
    },
  };

  switch (typeof value) {
    case 'string': {
      try {
        if (!value.includes('http')) {
          throw new Error();
        }
        const url = new URL(value);
        return (
          <AccordionItem { ...commonProps }>
            { title }
            <LinkExternal href={ url.toString() }>{ value }</LinkExternal>
          </AccordionItem>
        );
      } catch (error) {
        return (
          <AccordionItem { ...commonProps }>
            { title }
            <Box>{ value }</Box>
          </AccordionItem>
        );
      }
    }

    case 'number':
    case 'boolean': {
      return (
        <AccordionItem { ...commonProps }>
          { title }
          <Box>{ value }</Box>
        </AccordionItem>
      );
    }

    case 'object': {
      if (!value) {
        break;
      }

      if (Array.isArray(value)) {
        break;
      }

      if (Object.keys(value).length === 0) {
        break;
      }

      if (level >= 4) {
        return (
          <AccordionItem { ...commonProps }>
            { title }
            <Box whiteSpace="pre-wrap">{ JSON.stringify(value, undefined, 2) }</Box>
          </AccordionItem>
        );
      }

      return (
        <AccordionItem
          { ...commonProps }
          flexDir="column"
          alignItems="stretch"
          pl={ 0 }
          py={ 0 }
        >
          <AccordionButton
            px={ 0 }
            py={ 2 }
            _hover={{ bgColor: 'inherit' }}
            fontSize="sm"
            textAlign="left"
            _expanded={{
              borderColor: 'divider',
              borderBottomWidth: '1px',
            }}
          >
            <AccordionIcon boxSize={ 6 } p={ 1 }/>
            { title }
          </AccordionButton>
          <AccordionPanel p={ 0 }>
            <TokenInstanceMetadataAccordion data={ value as Record<string, unknown> } level={ level + 1 }/>
          </AccordionPanel>
        </AccordionItem>
      );
    }
  }

  return (
    <AccordionItem { ...commonProps }>
      { title }
      <Box>-</Box>
    </AccordionItem>
  );
};

export default React.memo(TokenInstanceMetadataAccordionItem);
