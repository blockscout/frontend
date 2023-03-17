import { AccordionButton, AccordionItem, AccordionIcon, AccordionPanel, useColorModeValue, Icon, Box } from '@chakra-ui/react';
import React from 'react';

import type { SearchResult } from './types';

import CodeEditorSearchResultItem from './CodeEditorSearchResultItem';
import iconFile from './icons/file.svg';
import iconSolidity from './icons/solidity.svg';
import getFileName from './utils/getFileName';
import useColors from './utils/useColors';

interface Props {
  data: SearchResult;
  onItemClick: (filePath: string, lineNumber: number) => void;
}

const CodeEditorSearchSection = ({ data, onItemClick }: Props) => {
  const fileName = getFileName(data.file_path);

  const handleFileLineClick = React.useCallback((event: React.MouseEvent) => {
    const lineNumber = Number((event.currentTarget as HTMLDivElement).getAttribute('data-line-number'));
    if (!Object.is(lineNumber, NaN)) {
      onItemClick(data.file_path, Number(lineNumber));
    }
  }, [ data.file_path, onItemClick ]);

  const rowHoverBgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const icon = /.sol|.yul|.vy$/.test(fileName) ? iconSolidity : iconFile;

  const badgeBgColor = useColorModeValue('#c4c4c4', '#4d4d4d');
  const colors = useColors();

  return (
    <AccordionItem borderWidth="0px" _last={{ borderBottomWidth: '0px' }} >
      { ({ isExpanded }) => (
        <>
          <AccordionButton
            py={ 0 }
            px={ 2 }
            _hover={{ bgColor: rowHoverBgColor }}
            fontSize="13px"
            transitionDuration="0"
            lineHeight="22px"
            alignItems="center"
          >
            <AccordionIcon transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' } boxSize="16px" color={ colors.buttons.color }/>
            <Icon as={ icon } boxSize="16px" mr="4px"/>
            <span>{ fileName }</span>
            <Box className="monaco-count-badge" ml="auto" bgColor={ badgeBgColor }>{ data.matches.length }</Box>
          </AccordionButton>
          <AccordionPanel p={ 0 }>
            { data.matches.map((match) => (
              <CodeEditorSearchResultItem
                key={ data.file_path + '_' + match.startLineNumber + '_' + match.startColumn }
                filePath={ data.file_path }
                onClick={ handleFileLineClick }
                { ...match }
              />
            ),
            ) }
          </AccordionPanel>
        </>
      ) }
    </AccordionItem>
  );
};

export default React.memo(CodeEditorSearchSection);
