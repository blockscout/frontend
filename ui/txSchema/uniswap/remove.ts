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
        label: '0xdD...4A74',
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
        href: 'https://etherscan.io/address/0x6c6Bc977E13Df9b0de53b251522280BB72383700',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n4',
        label: '0x000...0000',
        href: 'https://etherscan.io/address/0x0000000000000000000000000000000000000000',
      },
      classes: 'address',
    },
  ],
  edges: [
    { data: { id: 'e0', source: 'n0', target: 'n1', label: '0: 0.124912768936132062 G-UNI' }, classes: 'label bezier' },
    { data: { id: 'e1', source: 'n1', target: 'n4', label: '1: 0.124912768936132062 G-UNI' }, classes: 'label bezier' },
    { data: { id: 'e2', source: 'n3', target: 'n2', label: '2: 9,666.33627609999644696 DAI' }, classes: 'label bezier' },
    { data: { id: 'e3', source: 'n3', target: 'n2', label: '3: 165.254491 USDC' }, classes: 'label bezier' },
    { data: { id: 'e4', source: 'n2', target: 'n0', label: '4: 108.442143978029815702 DAI' }, classes: 'label bezier' },
    { data: { id: 'e5', source: 'n2', target: 'n0', label: '5: 19.331964 USDC' }, classes: 'label bezier' },
  ],
};
