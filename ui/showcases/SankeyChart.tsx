import { Box } from '@chakra-ui/react';
import React from 'react';

import { SankeyChart } from 'toolkit/components/charts/sankey';
import type { SankeyData } from 'toolkit/components/charts/sankey';

import { Section, Container, SectionHeader } from './parts';

const MOCK_DATA: SankeyData = {
  nodes: [
    { id: 'eth_deposits', name: 'ETH Deposits' },
    { id: 'usdc_transfers', name: 'USDC Transfers' },
    { id: 'usdt_transfers', name: 'USDT Transfers' },
    { id: 'bridge', name: 'Bridge' },
    { id: 'dex', name: 'DEX' },
    { id: 'lending', name: 'Lending' },
    { id: 'nft', name: 'NFT Marketplace' },
    { id: 'l2_settlement', name: 'L2 Settlement' },
    { id: 'staking', name: 'Staking' },
    { id: 'treasury', name: 'Treasury' },
  ],
  links: [
    { source: 'eth_deposits', target: 'bridge', value: 4200 },
    { source: 'eth_deposits', target: 'dex', value: 3100 },
    { source: 'eth_deposits', target: 'staking', value: 2800 },
    { source: 'usdc_transfers', target: 'dex', value: 5600 },
    { source: 'usdc_transfers', target: 'lending', value: 3400 },
    { source: 'usdt_transfers', target: 'dex', value: 2900 },
    { source: 'usdt_transfers', target: 'lending', value: 1800 },
    { source: 'bridge', target: 'l2_settlement', value: 3800 },
    { source: 'dex', target: 'treasury', value: 4500 },
    { source: 'dex', target: 'nft', value: 2100 },
    { source: 'lending', target: 'treasury', value: 3000 },
    { source: 'staking', target: 'treasury', value: 2800 },
  ],
};

const MOCK_DATA_SIMPLE: SankeyData = {
  nodes: [
    { id: 'source_a', name: 'Source A' },
    { id: 'source_b', name: 'Source B' },
    { id: 'target_x', name: 'Target X' },
    { id: 'target_y', name: 'Target Y' },
  ],
  links: [
    { source: 'source_a', target: 'target_x', value: 100 },
    { source: 'source_a', target: 'target_y', value: 50 },
    { source: 'source_b', target: 'target_x', value: 30 },
    { source: 'source_b', target: 'target_y', value: 80 },
  ],
};

const MOCK_DATA_ONE_TO_MANY: SankeyData = {
  nodes: [
    { id: 'total_supply', name: 'Total Supply' },
    { id: 'validators', name: 'Validators' },
    { id: 'defi', name: 'DeFi Protocols' },
    { id: 'bridges', name: 'Bridges' },
    { id: 'cex', name: 'CEX Wallets' },
    { id: 'dao', name: 'DAO Treasury' },
    { id: 'nft', name: 'NFT Contracts' },
    { id: 'dust', name: 'Dust Accounts' },
  ],
  links: [
    { source: 'total_supply', target: 'validators', value: 12500 },
    { source: 'total_supply', target: 'defi', value: 8400 },
    { source: 'total_supply', target: 'bridges', value: 6200 },
    { source: 'total_supply', target: 'cex', value: 5100 },
    { source: 'total_supply', target: 'dao', value: 3300 },
    { source: 'total_supply', target: 'nft', value: 1800 },
    { source: 'total_supply', target: 'dust', value: 700 },
  ],
};

const MOCK_DATA_MANY_TO_ONE: SankeyData = {
  nodes: [
    { id: 'eth_mainnet', name: 'Ethereum Mainnet' },
    { id: 'arbitrum', name: 'Arbitrum' },
    { id: 'optimism', name: 'Optimism' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'base', name: 'Base' },
    { id: 'zksync', name: 'zkSync' },
    { id: 'scroll', name: 'Scroll' },
    { id: 'pool', name: 'Liquidity Pool' },
  ],
  links: [
    { source: 'eth_mainnet', target: 'pool', value: 15000 },
    { source: 'arbitrum', target: 'pool', value: 8200 },
    { source: 'optimism', target: 'pool', value: 5400 },
    { source: 'polygon', target: 'pool', value: 4100 },
    { source: 'base', target: 'pool', value: 3600 },
    { source: 'zksync', target: 'pool', value: 2200 },
    { source: 'scroll', target: 'pool', value: 1500 },
  ],
};

const valueFormatter = (value: number) => `${ value.toLocaleString() } txns`;

const SankeyChartShowcase = () => {
  return (
    <Container value="sankey-chart">
      <Section>
        <SectionHeader>Default (blockchain flow)</SectionHeader>
        <Box h="400px" w="100%" borderWidth="1px" borderColor="border.divider" borderRadius="lg" p={ 4 }>
          <SankeyChart
            data={ MOCK_DATA }
            valueFormatter={ valueFormatter }
          />
        </Box>
      </Section>
      <Section>
        <SectionHeader>Simple (minimal data)</SectionHeader>
        <Box h="300px" w="100%" borderWidth="1px" borderColor="border.divider" borderRadius="lg" p={ 4 }>
          <SankeyChart
            data={ MOCK_DATA_SIMPLE }
          />
        </Box>
      </Section>
      <Section>
        <SectionHeader>One source, many targets (linkColorMode=&quot;target&quot;)</SectionHeader>
        <Box h="350px" w="100%" borderWidth="1px" borderColor="border.divider" borderRadius="lg" p={ 4 }>
          <SankeyChart
            data={ MOCK_DATA_ONE_TO_MANY }
            linkColorMode="target"
            valueFormatter={ valueFormatter }
          />
        </Box>
      </Section>
      <Section>
        <SectionHeader>Many sources, one target</SectionHeader>
        <Box h="350px" w="100%" borderWidth="1px" borderColor="border.divider" borderRadius="lg" p={ 4 }>
          <SankeyChart
            data={ MOCK_DATA_MANY_TO_ONE }
            valueFormatter={ valueFormatter }
          />
        </Box>
      </Section>
      <Section>
        <SectionHeader>Custom margins and node sizing</SectionHeader>
        <Box h="400px" w="100%" borderWidth="1px" borderColor="border.divider" borderRadius="lg" p={ 4 }>
          <SankeyChart
            data={ MOCK_DATA }
            margin={{ top: 16, right: 120, bottom: 16, left: 120 }}
            nodeWidth={ 12 }
            nodePadding={ 24 }
            valueFormatter={ valueFormatter }
          />
        </Box>
      </Section>
    </Container>
  );
};

export default React.memo(SankeyChartShowcase);
