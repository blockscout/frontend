import { test, expect } from 'vitest';

import composeFileTree from './composeFileTree';

const files = [
  {
    key: 'index.sol',
    display_path: 'index.sol',
    source_code: 'zero',
  },
  {
    key: 'contracts/Zeta.eth.sol',
    display_path: 'contracts/Zeta.eth.sol',
    source_code: 'one',
  },
  {
    key: '/_openzeppelin/contracts/utils/Context.sol',
    display_path: '/_openzeppelin/contracts/utils/Context.sol',
    source_code: 'two',
  },
  {
    key: '/_openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol',
    display_path: '/_openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol',
    source_code: 'three',
  },
  {
    key: '/_openzeppelin/contracts/token/ERC20/IERC20.sol',
    display_path: '/_openzeppelin/contracts/token/ERC20/IERC20.sol',
    source_code: 'four',
  },
  {
    key: '/_openzeppelin/contracts/token/ERC20/ERC20.sol',
    display_path: '/_openzeppelin/contracts/token/ERC20/ERC20.sol',
    source_code: 'five',
  },
];

test('builds correct file tree', () => {
  const result = composeFileTree(files);
  expect(result).toMatchInlineSnapshot(`
[
  {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "display_path": "/_openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol",
                        "key": "/_openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol",
                        "name": "IERC20Metadata.sol",
                        "source_code": "three",
                      },
                    ],
                    "name": "extensions",
                  },
                  {
                    "display_path": "/_openzeppelin/contracts/token/ERC20/ERC20.sol",
                    "key": "/_openzeppelin/contracts/token/ERC20/ERC20.sol",
                    "name": "ERC20.sol",
                    "source_code": "five",
                  },
                  {
                    "display_path": "/_openzeppelin/contracts/token/ERC20/IERC20.sol",
                    "key": "/_openzeppelin/contracts/token/ERC20/IERC20.sol",
                    "name": "IERC20.sol",
                    "source_code": "four",
                  },
                ],
                "name": "ERC20",
              },
            ],
            "name": "token",
          },
          {
            "children": [
              {
                "display_path": "/_openzeppelin/contracts/utils/Context.sol",
                "key": "/_openzeppelin/contracts/utils/Context.sol",
                "name": "Context.sol",
                "source_code": "two",
              },
            ],
            "name": "utils",
          },
        ],
        "name": "contracts",
      },
    ],
    "name": "_openzeppelin",
  },
  {
    "children": [
      {
        "display_path": "contracts/Zeta.eth.sol",
        "key": "contracts/Zeta.eth.sol",
        "name": "Zeta.eth.sol",
        "source_code": "one",
      },
    ],
    "name": "contracts",
  },
  {
    "display_path": "index.sol",
    "key": "index.sol",
    "name": "index.sol",
    "source_code": "zero",
  },
]
`);
});
