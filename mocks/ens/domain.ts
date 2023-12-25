import type { EnsDomainDetailed } from 'types/api/ens';

export const ensDomainA: EnsDomainDetailed = {
  id: '0xb140bf9645e54f02ed3c1bcc225566b515a98d1688f10494a5c3bc5b447936a7',
  tokenId: '0xf9b76a83152e20da7e5e671de7d79c7de1a2e63add2796aa187bbf98dd2471a6',
  name: 'cat.eth',
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  resolvedAddress: {
    hash: '0xfe6ab8a0dafe7d41adf247c210451c264155c9b0',
  },
  owner: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  registrationDate: '2021-06-27T13:34:44.000Z',
  expiryDate: '2025-03-01T14:20:24.000Z',
  otherAddresses: {
    ETH: 'fe6ab8a0dafe7d41adf247c210451c264155c9b0',
    GNO: 'DDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    NEAR: 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
  },
};

export const ensDomainB: EnsDomainDetailed = {
  id: '0x632ac7bec8e883416b371b36beaa822f4784208c99d063ee030020e2bd09b885',
  tokenId: '0xf9b76a83152e20da7e5e671de7d79c7de1a2e63add2796aa187bbf98dd2471a7',
  name: 'kitty.kitty.kitty.cat.eth',
  resolvedAddress: null,
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  owner: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  registrationDate: '2023-08-13T13:01:12.000Z',
  expiryDate: null,
  otherAddresses: {},
};

export const ensDomainC: EnsDomainDetailed = {
  id: '0xdb7f351de6d93bda077a9211bdc49f249326d87932e4787d109b0262e9d189ad',
  tokenId: '0xf9b76a83152e20da7e5e671de7d79c7de1a2e63add2796aa187bbf98dd2471a8',
  name: 'duck.duck.eth',
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  resolvedAddress: {
    hash: '0xfe6ab8a0dafe7d41adf247c210451c264155c9b0',
  },
  owner: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  registrationDate: '2022-04-24T07:34:44.000Z',
  expiryDate: '2022-11-01T13:10:36.000Z',
  otherAddresses: {},
};

export const ensDomainD: EnsDomainDetailed = {
  id: '0xdb7f351de6d93bda077a9211bdc49f249326d87932e4787d109b0262e9d189ae',
  tokenId: '0xf9b76a83152e20da7e5e671de7d79c7de1a2e63add2796aa187bbf98dd2471a9',
  name: '🦆.duck.eth',
  registrant: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  resolvedAddress: {
    hash: '0x114d4603199df73e7d157787f8778e21fcd13066',
  },
  owner: null,
  registrationDate: '2022-04-24T07:34:44.000Z',
  expiryDate: '2027-09-23T13:10:36.000Z',
  otherAddresses: {},
};
