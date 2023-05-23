import type CytoscapeComponent from 'react-cytoscapejs';

export const elements: Parameters<typeof CytoscapeComponent['normalizeElements']>[0] = {
  nodes: [
    {
      data: {
        id: 'n0',
        label: 'asfire.eth',
        href: 'https://etherscan.io/address/0xf9f41c487fd784e0cf7522206a2aeb4fe7b34b9c',
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
    { data: { id: 'e0', source: 'n0', target: 'n1', label: '0: 28.78299468309970842 DAI' }, classes: 'edge-label edge-out curve-unbundled-bezier' },
    { data: { id: 'e1', source: 'n0', target: 'n1', label: '1: 23.1524 USDC' }, classes: 'edge-label edge-out curve-unbundled-bezier' },
    { data: { id: 'e2', source: 'n1', target: 'n2', label: '2: 28.782370186250247577 DAI' }, classes: 'edge-label edge-out curve-unbundled-bezier' },
    { data: { id: 'e3', source: 'n1', target: 'n2', label: '3: 23.1524 USDC' }, classes: 'edge-label edge-out curve-unbundled-bezier' },
    { data: { id: 'e4', source: 'n2', target: 'n3', label: '4: 28.782370186250247577 DAI' }, classes: 'edge-label edge-out curve-unbundled-bezier' },
    { data: { id: 'e5', source: 'n2', target: 'n3', label: '5: 23.1524 USDC' }, classes: 'edge-label edge-out curve-unbundled-bezier' },
    {
      data: {
        id: 'e6',
        source: 'n4',
        target: 'n0',
        label: '6: 0.050779980016703025 G-UNI',
        href: 'https://etherscan.io/token/0xabddafb225e10b90d798bb8a886238fb835e2053?a=0xf9f41c487fd784e0cf7522206a2aeb4fe7b34b9c',
      },
      classes: 'edge-label edge-in curve-straight',
    },
  ],
};
