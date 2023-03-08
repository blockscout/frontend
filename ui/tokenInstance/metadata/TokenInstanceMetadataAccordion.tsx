import { Accordion } from '@chakra-ui/react';
import React from 'react';

import TokenInstanceMetadataAccordionItem from './TokenInstanceMetadataAccordionItem';

interface Props {
  data: Record<string, unknown>;
  level?: number;
}

const TokenInstanceMetadataAccordion = ({ data, level = 0 }: Props) => {

  const ml = (() => {
    if (level === 0) {
      return 0;
    }

    if (level === 1) {
      return 126;
    }

    return 24;
  })();

  return (
    <Accordion allowMultiple fontSize="sm" ml={ `${ ml }px` } defaultIndex={ level === 0 ? [ 0 ] : undefined }>
      { Object.entries(data).map(([ key, value ]) => {
        return <TokenInstanceMetadataAccordionItem key={ key } name={ key } value={ value } level={ level }/>;
      }) }
    </Accordion>
  );
};

export default React.memo(TokenInstanceMetadataAccordion);
