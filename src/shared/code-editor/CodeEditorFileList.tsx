// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import CodeEditorFileIcon from './CodeEditorFileIcon';
import CodeEditorMainFileIndicator from './CodeEditorMainFileIndicator';
import type { FileListItem } from './utils/compose-file-list';
import useThemeColors from './utils/useThemeColors';

interface Props {
  items: Array<FileListItem>;
  onItemClick: (event: React.MouseEvent) => void;
  selectedFile: string;
  mainFile: string | undefined;
}

const CodeEditorFileList = ({ items, onItemClick, selectedFile, mainFile }: Props) => {
  const themeColors = useThemeColors();

  return (
    <Box>
      { items.map((item) => {
        const isSelected = selectedFile === item.key;

        return (
          <Flex
            key={ item.key }
            pl="26px"
            pr="8px"
            onClick={ onItemClick }
            data-file-key={ item.key }
            title={ item.path }
            position="relative"
            alignItems="center"
            overflow="hidden"
            cursor="pointer"
            lineHeight="22px"
            whiteSpace="nowrap"
            _hover={{
              bgColor: isSelected ? themeColors['list.inactiveSelectionBackground'] : themeColors['custom.list.hoverBackground'],
            }}
            bgColor={ isSelected ? themeColors['list.inactiveSelectionBackground'] : 'none' }
          >
            { mainFile === item.key && (
              <CodeEditorMainFileIndicator
                position="absolute"
                top={ `${ (22 - 12) / 2 }px` }
                left={ `${ 26 - 12 - 2 }px` }
              />
            ) }
            <CodeEditorFileIcon fileName={ item.name } mr="4px" flexShrink={ 0 }/>
            <Flex minW={ 0 } overflow="hidden">
              <chakra.span flexShrink={ 0 } maxW="100%" overflow="hidden" textOverflow="ellipsis">{ item.name }</chakra.span>
              { item.directory && (
                <chakra.span minW={ 0 } ml="6px" opacity={ 0.7 } overflow="hidden" textOverflow="ellipsis">{ item.directory }</chakra.span>
              ) }
            </Flex>
          </Flex>
        );
      }) }
    </Box>
  );
};

export default React.memo(CodeEditorFileList);
