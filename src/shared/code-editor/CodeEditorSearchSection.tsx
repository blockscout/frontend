// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { SearchResult } from './types';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger } from 'src/toolkit/chakra/accordion';

import CodeEditorFileIcon from './CodeEditorFileIcon';
import CodeEditorSearchResultItem from './CodeEditorSearchResultItem';
import getFileName from './utils/getFileName';
import useThemeColors from './utils/useThemeColors';

interface Props {
  data: SearchResult;
  directory: string | undefined;
  path: string;
  onItemClick: (fileKey: string, lineNumber: number) => void;
}

const CodeEditorSearchSection = ({ data, directory, path, onItemClick }: Props) => {
  const fileName = getFileName(data.display_path);

  const handleFileLineClick = React.useCallback((event: React.MouseEvent) => {
    const lineNumber = Number((event.currentTarget as HTMLDivElement).getAttribute('data-line-number'));
    if (!Object.is(lineNumber, NaN)) {
      onItemClick(data.key, Number(lineNumber));
    }
  }, [ data.key, onItemClick ]);

  const themeColors = useThemeColors();

  return (
    <AccordionItem value={ data.key } borderWidth="0px" _last={{ borderBottomWidth: '0px' }}>
      <AccordionItemTrigger
        py={ 0 }
        px={ 2 }
        _hover={{ bgColor: themeColors['custom.list.hoverBackground'] }}
        fontSize="13px"
        transitionDuration="0"
        lineHeight="22px"
        alignItems="center"
        noIndicator
        title={ path }
      >
        <Box
          className="codicon codicon-tree-item-expanded"
          transform="rotate(-90deg)"
          _groupExpanded={{
            transform: 'rotate(0deg)',
          }}
          width="20px"
          height="22px"
          py="3px"
          flexShrink={ 0 }
        />
        <CodeEditorFileIcon mr="4px" fileName={ fileName }/>
        <Flex
          mr="8px"
          minW={ 0 }
          whiteSpace="nowrap"
          overflow="hidden"
          textAlign="left"
        >
          <chakra.span flexShrink={ 0 } maxW="100%" overflow="hidden" textOverflow="ellipsis">{ fileName }</chakra.span>
          { directory && (
            <chakra.span minW={ 0 } ml="6px" fontSize="11px" opacity={ 0.7 } overflow="hidden" textOverflow="ellipsis">{ directory }</chakra.span>
          ) }
        </Flex>
        <Box
          className="monaco-count-badge"
          ml="auto"
          bgColor={ themeColors['badge.background'] }
          flexShrink={ 0 }
        >
          { data.matches.length }
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent p={ 0 }>
        { data.matches.map((match) => (
          <CodeEditorSearchResultItem
            key={ data.key + '_' + match.startLineNumber + '_' + match.startColumn }
            fileKey={ data.key }
            onClick={ handleFileLineClick }
            { ...match }
          />
        ),
        ) }
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default React.memo(CodeEditorSearchSection);
