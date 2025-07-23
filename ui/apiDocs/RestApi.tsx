import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot, useAccordion } from 'toolkit/chakra/accordion';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import SwaggerUI from './SwaggerUI';
import { REST_API_SECTIONS } from './utils';

const RestApi = () => {
  const { value, onValueChange, scrollToItemFromUrl } = useAccordion(REST_API_SECTIONS);

  React.useEffect(() => {
    scrollToItemFromUrl();
    // runs only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  if (REST_API_SECTIONS.length === 0) {
    return null;
  }

  if (REST_API_SECTIONS.length === 1) {
    return <SwaggerUI { ...REST_API_SECTIONS[0].swagger }/>;
  }

  return (
    <AccordionRoot onValueChange={ onValueChange } value={ value }>
      { REST_API_SECTIONS.map((section, index) => (
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
