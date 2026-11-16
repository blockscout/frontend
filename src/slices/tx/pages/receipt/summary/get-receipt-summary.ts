// SPDX-License-Identifier: LicenseRef-Blockscout

import { mapValues } from 'es-toolkit';

import type { ReceiptSummary, SentenceSummary, TransferAsset, TransferSummary } from './types';
import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationSummary, TxInterpretationVariable } from 'src/features/tx-interpretation/common/types/api';

import { extractVariables, NATIVE_COIN_SYMBOL_VAR_NAME, parseSummaryTemplate } from 'src/features/tx-interpretation/common/utils/utils';

import type { FallbackSummaryTx } from './get-fallback-summary';
import { getFallbackSummary } from './get-fallback-summary';

const TRANSFER_ACTION_TYPE = 'Transfer';
const LEADING_ACTION_TYPE_REGEXP = /^\s*\{action_type\}\s*/;

const getActionType = ({ summary_template_variables: variables }: TxInterpretationSummary): string | null => {
  const variable = variables.action_type;
  return variable?.type === 'string' ? variable.value : null;
};

const getTransferAsset = ({ summary_template: template, summary_template_variables: variables }: TxInterpretationSummary): TransferAsset | null => {
  if (variables.token?.type === 'token') {
    return { type: 'token', token: variables.token.value };
  }

  if (extractVariables(template).includes(NATIVE_COIN_SYMBOL_VAR_NAME)) {
    return { type: 'native' };
  }

  return null;
};

const getTransferSummary = (summary: TxInterpretationSummary, sender: schemas['Address']): TransferSummary | null => {
  const { amount, to_address: recipient } = summary.summary_template_variables;
  const asset = getTransferAsset(summary);

  if (getActionType(summary) !== TRANSFER_ACTION_TYPE || amount?.type !== 'currency' || !amount.value || !asset) {
    return null;
  }

  return {
    type: 'transfer',
    amount: amount.value,
    asset,
    from: sender,
    to: recipient?.type === 'address' ? recipient.value : null,
  };
};

// the transaction's own parties carry the names, tags and domains the interpretation leaves out
const withTxParties = (variables: Record<string, TxInterpretationVariable>, tx: FallbackSummaryTx): Record<string, TxInterpretationVariable> => {
  const parties = [ tx.from, tx.to, tx.created_contract ].filter((address): address is schemas['Address'] => Boolean(address));

  return mapValues(variables, (variable): TxInterpretationVariable => {
    if (variable.type !== 'address') {
      return variable;
    }

    const party = parties.find((address) => address.hash.toLowerCase() === variable.value.hash.toLowerCase());
    return party ? { type: 'address', value: party } : variable;
  });
};

const getSentenceSummary = (summary: TxInterpretationSummary, tx: FallbackSummaryTx): SentenceSummary | null => {
  const actionType = getActionType(summary);
  const hasLeadingActionType = Boolean(actionType) && LEADING_ACTION_TYPE_REGEXP.test(summary.summary_template);
  const template = parseSummaryTemplate(hasLeadingActionType ?
    { ...summary, summary_template: summary.summary_template.replace(LEADING_ACTION_TYPE_REGEXP, '') } :
    summary,
  );

  if (!template) {
    return null;
  }

  return {
    type: 'sentence',
    actionType: hasLeadingActionType ? actionType : null,
    template,
    variables: withTxParties(summary.summary_template_variables, tx),
    from: tx.from,
    to: tx.to ?? tx.created_contract,
    connector: !tx.to && tx.created_contract ? 'created' : 'interacted with',
  };
};

export const getReceiptSummary = (
  tx: FallbackSummaryTx,
  interpretations: ReadonlyArray<TxInterpretationSummary> | undefined,
  nativeCoinDecimals: number,
): ReceiptSummary => {
  const interpretation = interpretations?.[0];
  const interpretationSummary = interpretation && (getTransferSummary(interpretation, tx.from) ?? getSentenceSummary(interpretation, tx));

  return interpretationSummary || getFallbackSummary(tx, nativeCoinDecimals);
};
