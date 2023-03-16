import _capitalize from 'lodash/capitalize';

import type { Metadata } from 'types/client/token';

import dayjs from 'lib/date/dayjs';

function formatValue(value: string | number, display: string | undefined): string {
  // https://docs.opensea.io/docs/metadata-standards#attributes
  switch (display) {
    case 'boost_number': {
      return `+${ value } boost`;
    }
    case 'boost_percentage': {
      return `${ value }% boost`;
    }
    case 'date': {
      return dayjs(value).format('YYYY-MM-DD');
    }
    default: {
      return String(value);
    }
  }
}

export default function attributesParser(attributes: Array<unknown>): Metadata['attributes'] {
  return attributes
    .map((item) => {
      if (typeof item !== 'object' || !item) {
        return;
      }

      const value = 'value' in item && (typeof item.value === 'string' || typeof item.value === 'number') ? item.value : undefined;
      const trait = 'trait_type' in item && typeof item.trait_type === 'string' ? item.trait_type : undefined;
      const display = 'display_type' in item && typeof item.display_type === 'string' ? item.display_type : undefined;

      if (!value) {
        return;
      }

      return {
        value: formatValue(value, display),
        trait_type: _capitalize(trait || 'property'),
      };
    })
    .filter(Boolean);
}
