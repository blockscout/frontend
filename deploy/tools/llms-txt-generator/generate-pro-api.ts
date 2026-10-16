// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable max-len -- the long lines are the generated document's prose; wrapping them would change llms.txt */

import dedent from 'dedent';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';

const PRO_API_URL = 'https://api.blockscout.com';

const chainName = config.chain.name ?? '';
const chainId = config.chain.id ?? '';

const rollupFeature = config.features.rollup;
const parentChainUrl = rollupFeature.isEnabled ? rollupFeature.parentChain.baseUrl : undefined;
const currentToParentLayerLabel = layerLabels.current + '→' + layerLabels.parent;
const parentToCurrentLayerLabel = layerLabels.parent + '→' + layerLabels.current;

const validatorsFeature = config.features.validators;

function generalCountersSection(): string | undefined {
  return chainId ? `
        ### General Counters

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/stats-service/api/v1/counters'
        \`\`\`
    ` : '{blank}';
}

function userOpsSection(): string | undefined {
  return config.features.userOps.isEnabled ? `
        ### Account Abstraction info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/proxy/account-abstraction/accounts/{account_address}'
        \`\`\`

        ### User Operations by Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/proxy/account-abstraction/operations?sender={account_address}'
        \`\`\`

        ### User Operations by Transaction

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/proxy/account-abstraction/operations?transaction_hash={transaction_hash}'
        \`\`\`

        ### User Operation Details

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/proxy/account-abstraction/operations/{user_operation_hash}'
        \`\`\`
    ` : '{blank}';
}

function beaconChainSection(): string | undefined {
  return config.features.beaconChain.isEnabled ? `
        ### Deposits by Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/beacon/deposits'
        \`\`\`

        ### Deposits by Block

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/blocks/{block_hash_or_number}/beacon/deposits'
        \`\`\`

        ### Withdrawals by Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/withdrawals'
        \`\`\`

        ### Withdrawals by Block

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/blocks/{block_hash_or_number}/withdrawals'
        \`\`\`
    ` : undefined;
}

function arbitrumChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' ? `
        ### Latest Committed Batch Number

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/main-page/arbitrum/batches/latest-number'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/arbitrum/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/blocks/arbitrum-batch/{batch_number}'
        \`\`\`

        ### Get ${ parentToCurrentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/arbitrum/messages/to-rollup'
        \`\`\`

        ### Get ${ currentToParentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/arbitrum/messages/from-rollup'
        \`\`\`

        ### ${ currentToParentLayerLabel } messages by transaction:

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/arbitrum/messages/withdrawals/{transactions_hash}'
        \`\`\`
    ` : undefined;
}

function optimismChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'optimistic' ? `
        ### Latest Committed Batch Number (top of)

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/optimism/batches'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/optimism/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch (TODO: not needed if the batch returns blocks range)

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/blocks/optimism-batch/{batch_number}'
        \`\`\`

        ### Dispute Games

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/optimism/games'
        \`\`\`

        ### Get ${ parentToCurrentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/optimism/deposits'
        \`\`\`

        ### Get ${ currentToParentLayerLabel } messages

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/optimism/withdrawals'
        \`\`\`
    ` : undefined;
}

function celoChainSection(): string | undefined {
  return config.features.celo.isEnabled ? `
        ### Latest Finalized Epoch (top of)

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/celo/epochs'
        \`\`\`

        ### Get Epoch Information

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/celo/epochs/{epoch_number}'
        \`\`\`

        ### Validator Group Reward by Epoch

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/celo/epochs/{epoch_number}/election-rewards/group'
        \`\`\`

        ### Validator Rewards by Epoch

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/celo/epochs/{epoch_number}/election-rewards/validator'
        \`\`\`

        ### Voting Rewards by Epoch

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/celo/epochs/{epoch_number}/election-rewards/voter'
        \`\`\`
    ` : undefined;
}

function zksyncChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'zkSync' ? `
        ### Latest Committed Batch Number

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/main-page/zksync/batches/latest-number'
        \`\`\`

        ### Batch info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/zksync/batches/{batch_number}'
        \`\`\`
    ` : undefined;
}

