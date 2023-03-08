import { AccordionButton, AccordionIcon, AccordionPanel, Box } from '@chakra-ui/react';
import React from 'react';

import MetadataAccordion from './MetadataAccordion';
import MetadataAccordionItem from './MetadataAccordionItem';
import MetadataAccordionItemTitle from './MetadataAccordionItemTitle';

interface Props {
  name: string;
  value: Record<string, unknown>;
  level: number;
}

const MetadataItemObject = ({ name, value, level }: Props) => {

  if (level >= 4) {
    return (
      <MetadataAccordionItem level={ level }>
        <MetadataAccordionItemTitle name={ name }/>
        <Box whiteSpace="pre-wrap">{ JSON.stringify(value, undefined, 2) }</Box>
      </MetadataAccordionItem>
    );
  }

  return (
    <MetadataAccordionItem
      flexDir="column"
      alignItems="stretch"
      pl={{ base: 0, lg: 0 }}
      py={ 0 }
      level={ level }
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
      <AccordionPanel p={ 0 }>
        <MetadataAccordion data={ value as Record<string, unknown> } level={ level + 1 }/>
      </AccordionPanel>
    </MetadataAccordionItem>
  );
};

export default React.memo(MetadataItemObject);
