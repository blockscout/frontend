import type { EnsDomainDetailed } from 'types/api/ens';

import { ADDRESS_PARAMS, ADDRESS_HASH } from './addressParams';
import { TX_HASH } from './tx';

export const ENS_DOMAIN: EnsDomainDetailed = {
  id: '0x126d74db13895f8d3a1d362410212731d1e1d9be8add83e388385f93d84c8c84',
  name: 'kitty.cat.eth',
  tokenId: '0x686f4041f059de13c12563c94bd32b8edef9e4d86c931f37abb8cb69ecf25fd6',
  owner: ADDRESS_PARAMS,
  resolvedAddress: ADDRESS_PARAMS,
  registrant: ADDRESS_PARAMS,
  registrationDate: '2023-12-20T01:29:12.000Z',
  expiryDate: '2099-01-02T01:29:12.000Z',
  otherAddresses: {
    ETH: ADDRESS_HASH,
  },
};

export const ENS_DOMAIN_EVENT = {
  transactionHash: TX_HASH,
  timestamp: '2022-06-06T08:43:15.000000Z',
  fromAddress: ADDRESS_PARAMS,
  action: '0xf7a16963',
};
