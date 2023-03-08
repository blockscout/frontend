import { AccordionButton, AccordionIcon, AccordionPanel, Box, Flex } from '@chakra-ui/react';
import React from 'react';

import MetadataAccordionItem from './MetadataAccordionItem';
import MetadataAccordionItemTitle from './MetadataAccordionItemTitle';

interface Props {
  name: string;
  value: Array<unknown>;
}

const MetadataItemArray = ({ name, value }: Props) => {

  return (
    <MetadataAccordionItem
      flexDir="column"
      alignItems="stretch"
      pl={{ base: 0, lg: 0 }}
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
        <MetadataAccordionItemTitle name={ name }/>
      </AccordionButton>
      <AccordionPanel p={ 0 } ml={ 126 }>
        { value.map((item, index) => {

          const content = (() => {
            switch (typeof item) {
              case 'object': {
                if (item && !Array.isArray(item)) {
                  return Object.entries(item).map(([ name, value ], index) => (
                    <Flex key={ index } columnGap={ 3 }>
                      <MetadataAccordionItemTitle name={ name } w="70px" fontWeight={ 400 }/>
                      <Box>{ value }</Box>
                    </Flex>
                  ));
                }
              }

              // eslint-disable-next-line no-fallthrough
              default: {
                return <span>{ JSON.stringify(item) }</span>;
              }
            }
          })();

          return (
            <Flex
              key={ index }
              py={ 2 }
              _notFirst={{ borderColor: 'divider', borderTopWidth: '1px' }}
              flexDir="column"
              rowGap={ 2 }
            >
              { content }
            </Flex>
          );
        }) }
      </AccordionPanel>
    </MetadataAccordionItem>
  );
};

export default React.memo(MetadataItemArray);
