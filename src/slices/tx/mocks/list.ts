import type { schemas } from '@blockscout/api-types';

import * as detailsMock from './details';

export const base: schemas['Transaction'] = {
  ...detailsMock.base,
  op_interop_messages: undefined,
};

export const pending: schemas['Transaction'] = {
  ...detailsMock.pending,
  op_interop_messages: undefined,
};

export const base2: schemas['Transaction'] = {
  ...detailsMock.base,
  op_interop_messages: undefined,
};

export const base3: schemas['Transaction'] = {
  ...detailsMock.base,
  op_interop_messages: undefined,
};

export const base4: schemas['Transaction'] = {
  ...detailsMock.base,
  op_interop_messages: undefined,
};

export const withProtocolTag: schemas['Transaction'] = {
  ...detailsMock.withProtocolTag,
  op_interop_messages: undefined,
};

export const withContractCreation: schemas['Transaction'] = {
  ...detailsMock.withContractCreation,
  op_interop_messages: undefined,
};

export const withTokenTransfer: schemas['Transaction'] = {
  ...detailsMock.withTokenTransfer,
  op_interop_messages: undefined,
};

export const withWatchListNames: schemas['Transaction'] = {
  ...detailsMock.withWatchListNames,
  op_interop_messages: undefined,
};

export const withPendingUpdate: schemas['Transaction'] = {
  ...detailsMock.withPendingUpdate,
  op_interop_messages: undefined,
};
