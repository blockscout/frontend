import type { paths } from '@blockscout/api-types';

type IndexingStatus = paths['/api/v2/main-page/indexing-status']['get'];

export const blocksInProgress: IndexingStatus = {
  finished_indexing_blocks: false,
  indexed_blocks_ratio: 0.1,
  finished_indexing: true,
  indexed_internal_transactions_ratio: 1,
};

export const inProgress: IndexingStatus = {
  finished_indexing_blocks: false,
  indexed_blocks_ratio: 0.1,
  finished_indexing: false,
  indexed_internal_transactions_ratio: 0.1,
};

export const finished: IndexingStatus = {
  finished_indexing_blocks: true,
  indexed_blocks_ratio: 1,
  finished_indexing: true,
  indexed_internal_transactions_ratio: 1,
};
