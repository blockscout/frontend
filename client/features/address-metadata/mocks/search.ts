import type { SearchResultMetadataTag } from 'client/features/address-metadata/types/api';

export const metatag1: SearchResultMetadataTag = {
  address_hash: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  name: null,
  type: 'metadata_tag',
  is_smart_contract_verified: false,
  is_smart_contract_address: false,
  url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  metadata: {
    name: 'utko',
    slug: 'utko',
    meta: {},
    tagType: 'name',
    ordinal: 1,
  },
};

export const metatag2: SearchResultMetadataTag = {
  address_hash: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131b',
  name: null,
  type: 'metadata_tag',
  is_smart_contract_verified: false,
  is_smart_contract_address: false,
  url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131b',
  ens_info: {
    address_hash: '0x1234567890123456789012345678901234567890',
    expiry_date: '2022-12-11T17:55:20Z',
    name: 'utko.eth',
    names_count: 1,
  },
  metadata: {
    name: 'utko',
    slug: 'utko',
    meta: {
      cexDeposit: 'true',
    },
    tagType: 'name',
    ordinal: 1,
  },
};

export const metatag3: SearchResultMetadataTag = {
  address_hash: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  name: 'Super utko',
  type: 'metadata_tag',
  is_smart_contract_verified: true,
  certified: true,
  is_smart_contract_address: true,
  url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  metadata: {
    name: 'super utko',
    slug: 'super-utko',
    meta: {},
    tagType: 'protocol',
    ordinal: 1,
  },
};