function tacChainSection(): string | undefined {
  return config.features.tac.isEnabled && config.apis.tac ? `
        > **Note:** TAC operations endpoints below are served by a separate microservice and are **not** part of the Blockscout PRO API. The \`Authorization: Bearer {api_key}\` requirement stated in the introduction does not apply here.

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
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/scroll/batches'
        \`\`\`

        ### Batch Info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/scroll/batches/{batch_number}'
        \`\`\`

        ### Blocks By Batch

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/blocks/scroll-batch/{batch_number}'
        \`\`\`

        ### Deposits (${ parentToCurrentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/scroll/deposits'
        \`\`\`

        ### Withdrawals (${ currentToParentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/scroll/withdrawals'
        \`\`\`
    ` : undefined;
}

function shibariumChainSection(): string | undefined {
  return rollupFeature.isEnabled && rollupFeature.type === 'shibarium' ? `
        ### Deposits (${ parentToCurrentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/shibarium/deposits'
        \`\`\`

        ### Withdrawals (${ currentToParentLayerLabel })

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/shibarium/withdrawals'
        \`\`\`
    ` : undefined;
}

function zilliqaChainSection(): string | undefined {
  return validatorsFeature.isEnabled && validatorsFeature.chainType === 'zilliqa' ? `
        ### Validators list:

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/validators/zilliqa'
        \`\`\`

        ### Validator Info:

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/validators/zilliqa/{validator_public_key}'
        \`\`\`
    ` : undefined;
}

