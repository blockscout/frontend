import type { EnsDomainDetailed } from 'types/api/ens';

const domainTokenA = {
  id: '97352314626701792030827861137068748433918254309635329404916858191911576754327',
  contract_hash: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
  type: 'NATIVE_DOMAIN_TOKEN' as const,
};
const domainTokenB = {
  id: '423546333',
  contract_hash: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea86',
  type: 'WRAPPED_DOMAIN_TOKEN' as const,
};

export const ensDomainA: EnsDomainDetailed = {
  id: '0xb140bf9645e54f02ed3c1bcc225566b515a98d1688f10494a5c3bc5b447936a7',
  tokens: [
    domainTokenA,
    domainTokenB,
  ],
  name: 'cat.eth',
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  resolved_address: {
    hash: '0xfe6ab8a0dafe7d41adf247c210451c264155c9b0',
  },
  owner: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  wrapped_owner: null,
  registration_date: '2021-06-27T13:34:44.000Z',
  expiry_date: '2025-03-01T14:20:24.000Z',
  other_addresses: {
    ETH: 'fe6ab8a0dafe7d41adf247c210451c264155c9b0',
    GNO: 'DDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    NEAR: 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
  },
};

export const ensDomainB: EnsDomainDetailed = {
  id: '0x632ac7bec8e883416b371b36beaa822f4784208c99d063ee030020e2bd09b885',
  tokens: [ domainTokenA ],
  name: 'kitty.kitty.kitty.cat.eth',
  resolved_address: null,
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  owner: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  wrapped_owner: null,
  registration_date: '2023-08-13T13:01:12.000Z',
  expiry_date: null,
  other_addresses: {},
};

export const ensDomainC: EnsDomainDetailed = {
  id: '0xdb7f351de6d93bda077a9211bdc49f249326d87932e4787d109b0262e9d189ad',
  tokens: [ domainTokenA ],
  name: 'duck.duck.eth',
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  resolved_address: {
    hash: '0xfe6ab8a0dafe7d41adf247c210451c264155c9b0',
  },
  owner: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  wrapped_owner: null,
  registration_date: '2022-04-24T07:34:44.000Z',
  expiry_date: '2022-11-01T13:10:36.000Z',
  other_addresses: {},
};

export const ensDomainD: EnsDomainDetailed = {
  id: '0xdb7f351de6d93bda077a9211bdc49f249326d87932e4787d109b0262e9d189ae',
  tokens: [ domainTokenA ],
  name: '🦆.duck.eth',
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  resolved_address: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  owner: null,
  wrapped_owner: null,
  registration_date: '2022-04-24T07:34:44.000Z',
  expiry_date: '2027-09-23T13:10:36.000Z',
  other_addresses: {},
};
