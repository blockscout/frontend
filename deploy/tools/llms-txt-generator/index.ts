import config from 'configs/app';
import { writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const outputDir = resolvePath(currentDir, '../../../../public');
const outputFile = resolvePath(outputDir, 'llms.txt');

function run() {
    try {
        console.log('🌀 Generating llms.txt...');
            
        const chainName = config.chain.name ?? '';
        const chainId = config.chain.id ?? '';
        const generalApiUrl = config.apis.general.endpoint + config.apis.general.basePath;
        const statsApiUrl = config.apis.stats ? config.apis.stats.endpoint + config.apis.stats.basePath : undefined;

        const rollupFeature = config.features.rollup;
        const parentChainUrl = rollupFeature.isEnabled ? rollupFeature.parentChain.baseUrl : undefined;

        const GENERAL_COUNTERS_TEMPLATE = statsApiUrl ? `### General Counters

\`\`\`bash
curl --request GET --url '${statsApiUrl}/api/v1/counters'
\`\`\`` : '{blank}';

        const USER_OPS_TEMPLATE = config.features.userOps.isEnabled ? `<!-- START:Account-Abstraction -->
### Account Abstraction info

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/proxy/account-abstraction/accounts/{account_address}'
\`\`\`

### User Operations by Address

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/proxy/account-abstraction/operations?sender={account_address}'
\`\`\`

### User Operations by Transaction

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/proxy/account-abstraction/operations?transaction_hash={transaction_hash}'
\`\`\`

### User Operation Details

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/proxy/account-abstraction/operations/{user_operation_hash}'
\`\`\`
<!-- END:Account-Abstraction -->` : '{blank}';

        const MAIN_TEMPLATE = `# Blockscout - ${ chainName }
    
<!-- START:Blockscout-Common-Intro -->
Blockscout is a human-friendly blockchain explorer for EVM-compatible networks. It lets users browse blocks, transactions, addresses, tokens (ERC-20/721/1155), logs, contract ABIs, and decoded contract interactions. While the site is primarily designed for people, all rendered information is backed by API endpoints that machines can consume. Large Language Models should prefer the LLM-ready endpoints listed below to retrieve precise, structured data.
<!-- END:Blockscout-Common-Intro -->

<!-- START:Blockscout-Instance-Info -->
Chain name: ${ chainName }
Chain ID: ${ chainId }
${ parentChainUrl ? `Settlement layer Blockscout URL: ${ parentChainUrl }` : '{blank}' }
<!-- END:Blockscout-Instance-Info -->

<!-- START:General-LLM-Ready-Blockchain-Data -->
## General LLM-ready Data

The links below lead to the REST API of the Blockscout MCP server, they are considered as LLM-ready. More detail: https://github.com/blockscout/mcp-server/blob/main/API.md

<!-- START:General-Data-Blocks -->
### Specific Block Info

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_block_info?chain_id=${ chainId }&number_or_hash={block_number_or_hash}&include_transactions=false'
\`\`\`
<!-- END:General-Data-Blocks -->

<!-- START:General-Data-Transactions -->
### Specific Transaction Info

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_transaction_info?chain_id=${ chainId }&transaction_hash={transaction_hash}'
\`\`\`

### Get Transaction Logs

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_transaction_logs?chain_id=${ chainId }&transaction_hash={transaction_hash}'
\`\`\`

### Transaction Summary

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/transaction_summary?chain_id=${ chainId }&transaction_hash={transaction_hash}'
\`\`\`
<!-- END:General-Data-Transactions -->

<!-- START:General-Data-Addresses -->
### Specific Account info

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_address_info?chain_id=${ chainId }&address={account_address}'
\`\`\`

### Get Address by ENS name

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_address_by_ens_name?name={ens_name}'
\`\`\`

### Get Transactions By Address

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_transactions_by_address?chain_id=${ chainId }&address={account_address}&age_from={YYYY-MM-DDTHH:MM:SS.00Z}&age_to={YYYY-MM-DDTHH:MM:SS.00Z}&methods={4_bytes_method_signature_optional}'
\`\`\`

### Get Token Transfers by Address

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_token_transfers_by_address?chain_id=${ chainId }&address={account_address}&age_from={YYYY-MM-DDTHH:MM:SS.00Z}&age_to={YYYY-MM-DDTHH:MM:SS.00Z}&token={token_contract_address_optional}'
\`\`\`
<!-- END:General-Data-Addresses -->

<!-- START:General-Data-Tokens -->
### Get ERC20 Tokens By Address

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_tokens_by_address?chain_id=${ chainId }&address={account_address}'
\`\`\`

### Get NFT Tokens By Address

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/nft_tokens_by_address?chain_id=${ chainId }&address={account_address}'
\`\`\`

### Lookup Token By Symbol

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/lookup_token_by_symbol?chain_id=${ chainId }&symbol={token_symbol}'
\`\`\`
<!-- END:General-Data-Tokens -->

<!-- START:General-Data-Contracts -->
### Get Contract ABI

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/get_contract_abi?chain_id=${ chainId }&address={contract_address}'
\`\`\`

### Read Contract Data

\`\`\`bash
curl --request GET --url 'https://mcp.blockscout.com/v1/read_contract?chain_id=${ chainId }&address={contract_address}&abi={string_encoded_function_abi}&function_name={function_name}&args={string_encoded_arguments_list}'
\`\`\`
<!-- END:General-Data-Contracts -->

<!-- END:General-LLM-Ready-Blockchain-Data -->

<!-- START:Miscellaneous-Blockchain-Data -->
## Miscellaneous Blockchain Data

<!-- START:Stats -->
${GENERAL_COUNTERS_TEMPLATE}

### Gas Tracker

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/stats'
\`\`\`
<!-- END:Stats -->

<!-- START:Addresses -->
### Coin Balance History by Address

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/addresses/{account_address}/coin-balance-history-by-day'
curl --request GET --url '${generalApiUrl}/api/v2/addresses/{account_address}/coin-balance-history'
\`\`\`

### Logs Emitted by Address

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/addresses/{account_address}/logs'
\`\`\`

### Blocks Validated by Address

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/addresses/{account_address}/blocks-validated'
\`\`\`
<!-- END:Addresses -->

${USER_OPS_TEMPLATE}

<!-- START:Tokens -->
### Holders By Token Address

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/tokens/{token_contract_address}/holders'
\`\`\`

### NFT Inventory By Token Address

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/tokens/{token_contract_address}/instances'
\`\`\`

### NFT Instance Info

\`\`\`bash
curl --request GET --url '${generalApiUrl}/api/v2/tokens/{token_contract_address}/instances/{instance_id}'
curl --request GET --url '${generalApiUrl}/api/v2/tokens/{token_contract_address}/instances/{instance_id}/transfers'
\`\`\`
<!-- END:Tokens -->

<!-- END:Miscellaneous-Blockchain-Data -->

<!-- START:Additional-Info -->
## Additional Info

**Recommendation**: For programmatic access and LLM workflows, prefer the MCP Server endpoints (HTTP, not SSE).

- MCP landing: [https://mcp.blockscout.com](https://mcp.blockscout.com)
- MCP server root: [https://mcp.blockscout.com/mcp/](https://mcp.blockscout.com/mcp/)

### Other Blockscout instances (lookup by chain id or name):

\`\`\`bash
curl --request GET --url 'https://chains.blockscout.com/api/chains'
\`\`\`
<!-- END:Additional-Info -->
`;

        const content = MAIN_TEMPLATE.replace('{blank}\n', '');
        writeFileSync(outputFile, content);

        console.log('👍 Done!\n');
    } catch (error) {
        console.error('🚨 Error generating llms.txt:', error);
        console.log('\n');
        process.exit(1);
    }
}

run();