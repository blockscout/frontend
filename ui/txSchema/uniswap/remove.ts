import type CytoscapeComponent from 'react-cytoscapejs';

export const elements: Parameters<typeof CytoscapeComponent['normalizeElements']>[0] = {
  nodes: [
    {
      data: {
        id: 'n0',
        label: '0x26...106e',
        href: 'https://etherscan.io/address/0x26c9fc612b005781127246bbc5dc39f823e3106e',
      },
      classes: 'address',
    },
    {
      data: {
        id: 'n1',
        label: 'EIP173Proxy\nWithReceive',
        href: 'https://etherscan.io/address/0xdD92062aDF9F6EDf528babe7F04804fe86424A74',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n2',
        label: 'Arrakis: DAI-USDC',
        href: 'https://etherscan.io/address/0xAbDDAfB225e10B90D798bB8A886238Fb835e2053',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n3',
        label: 'Uniswap V3: DAI-USDC',
        parent: 'uniswap',
        href: 'https://etherscan.io/address/0x6c6Bc977E13Df9b0de53b251522280BB72383700',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n4',
        parent: 'uniswap',
        label: 'Virtual Owed DAI',
      },
      classes: 'address virtual',
    },
    {
      data: {
        id: 'n5',
        parent: 'uniswap',
        label: 'Virtual Owed USDC',
      },
      classes: 'address virtual',
    },
    {
      data: {
        id: 'n6',
        parent: 'uniswap',
        label: 'Virtual Liquidity',
      },
      classes: 'address virtual',
    },

    { data: { id: 'uniswap', label: 'Uniswap v3' }, classes: 'uniswap' },
  ],
  edges: [
    { data: { id: 'et0', source: 'n3', target: 'n4' }, classes: 'tech bezier' },
    { data: { id: 'et1', source: 'n3', target: 'n5' }, classes: 'tech bezier' },
    { data: { id: 'et2', source: 'n3', target: 'n6' }, classes: 'tech bezier' },

    { data: { id: 'e0', source: 'n0', target: 'n1', label: '0: 0.124912768936132062 G-UNI' }, classes: 'label bezier' },
    { data: { id: 'e1', source: 'n1', target: 'n2', label: '1: Burn 0.124912768936132062 G-UNI' }, classes: 'label bezier' },
    { data: { id: 'e2', source: 'n5', target: 'n2', label: '2: Mint 19.331964 Virtual Owed USDC' }, classes: 'label bezier' },
    { data: { id: 'e3', source: 'n4', target: 'n2', label: '3: Mint 108.442143978029815702 Virtual Owed DAI' }, classes: 'label bezier' },
    { data: { id: 'e4', source: 'n2', target: 'n6', label: '4: Burn XX Virtual Liquidity' }, classes: 'label bezier' },
    { data: { id: 'e5', source: 'n3', target: 'n2', label: '5: 9,666.33627609999644696 DAI' }, classes: 'label bezier' },
    { data: { id: 'e6', source: 'n3', target: 'n2', label: '6: 165.254491 USDC' }, classes: 'label bezier' },
    { data: { id: 'e7', source: 'n2', target: 'n4', label: '7: Burn 9,666.33627609999644696 DAI' }, classes: 'label bezier' },
    { data: { id: 'e8', source: 'n2', target: 'n5', label: '8: Burn 165.254491 USDC' }, classes: 'label bezier' },
    { data: { id: 'e9', source: 'n2', target: 'n0', label: '9: 108.442143978029815702 DAI' }, classes: 'label bezier' },
    { data: { id: 'e10', source: 'n2', target: 'n0', label: '10: 19.331964 USDC' }, classes: 'label bezier' },
  ],
};
