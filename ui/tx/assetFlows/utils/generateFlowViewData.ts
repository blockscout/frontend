import _ from 'lodash';

import type { Nft, ResponseData, SentReceived, Token } from 'types/translateApi';

export interface Action {
  label: string;
  amount: string | undefined;
  flowDirection: 'toLeft' | 'toRight';
  nft: Nft | undefined;
  token: Token | undefined;
}
export interface FlowViewItem {
  action: Action;
  rightActor: {
    address: string;
    name: string | null;
  };
  leftActor: {
    address: string;
    name: string | null;
  };
  accountAddress: string;
}

export function generateFlowViewData(data: ResponseData): Array<FlowViewItem> {
  const perspectiveAddress = data.accountAddress.toLowerCase();

  const sent = data.classificationData.sent || [];
  const received = data.classificationData.received || [];

  const txItems = [ ...sent, ...received ];

  const paidGasIndex = _.findIndex(txItems, (item) => item.action === 'paidGas');
  if (paidGasIndex >= 0) {
    const element = txItems.splice(paidGasIndex, 1)[0];
    element.to.name = 'Validators';
    txItems.splice(txItems.length, 0, element);
  }

  const flowViewData = txItems.map((item) => {
    const action = {
      label: item.action,
      amount: item.amount || undefined,
      flowDirection: getFlowDirection(item, perspectiveAddress),
      nft: item.nft || undefined,
      token: item.token || undefined,
    };

    if (item.from.name && item.from.name.includes('(this wallet)')) {
      item.from.name = item.from.name.split('(this wallet)')[0];
    }

    if (item.to.name && item.to.name.includes('(this wallet)')) {
      item.to.name = item.to.name.split('(this wallet)')[0];
    }

    const rightActor = getRightActor(item, perspectiveAddress);

    const leftActor = getLeftActor(item, perspectiveAddress);

    return { action, rightActor, leftActor, accountAddress: perspectiveAddress };
  });

  return flowViewData;
}

function getRightActor(item: SentReceived, perspectiveAddress: string) {
  if (!item.to.address || item.to.address.toLowerCase() !== perspectiveAddress) {
    return { address: item.to.address, name: item.to.name };
  }

  return { address: item.from.address, name: item.from.name };
}

function getLeftActor(item: SentReceived, perspectiveAddress: string) {
  if (item.to.address && item.to.address.toLowerCase() === perspectiveAddress) {
    return { address: item.to.address, name: item.to.name };
  }

  return { address: item.from.address, name: item.from.name };
}

function getFlowDirection(item: SentReceived, perspectiveAddress: string): 'toLeft' | 'toRight' {
  // return "toLeft" or "toRight"
  if (item.to.address && item.to.address.toLowerCase() === perspectiveAddress) {
    return 'toLeft';
  }

  if (item.from.address && item.from.address.toLowerCase() === perspectiveAddress) {
    return 'toRight';
  }

  return 'toLeft'; // default case
}

interface TokensData {
  nameList: Array<string>;
  symbolList: Array<string>;
  idList: Array<string>;
  names: {
    [x: string]: {
      name: string | undefined;
      symbol: string | undefined;
      address: string | undefined;
      id?: string | undefined;
    };
  };
  symbols: {
    [x: string]: {
      name: string | undefined;
      symbol: string | undefined;
      address: string | undefined;
      id: string | undefined;
    };
  };
}

export function getTokensData(data: ResponseData): TokensData {
  const sent = data.classificationData.sent || [];
  const received = data.classificationData.received || [];

  const txItems = [ ...sent, ...received ];

  const tokens = txItems.map((item) => {
    const name = item.nft?.name || item.token?.name;
    const symbol = item.nft?.symbol || item.token?.symbol;

    const token = {
      name: name,
      symbol: symbol?.toLowerCase() === name?.toLowerCase() ? undefined : symbol,
      address: item.nft?.address || item.token?.address,
      id: item.nft?.id || item.token?.id,
    };

    return token;
  });

  const tokensGroupByname = _.groupBy(tokens, 'name');
  const tokensGroupBySymbol = _.groupBy(tokens, 'symbol');
  const tokensGroupById = _.groupBy(tokens, 'id');

  const mappedNames = _.mapValues(tokensGroupByname, (i) => {
    return i[0];
  });

  const mappedSymbols = _.mapValues(tokensGroupBySymbol, (i) => {
    return i[0];
  });

  const mappedIds = _.mapValues(tokensGroupById, (i) => {
    return i[0];
  });

  const nameList = _.keysIn(mappedNames).filter(i => i !== 'undefined');
  const symbolList = _.keysIn(mappedSymbols).filter(i => i !== 'undefined');
  const idList = _.keysIn(mappedIds).filter(i => i !== 'undefined');

  return {
    nameList,
    symbolList,
    idList,
    names: mappedNames,
    symbols: mappedSymbols,
  };
}

