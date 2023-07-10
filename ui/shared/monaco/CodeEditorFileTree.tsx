import type { ChakraProps } from '@chakra-ui/react';
import { Box, Accordion, AccordionButton, AccordionItem, AccordionPanel, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import type { FileTree } from './types';

import CodeEditorFileIcon from './CodeEditorFileIcon';
import CodeEditorMainFileIndicator from './CodeEditorMainFileIndicator';
import iconFolderOpen from './icons/folder-open.svg';
import iconFolder from './icons/folder.svg';
import useThemeColors from './utils/useThemeColors';

interface Props {
  tree: FileTree;
  level?: number;
  isCollapsed?: boolean;
  onItemClick: (event: React.MouseEvent) => void;
  selectedFile: string;
  mainFile?: string;
}

const CodeEditorFileTree = ({ tree, level = 0, onItemClick, isCollapsed, selectedFile, mainFile }: Props) => {
  const itemProps: ChakraProps = {
    borderWidth: '0px',
    cursor: 'pointer',
    lineHeight: '22px',
    _last: {
      borderBottomWidth: '0px',
    },
  };
  const themeColors = useThemeColors();

  return (
    <Accordion allowMultiple defaultIndex={ isCollapsed ? undefined : tree.map((item, index) => index) } reduceMotion>
      {
        tree.map((leaf, index) => {
          const leafName = <chakra.span overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{ leaf.name }</chakra.span>;

          if ('children' in leaf) {
            return (
              <AccordionItem key={ index } { ...itemProps }>
                { ({ isExpanded }) => (
                  <>
                    <AccordionButton
                      pr="8px"
                      py="0"
                      pl={ `${ 8 + 8 * level }px` }
                      _hover={{ bgColor: themeColors['custom.list.hoverBackground'] }}
                      fontSize="13px"
                      lineHeight="22px"
                      h="22px"
                      transitionDuration="0"
                    >
                      <Box
                        className="codicon codicon-tree-item-expanded"
                        transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }
                        boxSize="16px"
                        mr="2px"
                      />
                      <Icon as={ isExpanded ? iconFolderOpen : iconFolder } boxSize="16px" mr="4px"/>
                      { leafName }
                    </AccordionButton>
                    <AccordionPanel p="0">
                      <CodeEditorFileTree
                        tree={ leaf.children }
                        level={ level + 1 }
                        onItemClick={ onItemClick }
                        isCollapsed={ isCollapsed }
                        selectedFile={ selectedFile }
                        mainFile={ mainFile }
                      />
                    </AccordionPanel>
                  </>
                ) }
              </AccordionItem>
            );
          }

          return (
            <AccordionItem
              key={ index }
              { ...itemProps }
              pl={ `${ 26 + (level * 8) }px` }
              pr="8px"
              onClick={ onItemClick }
              data-file-path={ leaf.file_path }
              display="flex"
              position="relative"
              alignItems="center"
              overflow="hidden"
              _hover={{
                bgColor: selectedFile === leaf.file_path ? themeColors['list.inactiveSelectionBackground'] : themeColors['custom.list.hoverBackground'],
              }}
              bgColor={ selectedFile === leaf.file_path ? themeColors['list.inactiveSelectionBackground'] : 'none' }
            >
              { mainFile === leaf.file_path && (
                <CodeEditorMainFileIndicator
                  position="absolute"
                  top={ `${ (22 - 12) / 2 }px` }
                  left={ `${ (26 - 12 - 2) + (level * 8) }px` }
                />
              ) }
              <CodeEditorFileIcon fileName={ leaf.name } mr="4px"/>
              { leafName }
            </AccordionItem>
          );
        })
      }
    </Accordion>
  );
};

export default React.memo(CodeEditorFileTree);
