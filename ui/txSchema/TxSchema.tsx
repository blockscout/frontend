// "exports": { "import": "./dist/react-cytoscape.modern.js", "require": "./dist/react-cytoscape.js" },

import { Link, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';

import TxSchemaGraph from './TxSchemaGraph';
import * as add from './uniswap/add';
import * as open from './uniswap/open';
import * as remove from './uniswap/remove';
import * as swap from './uniswap/swap';

const TxSchema = () => {

  return (
    <Tabs variant="enclosed" isLazy>
      <TabList>
        <Tab>Swap</Tab>
        <Tab>Open position</Tab>
        <Tab>Add liquidity</Tab>
        <Tab>Remove liquidity</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Link
            href="https://etherscan.io/tx/0x06e53c0e241686b10a7e3aa5d3af706144a486d291e2036489ed0c4b62f75cdd"
            target="_blank"
          >
            https://etherscan.io/tx/0x06e53c0e241686b10a7e3aa5d3af706144a486d291e2036489ed0c4b62f75cdd
          </Link>
          <TxSchemaGraph elements={ swap.elements }/>
        </TabPanel>
        <TabPanel>
          <Link
            href="https://etherscan.io/tx/0x192a4604f6dc3a27c7689f395e9ae3b2742b149db5afdafe357b086069537ed2"
            target="_blank"
          >
            https://etherscan.io/tx/0x192a4604f6dc3a27c7689f395e9ae3b2742b149db5afdafe357b086069537ed2
          </Link>
          <TxSchemaGraph elements={ open.elements }/>
        </TabPanel>
        <TabPanel>
          <Link
            href="https://etherscan.io/tx/0xd94b737fe82dfbd24f2d3c0ca00a55bb83c4c95ae4172234fd39a52d9d56a493"
            target="_blank"
          >
            https://etherscan.io/tx/0xd94b737fe82dfbd24f2d3c0ca00a55bb83c4c95ae4172234fd39a52d9d56a493
          </Link>
          <TxSchemaGraph elements={ add.elements }/>
        </TabPanel>
        <TabPanel>
          <Link
            href="https://etherscan.io/tx/0x1a0c19d599e9dca59013fb94c950532316b6814814d77bb8c02d21f0819d4d20"
            target="_blank"
          >
            https://etherscan.io/tx/0x1a0c19d599e9dca59013fb94c950532316b6814814d77bb8c02d21f0819d4d20
          </Link>
          <TxSchemaGraph elements={ remove.elements }/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TxSchema;