export const getSplittedDescription = (translateData: ResponseData) => {
  const description = translateData.classificationData.description;
  const removeEndDot = description.endsWith('.') ? description.slice(0, description.length - 1) : description;
  let parsedDescription = ' ' + removeEndDot;
  const tokenData = getTokensData(translateData);

  const idsMatched = tokenData.idList.filter(id => parsedDescription.includes(`#${ id }`));
  const namesMatched = tokenData.nameList.filter(name => parsedDescription.toUpperCase().includes(` ${ name.toUpperCase() }`));
  let symbolsMatched = tokenData.symbolList.filter(symbol => parsedDescription.toUpperCase().includes(` ${ symbol.toUpperCase() }`));

  symbolsMatched = symbolsMatched.filter(symbol => !namesMatched.includes(tokenData.symbols[symbol]?.name || ''));

  let indicesSorted: Array<number> = [];
  let namesMapped;
  let symbolsMapped;

  if (idsMatched.length) {
    namesMatched.forEach(name => {
      const hasId = idsMatched.includes(tokenData.names[name].id || '');
      if (hasId) {
        parsedDescription = parsedDescription.replaceAll(`#${ tokenData.names[name].id }`, '');
      }
    });

    symbolsMatched.forEach(name => {
      const hasId = idsMatched.includes(tokenData.symbols[name].id || '');
      if (hasId) {
        parsedDescription = parsedDescription.replaceAll(`#${ tokenData.symbols[name].id }`, '');
      }
    });
  }

  if (namesMatched.length) {
    namesMapped = namesMatched.map(name => {
      const searchString = ` ${ name.toUpperCase() }`;
      let hasId = false;

      if (idsMatched.length) {
        hasId = idsMatched.includes(tokenData.names[name].id || '');
      }

      return {
        name,
        hasId,
        indices: [ ...parsedDescription.toUpperCase().matchAll(new RegExp(searchString, 'gi')) ].map(a => a.index) as unknown as Array<number>,
        token: tokenData.names[name],
      };
    });

    namesMapped.forEach(i => indicesSorted.push(...i.indices));
  }

  if (symbolsMatched.length) {
    symbolsMapped = symbolsMatched.map(name => {
      const searchString = ` ${ name.toUpperCase() }`;
      let hasId = false;

      if (idsMatched.length) {
        hasId = idsMatched.includes(tokenData.symbols[name].id || '');
      }

      return {
        name,
        hasId,
        indices: [ ...parsedDescription.toUpperCase().matchAll(new RegExp(searchString, 'gi')) ].map(a => a.index) as unknown as Array<number>,
        token: tokenData.symbols[name],
      };
    });

    symbolsMapped.forEach(i => indicesSorted.push(...i.indices));
  }

  indicesSorted = _.uniq(indicesSorted.sort((a, b) => a - b));

  const tokenWithIndices = _.uniqBy(_.concat(namesMapped, symbolsMapped), 'name');

  const descriptionSplitted = indicesSorted.map((a, i) => {
    const item = tokenWithIndices.find(t => t?.indices.includes(a));

    if (i === 0) {
      return {
        token: item?.token,
        text: parsedDescription.substring(0, a),
        hasId: item?.hasId,
      };
    } else {
      const startIndex = indicesSorted[i - 1] + (tokenWithIndices.find(t => t?.indices.includes(indicesSorted[i - 1]))?.name.length || 0);
      return {
        token: item?.token,
        text: parsedDescription.substring(startIndex + 1, a),
        hasId: item?.hasId,
      };
    }
  });

  const lastIndex = indicesSorted[indicesSorted.length - 1];
  const startIndex = lastIndex + (tokenWithIndices.find(t => t?.indices.includes(lastIndex))?.name.length || 0);
  const restString = parsedDescription.substring(startIndex + 1);

  if (restString) {
    descriptionSplitted.push({ text: restString, token: undefined, hasId: false });
  }

  return descriptionSplitted;
};

export const getFlowCount = (data: ResponseData | undefined) => {
  if (!data) {
    return 0;
  }
  return generateFlowViewData(data).length;
};
