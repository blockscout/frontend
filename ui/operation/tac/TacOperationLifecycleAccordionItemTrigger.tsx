import { HStack } from '@chakra-ui/react';
import React from 'react';

import { AccordionItemTrigger } from 'toolkit/chakra/accordion';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  status: string;
  isFirst: boolean;
  isLast: boolean;
}

const TacOperationLifecycleAccordionItemTrigger = ({ status, isFirst, isLast }: Props) => {
  return (
    <AccordionItemTrigger
      position="relative"
      pt={ isFirst ? 0 : 1 }
      pb={ 1 }
      _before={ !isFirst ? {
        position: 'absolute',
        left: '9px',
        bottom: 'calc(100% - 6px)',
        width: '0',
        height: '30px',
        borderColor: 'border.divider',
        borderLeftWidth: '2px',
        content: '""',
      } : undefined }
      _after={ !isLast ? {
        position: 'absolute',
        left: '9px',
        top: 'calc(100% - 6px)',
        width: '0',
        height: '6px',
        borderColor: 'border.divider',
        borderLeftWidth: '2px',
        content: '""',
      } : undefined }
      _open={{
        _after: {
          height: { base: '14px', lg: '6px' },
        },
      }}
    >
      <HStack gap={ 2 } color="green.500">
        <IconSvg name="verification-steps/finalized" boxSize={ 5 }/>
        { status }
      </HStack>
    </AccordionItemTrigger>
  );
};

export default React.memo(TacOperationLifecycleAccordionItemTrigger);
