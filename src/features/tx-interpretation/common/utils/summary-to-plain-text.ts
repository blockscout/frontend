// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TxInterpretationSummary, TxInterpretationVariable } from 'src/features/tx-interpretation/common/types/api';

import { currencyUnits } from 'src/slices/chain/units';

import dayjs from 'src/shared/date-and-time/dayjs';

import { SECOND } from 'src/toolkit/utils/consts';

import addressToPlainText from './address-to-plain-text';
import formatCurrencyValue from './format-currency-value';
import {
  extractVariables,
  getStringChunks,
  fillStringVariables,
  checkSummary,
  NATIVE_COIN_SYMBOL_VAR_NAME,
  WEI_VAR_NAME,
} from './utils';

const UNNAMED_TOKEN = 'Unnamed token';
// The format `TxInterpretation` uses for a timestamp variable, which is not the OG description's own
// timestamp format.
const TIMESTAMP_FORMAT = 'MMM DD YYYY';

const WHITESPACE_RUN_REGEX = /\s+/g;

function variableToPlainText(variable: TxInterpretationVariable | undefined): string {
  if (!variable) {
    return '';
  }

  const { type, value } = variable;

  switch (type) {
    case 'string':
    case 'domain':
    case 'method':
      return value;
    case 'currency':
      return formatCurrencyValue(value);
    case 'token':
      return value.symbol ?? value.name ?? UNNAMED_TOKEN;
    case 'address':
      return addressToPlainText(value);
    case 'dexTag':
    case 'link':
    case 'external_link':
      return value.name;
    case 'timestamp':
      return dayjs(Number(value) * SECOND).format(TIMESTAMP_FORMAT);
  }
}

// Renders what `TxInterpretation` renders, as a single line of text.
export default function summaryToPlainText(summary: TxInterpretationSummary) {
  const template = summary.summary_template;
  const variables = summary.summary_template_variables;

  if (!checkSummary(template, variables)) {
    return;
  }

  const intermediateResult = fillStringVariables(template, variables);
  const variablesNames = extractVariables(intermediateResult);
  const chunks = getStringChunks(intermediateResult);

  return chunks
    .flatMap((chunk, index) => {
      const name = variablesNames[index];
      const variableText = (() => {
        switch (name) {
          case undefined:
            return '';
          case NATIVE_COIN_SYMBOL_VAR_NAME:
            return currencyUnits.ether;
          case WEI_VAR_NAME:
            return currencyUnits.wei;
          default:
            return variableToPlainText(variables[name]);
        }
      })();

      return [ chunk.trim(), variableText ];
    })
    .filter(Boolean)
    .join(' ')
    .replaceAll(WHITESPACE_RUN_REGEX, ' ')
    .trim();
}
