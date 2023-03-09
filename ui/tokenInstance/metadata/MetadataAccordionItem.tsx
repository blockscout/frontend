import { AccordionItem, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  level?: number;
  className?: string;
  isFlat?: boolean;
}

const MetadataAccordionItem = ({ children, className, level, isFlat }: Props) => {
  return (
    <AccordionItem
      className={ className }
      display="flex"
      alignItems="flex-start"
      flexDir={{ base: 'column', lg: 'row' }}
      py={ 2 }
      pl={ isFlat ? 0 : 6 }
      columnGap={ 3 }
      borderTopWidth="1px"
      borderColor="divider"
      wordBreak="break-all"
      rowGap={ 1 }
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