function stabilityChainSection(): string | undefined {
  return validatorsFeature.isEnabled && validatorsFeature.chainType === 'stability' ? `
        ### Validators list:

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/validators/stability'
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

export function generateProApi(): string {
  // Shibarium endpoints are not yet listed in the PRO API index (tracked in blockscout/blockscout#14322); the indexer exposes them and the OpenAPI listing is forthcoming.
  // Stability validators endpoint is not yet listed in the PRO API index (tracked in blockscout/blockscout#14323); the indexer exposes it and the OpenAPI listing is forthcoming.
  return dedent`
        # Blockscout - ${ chainName }

        Blockscout is a human-friendly blockchain explorer for EVM-compatible networks. It lets users browse blocks, transactions, addresses, tokens (ERC-20/721/1155), logs, contract ABIs, and decoded contract interactions. While the site is primarily designed for people, all rendered information is backed by API endpoints that machines can consume.

        All endpoint examples below target the **Blockscout PRO API** at \`${ PRO_API_URL }\` — a single HTTP API spanning 100+ EVM chains. Every request requires the header \`Authorization: Bearer {api_key}\`; for brevity it is omitted from the individual \`curl\` examples and must be added by the caller. Generate an API key at the Blockscout developer portal: \`https://dev.blockscout.com\` (free tier, no credit card required). For the full set of conventions (additional headers, response shape, pagination, plan limits) consult the public \`web3-dev\` agent skill linked from the "Additional Info" section at the bottom of this document.

        Chain name: ${ chainName }
        Chain ID: ${ chainId }
        ${ parentChainUrl ? `Settlement layer Blockscout URL: ${ parentChainUrl }` : '{blank}' }

        ## General Blockchain Data

        ### Specific Block Info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/blocks/{block_hash_or_number}'
        \`\`\`

        ### Specific Transaction Info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/transactions/{transaction_hash}'
        \`\`\`

        ### Get Transaction Logs

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/transactions/{transaction_hash}/logs'
        \`\`\`

        ### Transaction Summary

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/transactions/{transaction_hash}/summary'
        \`\`\`

        ### Specific Account Info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}'
        \`\`\`

        ### Get Address by ENS Name

        Cross-chain ENS resolution is served by the multichain aggregator service; the path intentionally has no \`{chain_id}\` segment.

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/services/multichain/api/v1/search:quick?q={ens_name}'
        \`\`\`

        ### Get Transactions By Address

        Use the \`advanced-filters\` endpoint with \`address_relation=or\` to match the address on either side of a transaction.

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/advanced-filters?from_address_hashes_to_include={account_address}&to_address_hashes_to_include={account_address}&address_relation=or&transaction_types=COIN_TRANSFER,CONTRACT_INTERACTION,CONTRACT_CREATION&age_from={YYYY-MM-DDTHH:MM:SSZ}&age_to={YYYY-MM-DDTHH:MM:SSZ}&methods={comma_separated_4byte_selectors_optional}'
        \`\`\`

        ### Get Token Transfers by Address

        Use the \`advanced-filters\` endpoint with token-flavoured \`transaction_types\` and \`address_relation=or\`.

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/advanced-filters?from_address_hashes_to_include={account_address}&to_address_hashes_to_include={account_address}&address_relation=or&transaction_types=ERC-20,ERC-721,ERC-1155&age_from={YYYY-MM-DDTHH:MM:SSZ}&age_to={YYYY-MM-DDTHH:MM:SSZ}&token_contract_address_hashes_to_include={token_contract_address_optional}'
        \`\`\`

        ### Get ERC20 Tokens By Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/tokens'
        \`\`\`

        ### Get NFT Tokens By Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/nft'
        \`\`\`

        ### Lookup Token By Symbol

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/search/quick?q={token_symbol}'
        \`\`\`

        ### Get Contract ABI

        The verified-contract response includes the ABI as a field; no separate ABI-only endpoint is needed.

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/smart-contracts/{contract_address}'
        \`\`\`

        ### Read Contract Data

        Read calls go through the JSON-RPC gateway as \`eth_call\`. This is the only example in this document that uses \`POST\`.

        \`\`\`bash
        curl --request POST --url '${ PRO_API_URL }/${ chainId }/json-rpc' --header 'Content-Type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"to":"{contract_address}","data":"{encoded_calldata}"},"latest"]}'
        \`\`\`

        ### Inspect Source Tree of Verified Contract

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/smart-contracts/{contract_address}'
        \`\`\`

        ## Miscellaneous Blockchain Data

        ${ generalCountersSection() }
        ### Gas Tracker

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/stats'
        \`\`\`

        ### Coin Balance History by Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/coin-balance-history-by-day'
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/coin-balance-history'
        \`\`\`

        ### Logs Emitted by Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/logs'
        \`\`\`

        ### Blocks Validated by Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/addresses/{account_address}/blocks-validated'
        \`\`\`
        ${ userOpsSection() }
        ### Holders By Token Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/tokens/{token_contract_address}/holders'
        \`\`\`

        ### NFT Inventory By Token Address

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/tokens/{token_contract_address}/instances'
        \`\`\`

        ### NFT Instance Info

        \`\`\`bash
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/tokens/{token_contract_address}/instances/{instance_id}'
        curl --request GET --url '${ PRO_API_URL }/${ chainId }/api/v2/tokens/{token_contract_address}/instances/{instance_id}/transfers'
        \`\`\`
        ${ chainSpecificSection() }
        ## Additional Info

        ### Blockscout PRO API — deterministic workflow construction

        The Blockscout PRO API is the recommended surface for building repeatable services, tools, and automations on top of indexed blockchain data. A single HTTP API spans 100+ EVM chains; one Bearer token authenticates every call.

        - Generate an API key at the Blockscout developer portal: https://dev.blockscout.com (free tier, no credit card).
        - For AI agents, install the \`web3-dev\` skill — it encodes the conventions, headers, pagination, and pre-flight checks needed to call the PRO API correctly. Installation instructions: https://raw.githubusercontent.com/blockscout/agent-skills/refs/heads/main/README.md

        ### Blockscout MCP server — ad-hoc agent interaction

        The Blockscout MCP server is for open-ended, exploratory interaction with chains: ask, inspect, follow clues, explain findings. Use it when an agent needs to reason over data on the fly rather than encode a fixed workflow.

        - MCP endpoint: https://mcp.blockscout.com/mcp/
        - For AI agents, install the \`blockscout-analysis\` skill — it provides the architectural rules, REST API conventions for scripts, endpoint reference files, and response-transformation guidance the MCP surface assumes. Installation instructions: https://raw.githubusercontent.com/blockscout/agent-skills/refs/heads/main/README.md

        ### Other Blockscout instances (chain registry)

        Look up other Blockscout instances by chain id or name:

        \`\`\`bash
        curl --request GET --url 'https://chains.blockscout.com/api/chains'
        \`\`\`
    `.replaceAll('{blank}\n', '');
}
