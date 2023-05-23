// "exports": { "import": "./dist/react-cytoscape.modern.js", "require": "./dist/react-cytoscape.js" },

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';

import TxSchemaGraph from './TxSchemaGraph';
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
          <TxSchemaGraph elements={ swap.elements }/>
        </TabPanel>
        <TabPanel>
          <p>Open position</p>
        </TabPanel>
        <TabPanel>
          <p>Add liquidity</p>
        </TabPanel>
        <TabPanel>
          <p>Remove liquidity</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TxSchema;
