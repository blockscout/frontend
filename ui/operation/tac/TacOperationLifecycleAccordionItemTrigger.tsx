import { Box, HStack, Spinner } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { STATUS_LABELS } from 'lib/operations/tac';
import { AccordionItemTrigger } from 'toolkit/chakra/accordion';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  status: tac.OperationStage_StageType | 'pending';
  isFirst: boolean;
  isLast: boolean;
  isLoading?: boolean;
  isSuccess: boolean;
}

const TacOperationLifecycleAccordionItemTrigger = ({ status, isFirst, isLast, isSuccess, isLoading }: Props) => {

  const content = (() => {
    switch (status) {
      case 'pending': {
        return (
          <HStack gap={ 2 }>
            <Spinner size="md"/>
            <Box color="text.secondary">
              Pending
            </Box>
          </HStack>
        );
      }
      default: {
        return (
          <HStack gap={ 2 } color={ isSuccess ? 'green.500' : 'red.600' }>
            <IconSvg name={ isSuccess ? 'verification-steps/finalized' : 'verification-steps/error' } boxSize={ 5 } isLoading={ isLoading }/>
            <Skeleton loading={ isLoading }>
              { STATUS_LABELS[status] }
            </Skeleton>
          </HStack>
        );
      }
    }
  })();

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
      disabled={ isLoading || status === 'pending' }
      noIndicator={ isLoading || status === 'pending' }
      cursor={ status === 'pending' ? 'default' : 'pointer' }
      _disabled={{
        opacity: status === 'pending' ? 1 : 'control.disabled',
      }}
    >
      { content }
    </AccordionItemTrigger>
  );
};

export default React.memo(TacOperationLifecycleAccordionItemTrigger);
