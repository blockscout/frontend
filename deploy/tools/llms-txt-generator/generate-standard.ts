// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable max-len -- the long lines are the generated document's prose; wrapping them would change llms.txt */

import dedent from 'dedent';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';

const MCP_SERVER_URL = 'https://mcp.blockscout.com';

const chainName = config.chain.name ?? '';
const chainId = config.chain.id ?? '';
const coreApiUrl = config.apis.core ? config.apis.core.endpoint + config.apis.core.basePath : '';
const statsApiUrl = config.apis.stats ? config.apis.stats.endpoint + config.apis.stats.basePath : undefined;

const rollupFeature = config.features.rollup;
const parentChainUrl = rollupFeature.isEnabled ? rollupFeature.parentChain.baseUrl : undefined;
const currentToParentLayerLabel = layerLabels.current + '→' + layerLabels.parent;
const parentToCurrentLayerLabel = layerLabels.parent + '→' + layerLabels.current;

const validatorsFeature = config.features.validators;

function generalCountersSection(): string | undefined {
  return statsApiUrl ? `
        ### General Counters

        \`\`\`bash
        curl --request GET --url '${ statsApiUrl }/api/v1/counters'
        \`\`\`
    ` : '{blank}';
}

function userOpsSection(): string | undefined {
  return config.features.userOps.isEnabled ? `
        ### Account Abstraction info

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/proxy/account-abstraction/accounts/{account_address}'
        \`\`\`

        ### User Operations by Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/proxy/account-abstraction/operations?sender={account_address}'
        \`\`\`

        ### User Operations by Transaction

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/proxy/account-abstraction/operations?transaction_hash={transaction_hash}'
        \`\`\`

        ### User Operation Details

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/proxy/account-abstraction/operations/{user_operation_hash}'
        \`\`\`
    ` : '{blank}';
}

function beaconChainSection(): string | undefined {
  return config.features.beaconChain.isEnabled ? `
        ### Deposits by Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/addresses/{account_address}/beacon/deposits'
        \`\`\`

        ### Deposits by Block

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/blocks/{block_hash_or_number}/beacon/deposits'
        \`\`\`

        ### Withdrawals by Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/addresses/{account_address}/withdrawals'
        \`\`\`

        ### Withdrawals by Block

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/blocks/{block_number}/withdrawals'
        \`\`\`
    ` : undefined;
}

function arbitrumChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' ? `
        ### Latest Committed Batch Number

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/main-page/arbitrum/batches/latest-number'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/arbitrum/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/blocks/arbitrum-batch/{batch_number}'
        \`\`\`

        ### Get ${ parentToCurrentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/arbitrum/messages/to-rollup'
        \`\`\`

        ### Get ${ currentToParentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/arbitrum/messages/from-rollup'
        \`\`\`

        ### ${ currentToParentLayerLabel } messages by transaction:

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/arbitrum/messages/withdrawals/{transactions_hash}'
        \`\`\`
    ` : undefined;
}

function optimismChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'optimistic' ? `
        ### Latest Committed Batch Number (top of)

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/optimism/batches'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/optimism/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch (TODO: not needed if the batch returns blocks range)

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/blocks/optimism-batch/{batch_number}'
        \`\`\`

        ### Dispute Games

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/optimism/games'
        \`\`\`

        ### Get ${ parentToCurrentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/optimism/deposits'
        \`\`\`

        ### Get ${ currentToParentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/optimism/withdrawals'
        \`\`\`
    ` : undefined;
}

function celoChainSection(): string | undefined {
  return config.features.celo.isEnabled ? `
        ### Latest Finalized Epoch (top of)

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/celo/epochs'
        \`\`\`

        ### Get Epoch Information

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/celo/epochs/{epoch_number}'
        \`\`\`

        ### Validator Group Reward by Epoch

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/celo/epochs/{epoch_number}/election-rewards/group'
        \`\`\`

        ### Validator Rewards by Epoch

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/celo/epochs/{epoch_number}/election-rewards/validator'
        \`\`\`

        ### Voting Rewards by Epoch

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/celo/epochs/{epoch_number}/election-rewards/voter'
        \`\`\`
    ` : undefined;
}

function zksyncChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'zkSync' ? `
        ### Latest Committed Batch Number

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/main-page/zksync/batches/latest-number'
        \`\`\`

        ### Batch info

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/zksync/batches/{batch_number}'
        \`\`\`
    ` : undefined;
}

function tacChainSection(): string | undefined {
  return config.features.tac.isEnabled && config.apis.tac ? `
        ### TAC Operations:

        \`\`\`bash
        curl --request GET --url '${ config.apis.tac.endpoint }/api/v2/tac/operations'
        \`\`\`

        ### TAC Operation Info:

        \`\`\`bash
        curl --request GET --url '${ config.apis.tac.endpoint }/api/v2/tac/operations/{operation_id}'
        \`\`\`
    ` : undefined;
}

function scrollChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'scroll' ? `
        ### Latest Committed Batch Number (top of)

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/scroll/batches'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/scroll/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/blocks/scroll-batch/{batch_number}'
        \`\`\`

        ### Deposits (${ parentToCurrentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/scroll/deposits'
        \`\`\`

        ### Withdrawals (${ currentToParentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/scroll/withdrawals'
        \`\`\`
    ` : undefined;
}

function shibariumChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'shibarium' ? `
        ### Deposits (${ parentToCurrentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/shibarium/deposits'
        \`\`\`

        ### Withdrawals (${ currentToParentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/shibarium/withdrawals'
        \`\`\`
    ` : undefined;
}

function zilliqaChainSection(): string | undefined {
  return validatorsFeature.isEnabled && validatorsFeature.chainType === 'zilliqa' ? `
        ### Validators list:

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/validators/zilliqa'
        \`\`\`

        ### Validator Info:

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/validators/zilliqa/{validator_public_key}'
        \`\`\`
    ` : undefined;
}

function stabilityChainSection(): string | undefined {
  return validatorsFeature.isEnabled && validatorsFeature.chainType === 'stability' ? `
        ### Validators list:

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/validators/stability'
        \`\`\`
    ` : undefined;
}

function chainSpecificSection(): string {
  const sections = [
    beaconChainSection(),
    arbitrumChainSection(),
    optimismChainSection(),
    celoChainSection(),
    zksyncChainSection(),
    tacChainSection(),
    scrollChainSection(),
    zilliqaChainSection(),
    stabilityChainSection(),
    shibariumChainSection(),
  ].filter(Boolean);

  return sections.length > 0 ? `
        ## Chain-Specific Data
        ${ sections.join('\n') }
    ` : '{blank}';
}

