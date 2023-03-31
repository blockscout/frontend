import { Accordion } from '@chakra-ui/react';
import React from 'react';

import MetadataItemArray from './MetadataItemArray';
import MetadataItemObject from './MetadataItemObject';
import MetadataItemPrimitive from './MetadataItemPrimitive';
import { sortFields } from './utils';

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

  const isFlat = Object.entries(data).every(([ , value ]) => typeof value !== 'object');

  const renderItem = React.useCallback((name: string, value: unknown) => {
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean': {
        return <MetadataItemPrimitive key={ name } name={ name } value={ value } isFlat={ isFlat } level={ level }/>;
      }

      case 'object': {
        if (value === null) {
          return <MetadataItemPrimitive key={ name } name={ name } value={ value } isFlat={ isFlat } level={ level }/>;
        }

        if (Array.isArray(value) && value.length > 0) {
          return <MetadataItemArray key={ name } name={ name } value={ value } level={ level }/>;
        }

        if (Object.keys(value).length > 0) {
          return <MetadataItemObject key={ name } name={ name } value={ value as Record<string, unknown> } level={ level }/>;
        }
      }
      // eslint-disable-next-line no-fallthrough
      default: {
        return <MetadataItemPrimitive key={ name } name={ name } value={ String(value) } isFlat={ isFlat } level={ level }/>;
      }
    }
  }, [ level, isFlat ]);

  return (
    <Accordion allowMultiple fontSize="sm" ml={{ base: level === 0 ? 0 : 6, lg: `${ ml }px` }} defaultIndex={ level === 0 ? [ 0 ] : undefined }>
      { Object.entries(data).sort(sortFields).map(([ key, value ]) => renderItem(key, value)) }
    </Accordion>
  );
};

export default React.memo(MetadataAccordion);
