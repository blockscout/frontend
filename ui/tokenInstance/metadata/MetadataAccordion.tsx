import { Accordion } from '@chakra-ui/react';
import React from 'react';

import MetadataItemArray from './MetadataItemArray';
import MetadataItemObject from './MetadataItemObject';
import MetadataItemPrimitive from './MetadataItemPrimitive';

interface Props {
  data: Record<string, unknown>;
  level?: number;
}

const MetadataAccordion = ({ data, level = 0 }: Props) => {

  const ml = (() => {
    if (level === 0) {
      return 0;
    }

    if (level === 1) {
      return 126;
    }

    return 24;
  })();

  const renderItem = React.useCallback((name: string, value: unknown) => {
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean': {
        return <MetadataItemPrimitive name={ name } value={ value }/>;
      }

      case 'object': {
        if (value === null) {
          return <MetadataItemPrimitive name={ name } value={ value }/>;
        }

        if (Array.isArray(value) && value.length > 0) {
          return <MetadataItemArray name={ name } value={ value }/>;
        }

        if (Object.keys(value).length > 0) {
          return <MetadataItemObject name={ name } value={ value as Record<string, unknown> } level={ level }/>;
        }
      }
      // eslint-disable-next-line no-fallthrough
      default: {
        return <MetadataItemPrimitive name={ name } value={ String(value) }/>;
      }
    }
  }, [ level ]);

  return (
    <Accordion allowMultiple fontSize="sm" ml={ `${ ml }px` } defaultIndex={ level === 0 ? [ 0 ] : undefined }>
      { Object.entries(data).map(([ key, value ]) => {
        return renderItem(key, value);
      }) }
    </Accordion>
  );
};

export default React.memo(MetadataAccordion);
