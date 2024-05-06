/* eslint-disable max-len */
import type { AddressMetadataTagApi } from 'types/api/addressMetadata';

export const nameTag: AddressMetadataTagApi = {
  slug: 'quack-quack',
  name: 'Quack quack',
  tagType: 'name',
  ordinal: 99,
  meta: null,
};

export const customNameTag: AddressMetadataTagApi = {
  slug: 'unicorn-uproar',
  name: 'Unicorn Uproar',
  tagType: 'name',
  ordinal: 777,
  meta: {
    tagUrl: 'https://example.com',
    bgColor: 'linear-gradient(45deg, deeppink, deepskyblue)',
    textColor: '#FFFFFF',
  },
};

export const genericTag: AddressMetadataTagApi = {
  slug: 'duck-owner',
  name: 'duck owner 🦆',
  tagType: 'generic',
  ordinal: 55,
  meta: {
    bgColor: 'rgba(255,243,12,90%)',
  },
};

export const infoTagWithLink: AddressMetadataTagApi = {
  slug: 'goosegang',
  name: 'GooseGanG GooseGanG GooseGanG GooseGanG GooseGanG GooseGanG GooseGanG',
  tagType: 'classifier',
  ordinal: 11,
  meta: {
    tagUrl: 'https://example.com',
  },
};

export const tagWithTooltip: AddressMetadataTagApi = {
  slug: 'blockscout-heroes',
  name: 'BlockscoutHeroes',
  tagType: 'classifier',
  ordinal: 42,
  meta: {
    tooltipDescription: 'The Blockscout team, EVM blockchain aficionados, illuminate Ethereum networks with unparalleled insight and prowess, leading the way in blockchain exploration! 🚀🔎',
    tooltipIcon: 'https://localhost:3100/icon.svg',
    tooltipTitle: 'Blockscout team member',
    tooltipUrl: 'https://blockscout.com',
  },
};

export const protocolTag: AddressMetadataTagApi = {
  slug: 'aerodrome',
  name: 'Aerodrome',
  tagType: 'protocol',
  ordinal: 0,
  meta: null,
};
