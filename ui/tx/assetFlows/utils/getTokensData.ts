import _ from 'lodash';

import type { NovesResponseData } from 'types/api/noves';
import type { TokenInfo } from 'types/api/token';

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

  const txItems = [ ...sent, ...received ];

  // Extract all tokens data
  const tokens = txItems.map((item) => {
    const name = item.nft?.name || item.token?.name || null;
    const symbol = item.nft?.symbol || item.token?.symbol || null;

    const token = {
      name: name,
      symbol: symbol?.toLowerCase() === name?.toLowerCase() ? null : symbol,
      address: item.nft?.address || item.token?.address || '',
      id: item.nft?.id || item.token?.id,
    };

    return token;
  });

  // Group tokens by property into arrays
  const tokensGroupByname = _.groupBy(tokens, 'name');
  const tokensGroupBySymbol = _.groupBy(tokens, 'symbol');
  const tokensGroupById = _.groupBy(tokens, 'id');

  // Map properties to an object and remove duplicates
  const mappedNames = _.mapValues(tokensGroupByname, (i) => {
    return i[0];
  });

  const mappedSymbols = _.mapValues(tokensGroupBySymbol, (i) => {
    return i[0];
  });

  const mappedIds = _.mapValues(tokensGroupById, (i) => {
    return i[0];
  });

  const filters = [ 'undefined', 'null' ];
  // Array of keys to match in string
  const nameList = _.keysIn(mappedNames).filter(i => !filters.includes(i));
  const symbolList = _.keysIn(mappedSymbols).filter(i => !filters.includes(i));
  const idList = _.keysIn(mappedIds).filter(i => !filters.includes(i));

  return {
    nameList,
    symbolList,
    idList,
    byName: mappedNames,
    bySymbol: mappedSymbols,
  };
}
