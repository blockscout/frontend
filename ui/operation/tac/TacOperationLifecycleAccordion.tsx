import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { AccordionItem, AccordionRoot } from 'toolkit/chakra/accordion';

import TacOperationLifecycleAccordionItemContent from './TacOperationLifecycleAccordionItemContent';
import TacOperationLifecycleAccordionItemTrigger from './TacOperationLifecycleAccordionItemTrigger';

interface Props {
  data: tac.OperationDetails['status_history'];
  isLoading?: boolean;
}

const TacOperationLifecycleAccordion = ({ data, isLoading }: Props) => {
  return (
    <AccordionRoot maxW="800px" display="flex" flexDirection="column" rowGap={ 6 } lazyMount>
      { data.map((item, index) => {
        const isLast = index === data.length - 1;
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
    </AccordionRoot>
  );
};

export default React.memo(TacOperationLifecycleAccordion);
