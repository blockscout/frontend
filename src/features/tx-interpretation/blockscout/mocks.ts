import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';

import { withName, withoutName } from 'src/slices/address/mocks/address-param';
import { tokenInfo, tokenInfoERC20b } from 'src/slices/token/mocks/info';
import { toTokenModel } from 'src/slices/token/utils/model';

export const txInterpretation: TxInterpretationResponse = {
  data: {
    summaries: [ {
      summary_template: `{action_type} {amount} {token} to {to_address} on {timestamp}`,
      summary_template_variables: {
        action_type: { type: 'string', value: 'Transfer' },
        amount: { type: 'currency', value: '100' },
        token: {
          type: 'token',
          value: toTokenModel({
            name: 'Duck',
            type: 'ERC-20',
            symbol: 'DUCK',
            address_hash: '0x486a3c5f34cDc4EF133f248f1C81168D78da52e8',
            holders_count: '1152',
            decimals: '18',
            icon_url: null,
            total_supply: '210000000000000000000000000',
            exchange_rate: null,
            circulating_market_cap: null,
            reputation: 'ok',
          }),
        },
        to_address: {
          type: 'address',
          value: withoutName,
        },
        timestamp: {
          type: 'timestamp',
          value: '1687005431',
        },
      },
    } ],
  },
};

export const nativeCoinTransfer: TxInterpretationResponse = {
  data: {
    summaries: [ {
      summary_template: '{action_type} {amount} {native} to {to_address}',
      summary_template_variables: {
        action_type: { type: 'string', value: 'Transfer' },
        amount: { type: 'currency', value: '8.103469' },
        to_address: { type: 'address', value: withoutName },
      },
    } ],
  },
};

const namedInitiator = { ...withName, hash: '0xbd358966445e1089e3AdD528561719452fB78198' };

export const MARKET_ICON_URL = 'http://localhost:3000/market-icon.png';

export const swapOnMarket: TxInterpretationResponse = {
  data: {
    summaries: [ {
      summary_template: '{action_type} {outgoing_amount} {outgoing_token} for {incoming_amount} {incoming_token} on {market} by {initiator}',
      summary_template_variables: {
        action_type: { type: 'string', value: 'Swap' },
        outgoing_amount: { type: 'currency', value: '813.620948' },
        outgoing_token: { type: 'token', value: tokenInfo },
        incoming_amount: { type: 'currency', value: '0.036131' },
        incoming_token: { type: 'token', value: tokenInfoERC20b },
        market: { type: 'dexTag', value: { name: 'Uniswap V3', icon: MARKET_ICON_URL, url: 'https://app.uniswap.org' } },
        initiator: { type: 'address', value: namedInitiator },
      },
    } ],
  },
};

export const withdrawWithoutActionType: TxInterpretationResponse = {
  data: {
    summaries: [ {
      summary_template: '{initiator} Initiated Withdraw of {amount} {token}',
      summary_template_variables: {
        initiator: { type: 'address', value: namedInitiator },
        amount: { type: 'currency', value: '0.069465785129105613' },
        token: { type: 'token', value: tokenInfo },
      },
    } ],
  },
};
