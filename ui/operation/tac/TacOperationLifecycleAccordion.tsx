import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { AccordionItem, AccordionRoot } from 'toolkit/chakra/accordion';

import TacOperationLifecycleAccordionItemContent from './TacOperationLifecycleAccordionItemContent';
import TacOperationLifecycleAccordionItemTrigger from './TacOperationLifecycleAccordionItemTrigger';

interface Props {
  data: tac.OperationDetails['status_history'];
  isLoading?: boolean;
  type: tac.OperationType;
}

const TacOperationLifecycleAccordion = ({ data, isLoading, type }: Props) => {
  const isPending = type === tac.OperationType.PENDING && !isLoading;

  return (
    <AccordionRoot maxW="800px" display="flex" flexDirection="column" rowGap={ 6 } lazyMount>
      { data.map((item, index) => {
        const isLast = index === data.length - 1 && !isPending;
        return (
          <AccordionItem key={ index } value={ item.type } borderBottomWidth="0px">
            <TacOperationLifecycleAccordionItemTrigger
              status={ item.type }
              isFirst={ index === 0 }
              isLast={ isLast }
              isLoading={ isLoading }
              isSuccess={ item.is_success ?? false }
            />
            <TacOperationLifecycleAccordionItemContent
              isLast={ isLast }
              data={ item }
            />
          </AccordionItem>
        );
      }) }
      { isPending && (
        <AccordionItem value="pending" borderBottomWidth="0px">
          <TacOperationLifecycleAccordionItemTrigger
            status="pending"
            isFirst={ false }
            isLast={ true }
            isLoading={ isLoading }
            isSuccess={ false }
          />
        </AccordionItem>
      ) }
    </AccordionRoot>
  );
};

export default React.memo(TacOperationLifecycleAccordion);
