// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';

import addressToPlainText from 'src/features/tx-interpretation/common/utils/address-to-plain-text';
import summaryToPlainText from 'src/features/tx-interpretation/common/utils/summary-to-plain-text';

import config from 'src/config';
import dayjs from 'src/shared/date-and-time/dayjs';

// Already `MMM D, YYYY H:mm` through the locale overrides in the dayjs module.
const TIMESTAMP_FORMAT = 'lll';

export interface TxOgDescriptionParams {
  tx_status: string;
  tx_action: string;
  tx_timestamp: string;
}

// `undefined` — as opposed to `null`, which is a pending transaction — means the field never arrived, so
// there is no status to show. `fetchApi` hands back non-200 bodies as data, and this is what keeps a 404
// from reading as `Pending`.
function getStatusText(status: schemas['Transaction']['status'] | undefined) {
  if (status === undefined) {
    return;
  }

  switch (status) {
    case 'ok':
      return 'Success';
    case 'error':
      return 'Failed';
    case null:
      return 'Pending';
  }
}

function getActionText(tx: schemas['TransactionResponse'] | undefined, interpretation: TxInterpretationResponse | undefined) {
  if (!config.features.txInterpretation.isEnabled) {
    return;
  }

  const summary = interpretation?.data?.summaries?.[0];
  const summaryText = summary ? summaryToPlainText(summary) : undefined;

  if (summaryText) {
    return summaryText;
  }

  if (!tx?.method || !tx.from || !tx.to) {
    return;
  }

  const verb = tx.status === 'error' ? 'failed to call' : 'called';

  return `${ addressToPlainText(tx.from) } ${ verb } ${ tx.method } on ${ addressToPlainText(tx.to) }`;
}

// All or nothing: the OG description template needs every placeholder, and `undefined` members cannot be
// serialized into the page props anyway.
export default function getOgDescriptionParams(
  tx: schemas['TransactionResponse'] | undefined,
  interpretation: TxInterpretationResponse | undefined,
): TxOgDescriptionParams | null {
  const status = getStatusText(tx?.status);
  const action = getActionText(tx, interpretation);
  const timestamp = tx?.timestamp ? dayjs(tx.timestamp).utc().format(TIMESTAMP_FORMAT) + ' UTC' : undefined;

  if (!status || !action || !timestamp) {
    return null;
  }

  return {
    tx_status: status,
    tx_action: action,
    tx_timestamp: timestamp,
  };
}
