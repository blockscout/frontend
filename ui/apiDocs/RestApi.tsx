import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot, useAccordion } from 'toolkit/chakra/accordion';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import SwaggerUI from './SwaggerUI';
import { SECTIONS } from './utils';

const RestApi = () => {
  const { value, onValueChange, scrollToItemFromUrl } = useAccordion(SECTIONS);

  React.useEffect(() => {
    scrollToItemFromUrl();
    // runs only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  if (SECTIONS.length === 0) {
    return null;
  }

  if (SECTIONS.length === 1) {
    return <SwaggerUI { ...SECTIONS[0].swagger }/>;
  }

  return (
    <AccordionRoot onValueChange={ onValueChange } value={ value }>
      { SECTIONS.map((section, index) => (
        <AccordionItem key={ index } value={ section.id }>
          <AccordionItemTrigger>
            <CopyToClipboard
              text={ config.app.baseUrl + route({ pathname: '/api-docs', query: { tab: 'rest_api' }, hash: section.id }) }
              type="link"
              ml={ 0 }
              mr={ 1 }
              as="div"
            />
            { section.title }
          </AccordionItemTrigger>
          <AccordionItemContent>
            <SwaggerUI { ...section.swagger }/>
          </AccordionItemContent>
        </AccordionItem>
      )) }
    </AccordionRoot>
  );
};

export default React.memo(RestApi);
