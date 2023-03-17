import type { ChakraProps } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Icon, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { FileTree } from './types';

import iconFile from './icons/file.svg';
import iconFolderOpen from './icons/folder-open.svg';
import iconFolder from './icons/folder.svg';
import iconSolidity from './icons/solidity.svg';

interface Props {
  tree: FileTree;
  level?: number;
  isCollapsed?: boolean;
  onItemClick: (event: React.MouseEvent) => void;
}

const CodeEditorFileTree = ({ tree, level = 0, onItemClick, isCollapsed }: Props) => {
  const itemProps: ChakraProps = {
    borderWidth: '0px',
    cursor: 'pointer',
    lineHeight: '22px',
    _last: {
      borderBottomWidth: '0px',
    },
  };
  const rowHoverBgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

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
                      _hover={{ bgColor: rowHoverBgColor }}
                      fontSize="13px"
                      lineHeight="22px"
                      h="22px"
                      transitionDuration="0"
                    >
                      <AccordionIcon transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' } boxSize="16px" color="#616161"/>
                      <Icon as={ isExpanded ? iconFolderOpen : iconFolder } boxSize="16px" mr="4px"/>
                      { leafName }
                    </AccordionButton>
                    <AccordionPanel p="0">
                      <CodeEditorFileTree tree={ leaf.children } level={ level + 1 } onItemClick={ onItemClick } isCollapsed={ isCollapsed }/>
                    </AccordionPanel>
                  </>
                ) }
              </AccordionItem>
            );
          }

          const icon = /.sol|.yul|.vy$/.test(leaf.name) ? iconSolidity : iconFile;

          return (
            <AccordionItem
              key={ index }
              { ...itemProps }
              pl={ `${ 24 + (level * 8) }px` }
              pr="8px"
              onClick={ onItemClick }
              data-file-path={ leaf.file_path }
              display="flex"
              alignItems="center"
              overflow="hidden"
              _hover={{
                bgColor: rowHoverBgColor,
              }}
            >
              <Icon as={ icon } boxSize="16px" mr="4px"/>
              { leafName }
            </AccordionItem>
          );
        })
      }
    </Accordion>
  );
};

export default React.memo(CodeEditorFileTree);
