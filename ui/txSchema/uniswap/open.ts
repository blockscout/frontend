import type CytoscapeComponent from 'react-cytoscapejs';

export const elements: Parameters<typeof CytoscapeComponent['normalizeElements']>[0] = {
  nodes: [
    {
      data: {
        id: 'n0',
        label: '0x39...6b75',
        href: 'https://etherscan.io/address/0x39d075e167ed56a8c1a254930147831b015d6b75',
      },
      classes: 'address',
    },
    {
      data: {
        id: 'n1',
        label: 'Uniswap V3: PoE',
        href: 'https://etherscan.io/address/0x16B348B83Af7501bF8f51b695D43C91ADBB32655',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n2',
        label: 'Uniswap V3: Positions NFT',
        href: 'https://etherscan.io/address/0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n3',
        label: '0x000...0000',
        href: 'https://etherscan.io/address/0x0000000000000000000000000000000000000000',
      },
      classes: 'address',
    },
  ],
  edges: [
    { data: { id: 'e0', source: 'n0', target: 'n1', label: '0: 30,771,107.25177646 PoE' }, classes: 'label straight' },
    { data: { id: 'e1', source: 'n0', target: 'n2', label: '1: 0.6 ETH' }, classes: 'label straight' },
    { data: { id: 'e2', source: 'n2', target: 'n1', label: '1: 0.6 WETH' }, classes: 'label straight' },

    {
      data: {
        id: 'e3',
        source: 'n3',
        target: 'n0',
        label: '3: #314008 Uniswap - 1% - PoE/WETH - 0.000000010016<>MAX',
        href: 'https://etherscan.io/nft/0xc36442b4a4522e871399cd717abdd847ab11fe88/314008',
      },
      classes: 'label straight',
    },
  ],
};