export function generateStandard(): string {
  return dedent`
        # Blockscout - ${ chainName }

        Blockscout is a human-friendly blockchain explorer for EVM-compatible networks. It lets users browse blocks, transactions, addresses, tokens (ERC-20/721/1155), logs, contract ABIs, and decoded contract interactions. While the site is primarily designed for people, all rendered information is backed by API endpoints that machines can consume. Large Language Models should prefer the LLM-ready endpoints listed below to retrieve precise, structured data.

        Chain name: ${ chainName }
        Chain ID: ${ chainId }
        ${ parentChainUrl ? `Settlement layer Blockscout URL: ${ parentChainUrl }` : '{blank}' }

        ## General LLM-ready Data

        The links below lead to the REST API of the Blockscout MCP server, they are considered as LLM-ready. More detail: https://github.com/blockscout/mcp-server/blob/main/API.md

        ### Specific Block Info

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_block_info?chain_id=${ chainId }&number_or_hash={block_number_or_hash}&include_transactions=false'
        \`\`\`

        ### Specific Transaction Info

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_transaction_info?chain_id=${ chainId }&transaction_hash={transaction_hash}'
        \`\`\`

        ### Get Transaction Logs

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_transaction_logs?chain_id=${ chainId }&transaction_hash={transaction_hash}'
        \`\`\`

        ### Transaction Summary

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/transaction_summary?chain_id=${ chainId }&transaction_hash={transaction_hash}'
        \`\`\`

        ### Specific Account info

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_address_info?chain_id=${ chainId }&address={account_address}'
        \`\`\`

        ### Get Address by ENS name

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_address_by_ens_name?name={ens_name}'
        \`\`\`

        ### Get Transactions By Address

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_transactions_by_address?chain_id=${ chainId }&address={account_address}&age_from={YYYY-MM-DDTHH:MM:SS.00Z}&age_to={YYYY-MM-DDTHH:MM:SS.00Z}&methods={4_bytes_method_signature_optional}'
        \`\`\`

        ### Get Token Transfers by Address

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_token_transfers_by_address?chain_id=${ chainId }&address={account_address}&age_from={YYYY-MM-DDTHH:MM:SS.00Z}&age_to={YYYY-MM-DDTHH:MM:SS.00Z}&token={token_contract_address_optional}'
        \`\`\`

        ### Get ERC20 Tokens By Address

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_tokens_by_address?chain_id=${ chainId }&address={account_address}'
        \`\`\`

        ### Get NFT Tokens By Address

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/nft_tokens_by_address?chain_id=${ chainId }&address={account_address}'
        \`\`\`

        ### Lookup Token By Symbol

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/lookup_token_by_symbol?chain_id=${ chainId }&symbol={token_symbol}'
        \`\`\`

        ### Get Contract ABI

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/get_contract_abi?chain_id=${ chainId }&address={contract_address}'
        \`\`\`

        ### Read Contract Data

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/read_contract?chain_id=${ chainId }&address={contract_address}&abi={string_encoded_function_abi}&function_name={function_name}&args={string_encoded_arguments_list}'
        \`\`\`

        ### Get Source Files Tree of Verified Contract

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/inspect_contract_code?chain_id=${ chainId }&address={contract_address}'
        \`\`\`

        ### Inspect Specific Source File of Verified Contract

        \`\`\`bash
        curl --request GET --url '${ MCP_SERVER_URL }/v1/inspect_contract_code?chain_id=${ chainId }&address={contract_address}&file_name={file_name}'
        \`\`\`

        ## Miscellaneous Blockchain Data

        ${ generalCountersSection() }
        ### Gas Tracker

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/stats'
        \`\`\`

        ### Coin Balance History by Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/addresses/{account_address}/coin-balance-history-by-day'
        curl --request GET --url '${ coreApiUrl }/api/v2/addresses/{account_address}/coin-balance-history'
        \`\`\`

        ### Logs Emitted by Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/addresses/{account_address}/logs'
        \`\`\`

        ### Blocks Validated by Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/addresses/{account_address}/blocks-validated'
        \`\`\`
        ${ userOpsSection() }
        ### Holders By Token Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/tokens/{token_contract_address}/holders'
        \`\`\`

        ### NFT Inventory By Token Address

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/tokens/{token_contract_address}/instances'
        \`\`\`

        ### NFT Instance Info

        \`\`\`bash
        curl --request GET --url '${ coreApiUrl }/api/v2/tokens/{token_contract_address}/instances/{instance_id}'
        curl --request GET --url '${ coreApiUrl }/api/v2/tokens/{token_contract_address}/instances/{instance_id}/transfers'
        \`\`\`
        ${ chainSpecificSection() }
        ## Additional Info

        **Recommendation**: For programmatic access and LLM workflows, prefer the MCP Server endpoints (HTTP, not SSE).

        - MCP landing: [${ MCP_SERVER_URL }](${ MCP_SERVER_URL })
        - MCP server root: [${ MCP_SERVER_URL }/mcp/](${ MCP_SERVER_URL }/mcp/)

        ### Other Blockscout instances (lookup by chain id or name):

        \`\`\`bash
        curl --request GET --url 'https://chains.blockscout.com/api/chains'
        \`\`\`
    `.replaceAll('{blank}\n', '');
}
