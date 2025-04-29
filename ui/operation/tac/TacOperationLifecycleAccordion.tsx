import React from 'react';

import { AccordionItem, AccordionRoot } from 'toolkit/chakra/accordion';

import TacOperationLifecycleAccordionItemContent from './TacOperationLifecycleAccordionItemContent';
import TacOperationLifecycleAccordionItemTrigger from './TacOperationLifecycleAccordionItemTrigger';

const items = [
  { status: 'Collected in TAC' },
  { status: 'Included in TAC consensus' },
  { status: 'Executed in TAC' },
  { status: 'Collected in TON' },
];

const TacOperationLifecycleAccordion = () => {
  return (
    <AccordionRoot maxW="800px" display="flex" flexDirection="column" rowGap={ 6 }>
      { items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <AccordionItem key={ index } value={ item.status } borderBottomWidth="0px">
            <TacOperationLifecycleAccordionItemTrigger
              status={ item.status }
              isFirst={ index === 0 }
              isLast={ isLast }
            />
            <TacOperationLifecycleAccordionItemContent
              isLast={ isLast }
            />
          </AccordionItem>
        );
      }) }
    </AccordionRoot>
  );
};

export default React.memo(TacOperationLifecycleAccordion);
