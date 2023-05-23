import type CytoscapeComponent from 'react-cytoscapejs';

export const elements: Parameters<typeof CytoscapeComponent['normalizeElements']>[0] = {
  nodes: [
    {
      data: {
        id: 'n0',
        label: '0x11...8dda',
        href: 'https://etherscan.io/address/0x11e4857bb9993a50c685a79afad4e6f65d518dda',
      },
      classes: 'address',
    },
    {
      data: {
        id: 'n1',
        label: 'Uniswap V3: USDC-USDT',
        href: 'https://etherscan.io/address/0x7858E59e0C01EA06Df3aF3D20aC7B0003275D4Bf',
      },
      classes: 'address contract',
    },
    {
      data: {
        id: 'n2',
        label: 'Uniswap V3: Router',
        href: 'https://etherscan.io/address/0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
  ],
  edges: [
    { data: { id: 'e0', source: 'n0', target: 'n1', label: '0: 5.072623 USDT' }, classes: 'edge-label edge-out curve-straight' },
    { data: { id: 'e1', source: 'n1', target: 'n2', label: '1: 5.070084 USDC' }, classes: 'edge-label edge-out curve-straight' },
    { data: { id: 'e2', source: 'n2', target: 'n3', label: '2: 5.070084 USDC' }, classes: 'edge-label edge-out curve-straight' },
    { data: { id: 'e3', source: 'n3', target: 'n0', label: '3: 5.068031851544657337 DAI' }, classes: 'edge-label edge-out curve-straight' },
  ],
};
