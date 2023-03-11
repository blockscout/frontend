import type { ChakraProps } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react';
import React from 'react';

import type { FileTree } from './types';

interface Props {
  tree: FileTree;
  level?: number;
}

const CodeEditorFileTree = ({ tree, level = 0 }: Props) => {
  const itemProps: ChakraProps = {
    ml: level ? 4 : 0,
    borderWidth: '0px',
    _last: {
      borderBottomWidth: '0px',
    },
    cursor: 'pointer',
  };
  return (
    <Accordion allowMultiple>
      {
        tree.map((leaf, index) => {
          if ('children' in leaf) {
            return (
              <AccordionItem key={ index } { ...itemProps }>
                <AccordionButton p={ 0 } _hover={{ bgColor: 'inherit' }} fontSize="sm">
                  <AccordionIcon/>
                  <span>{ leaf.name }</span>
                </AccordionButton>
                <AccordionPanel p={ 0 }>
                  <CodeEditorFileTree tree={ leaf.children } level={ level + 1 }/>
                </AccordionPanel>
              </AccordionItem>
            );
          }

          return (
            <AccordionItem key={ index } { ...itemProps }>
              { leaf.name }
            </AccordionItem>
          );
        })
      }
    </Accordion>
  );
};

export default React.memo(CodeEditorFileTree);
