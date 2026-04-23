import { createListCollection } from '@chakra-ui/react';

import type { CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSortingValue } from '../types/api';
import * as interchainIndexer from '@blockscout/interchain-indexer-types';

import type { SelectOption } from 'toolkit/chakra/select';

export const BRIDGED_TOKENS_SORT_SEQUENCE: Record<CrossChainBridgedTokensSortingField, Array<CrossChainBridgedTokensSortingValue>> = {
  [interchainIndexer.BridgedTokensSort.TOTAL_TRANSFERS_COUNT]: [ 'TOTAL_TRANSFERS_COUNT-DESC', 'TOTAL_TRANSFERS_COUNT-ASC', 'default' ],
  [interchainIndexer.BridgedTokensSort.OUTPUT_TRANSFERS_COUNT]: [ 'OUTPUT_TRANSFERS_COUNT-DESC', 'OUTPUT_TRANSFERS_COUNT-ASC', 'default' ],
  [interchainIndexer.BridgedTokensSort.INPUT_TRANSFERS_COUNT]: [ 'INPUT_TRANSFERS_COUNT-DESC', 'INPUT_TRANSFERS_COUNT-ASC', 'default' ],
  [interchainIndexer.BridgedTokensSort.NAME]: [ 'NAME-DESC', 'NAME-ASC', 'default' ],
};

export const BRIDGED_TOKENS_SORT_OPTIONS: Array<SelectOption<CrossChainBridgedTokensSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Total transfers count descending', value: 'TOTAL_TRANSFERS_COUNT-DESC' },
  { label: 'Total transfers count ascending', value: 'TOTAL_TRANSFERS_COUNT-ASC' },
  { label: 'Output transfers count descending', value: 'OUTPUT_TRANSFERS_COUNT-DESC' },
  { label: 'Output transfers count ascending', value: 'OUTPUT_TRANSFERS_COUNT-ASC' },
  { label: 'Input transfers count descending', value: 'INPUT_TRANSFERS_COUNT-DESC' },
  { label: 'Input transfers count ascending', value: 'INPUT_TRANSFERS_COUNT-ASC' },
  { label: 'Name descending', value: 'NAME-DESC' },
  { label: 'Name ascending', value: 'NAME-ASC' },
];

export const BRIDGED_TOKENS_SORT_COLLECTION = createListCollection({
  items: BRIDGED_TOKENS_SORT_OPTIONS,
});
