import { AccordionItem, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  level?: number;
  className?: string;
}

const MetadataAccordionItem = ({ children, className, level }: Props) => {
  return (
    <AccordionItem
      className={ className }
      display="flex"
      alignItems="flex-start"
      py={ 2 }
      pl={{ base: 0, lg: 6 }}
      columnGap={ 3 }
      borderTopWidth="1px"
      borderColor="divider"
      wordBreak="break-all"
      _last={{
        borderBottomWidth: level === 0 ? '1px' : '0px',
      }}
      _first={{
        borderTopWidth: level === 0 ? '1px' : '0px',
      }}
    >
      { children }
    </AccordionItem>
  );
};

export default React.memo(chakra(MetadataAccordionItem));
