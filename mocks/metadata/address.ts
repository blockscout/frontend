import type { AddressMetadataInfo, AddressMetadataTag } from 'types/api/metadata';

import { hash } from '../address/address';

export const nameTag1: AddressMetadataTag = {
  slug: 'ethermineru',
  name: 'Ethermine.ru',
  tagType: 'name',
  ordinal: 0,
  meta: {},
};

export const genericTag1: AddressMetadataTag = {
  slug: 'ethermine.ru',
  name: 'Ethermine.ru',
  tagType: 'generic',
  ordinal: 0,
  meta: {},
};

export const protocolTag1: AddressMetadataTag = {
  slug: 'aerodrome',
  name: 'Aerodrome',
  tagType: 'protocol',
  ordinal: 0,
  meta: {},
};

export const baseInfo: AddressMetadataInfo = {
  addresses: {
    [hash]: {
      tags: [ nameTag1, genericTag1, protocolTag1 ],
      reputation: null,
    },
  },
};
