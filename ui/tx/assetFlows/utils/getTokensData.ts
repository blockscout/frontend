import _groupBy from 'lodash/groupBy';
import _keysIn from 'lodash/keysIn';
import _mapValues from 'lodash/mapValues';

import type { NovesResponseData } from 'types/api/noves';
import type { TokenInfo } from 'types/api/token';

import { HEX_REGEXP } from 'lib/regexp';

export interface NovesTokenInfo extends Pick<TokenInfo, 'address' | 'name' | 'symbol'> {
  id?: string | undefined;
}

export interface TokensData {
  nameList: Array<string>;
  symbolList: Array<string>;
  idList: Array<string>;
  byName: {
    [x: string]: NovesTokenInfo;
  };
  bySymbol: {
    [x: string]: NovesTokenInfo;
  };
}

export function getTokensData(data: NovesResponseData): TokensData {
  const sent = data.classificationData.sent || [];
  const received = data.classificationData.received || [];
  const approved = data.classificationData.approved ? [ data.classificationData.approved ] : [];

  const txItems = [ ...sent, ...received, ...approved ];

  // Extract all tokens data
  const tokens = txItems.map((item) => {
    const name = item.nft?.name || item.token?.name || null;
    const symbol = item.nft?.symbol || item.token?.symbol || null;
    const address = item.nft?.address || item.token?.address || '';

    const validTokenAddress = address ? HEX_REGEXP.test(address) : false;

    const token = {
      name: name,
      symbol: symbol?.toLowerCase() === name?.toLowerCase() ? null : symbol,
      address: validTokenAddress ? address : '',
      id: item.nft?.id || item.token?.id,
    };

    return token;
  });

  // Group tokens by property into arrays
  const tokensGroupByname = _groupBy(tokens, 'name');
  const tokensGroupBySymbol = _groupBy(tokens, 'symbol');
  const tokensGroupById = _groupBy(tokens, 'id');

  // Map properties to an object and remove duplicates
  const mappedNames = _mapValues(tokensGroupByname, (i) => {
    return i[0];
  });

  const mappedSymbols = _mapValues(tokensGroupBySymbol, (i) => {
    return i[0];
  });

  const mappedIds = _mapValues(tokensGroupById, (i) => {
    return i[0];
  });

  const filters = [ 'undefined', 'null' ];
  // Array of keys to match in string
  const nameList = _keysIn(mappedNames).filter(i => !filters.includes(i));
  const symbolList = _keysIn(mappedSymbols).filter(i => !filters.includes(i));
  const idList = _keysIn(mappedIds).filter(i => !filters.includes(i));

  return {
    nameList,
    symbolList,
    idList,
    byName: mappedNames,
    bySymbol: mappedSymbols,
  };
}
