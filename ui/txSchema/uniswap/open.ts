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
        parent: 'uniswap',
        label: 'Uniswap V3: Positions NFT',
        href: 'https://etherscan.io/address/0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n2',
        parent: 'uniswap',
        label: 'Uniswap V3: PoE',
        href: 'https://etherscan.io/address/0x16B348B83Af7501bF8f51b695D43C91ADBB32655',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n3',
        label: 'WETH',
        href: 'https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      },
      classes: 'address token',
    },
    {
      data: {
        id: 'n4',
        parent: 'uniswap',
        label: 'Virtual Liquidity',
      },
      classes: 'address virtual',
    },
    {
      data: {
        id: 'n5',
        parent: 'uniswap',
        label: 'Virtual Liquidity - 314008',
      },
      classes: 'address virtual',
    },
    {
      data: {
        id: 'n6',
        parent: 'uniswap',
        label: 'UNI-V3-POS #314008',
        href: 'https://etherscan.io/nft/0xc36442b4a4522e871399cd717abdd847ab11fe88/314008',
      },
      classes: 'address nft',
    },

    // {
    //   data: {
    //     id: 'n31111',
    //     label: '0x000...0000',
    //     href: 'https://etherscan.io/address/0x0000000000000000000000000000000000000000',
    //   },
    //   classes: 'address',
    // },

    { data: { id: 'uniswap', label: 'Uniswap v3' }, classes: 'uniswap' },
  ],
  edges: [
    { data: { id: 'e5', source: 'n2', target: 'n4' }, classes: 'tech bezier' },
    { data: { id: 'e9', source: 'n6', target: 'n1' }, classes: 'tech bezier' },

    { data: { id: 'e0', source: 'n0', target: 'n1', label: '0: 0.6 ETH' }, classes: 'label bezier' },
    { data: { id: 'e1', source: 'n0', target: 'n2', label: '1: 30,771,107.25177646 PoE' }, classes: 'label bezier' },
    { data: { id: 'e2', source: 'n1', target: 'n3', label: '2: 0.6 ETH' }, classes: 'label bezier' },
    { data: { id: 'e3', source: 'n3', target: 'n1', label: '3: 0.6 WETH' }, classes: 'label bezier' },
    { data: { id: 'e4', source: 'n1', target: 'n2', label: '4: 0.6 WETH' }, classes: 'label bezier' },
    { data: { id: 'e6', source: 'n4', target: 'n1', label: '5: Mint XX Virtual Liquidity' }, classes: 'label bezier' },
    { data: { id: 'e7', source: 'n1', target: 'n5', label: '6: Mint 1 UNI-V3-POS #314008' }, classes: 'label bezier' },
    { data: { id: 'e8', source: 'n5', target: 'n6', label: '7: Mint XX Virtual Liquidity #314008' }, classes: 'label bezier' },

    // {
    //   data: {
    //     id: 'e3',
    //     source: 'n3',
    //     target: 'n0',
    //     label: '3: #314008 Uniswap - 1% - PoE/WETH - 0.000000010016<>MAX',
    //     href: 'https://etherscan.io/nft/0xc36442b4a4522e871399cd717abdd847ab11fe88/314008',
    //   },
    //   classes: 'label straight',
    // },
  ],
};
