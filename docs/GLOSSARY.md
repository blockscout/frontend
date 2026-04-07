# Ubiquitous Language Glossary

Domain terms used in the Blockscout frontend codebase. Intended for both engineers and agents.
Terms are listed alphabetically within each section. Where a codename differs from the product name, both are shown.

---

## Architecture

Terms specific to how this codebase is structured. Read this section first when navigating the repo or `ARCH_REDESIGN.md`.

| Term | Definition |
|------|------------|
| **Chain Variant** | A non-rollup chain with custom UI or domain entities (e.g. Celo, TAC, SUAVE, MegaETH, ZetaChain). Grouped under `features/chain-variants/<name>/`. Distinct from a **Rollup**, which implies an L1/L2 settlement relationship. |
| **Feature** | An optional, config-gated product area (e.g. `stats`, `marketplace`, `user-ops`). Corresponds roughly to a flag in `configs/app/features/`. Lives under `client/features/`. Contrast with **Slice**. |
| **Rollup** | A chain that settles transactions on a parent (L1) chain. Introduces specific entities: deposits, withdrawals, transaction batches, output roots. Organized by rollup type under `features/rollup/<type>/` (e.g. `optimism`, `arbitrum`, `zk-sync`). Contrast with **Chain Variant**. |
| **Slice** | A core explorer domain entity that is always present on any EVM chain, regardless of feature flags (e.g. `tx`, `block`, `address`, `token`). Lives under `client/slices/`. Contrast with **Feature**. |

---

## Domain entities

Blockchain objects that appear as first-class UI elements — detail pages, list rows, API resources, stubs.

| Term | Definition |
|------|------------|
| **Blob** | An individual EIP-4844 data blob attached to a transaction. A single transaction can carry multiple blobs. Each blob has its own detail page (`/blob/[hash]`) and is a first-class entity in the UI (with its own components, API resource, and stub). The term "blob" remains correct for the entity — only the *feature folder* uses `data-availability` (see **Data Availability**). |
| **CCTX (Cross-Chain Transaction)** | A ZetaChain-specific transaction type that spans multiple chains. Displayed as a separate tab on the transactions list page. Unrelated to the general cross-chain transactions feature (`interchainIndexer`). |
| **Dispute Games** | Part of the Optimism **Fault Proof System**. On-chain games used to challenge and resolve disputed L2 output roots. Displayed in the rollup navigation when `faultProofSystem` is enabled. |
| **Epoch** | A consensus time period specific to **Celo**. Has its own index and detail pages in the UI. Not a generic blockchain concept in this codebase — always refers to a Celo epoch. Lives under `features/chain-variants/celo/`. |
| **Interop Messages** | Cross-rollup messages passed between OP Stack chains using the native interoperability protocol. Visible in rollup navigation when `NEXT_PUBLIC_INTEROP_ENABLED` is set. Distinct from **Interchain Indexer** messages. Currently in deprecated state. |
| **Kettle** | In the **SUAVE** architecture, a Kettle is a trusted execution environment (TEE) node that processes MEV bundles. Transactions on SUAVE are associated with a Kettle, and the UI exposes a per-Kettle transaction list at `/txs/kettle/[hash]`. |
| **Operation** | A **TAC**-specific entity representing a bridge operation between the TON and EVM ecosystems. Has no equivalent on standard EVM chains. Exposed at `/operations` and `/operation/[id]`. |
| **User Op (User Operation)** | An ERC-4337 account abstraction operation — a transaction-like object submitted to a bundler rather than directly to the network. Displayed in a dedicated list at `/ops` and detail page at `/op/[hash]`. Config-gated via `NEXT_PUBLIC_HAS_USER_OPS`. |

---

## Features & integrations

Optional product areas and their backing services. Each corresponds to a folder under `client/features/`.

| Term | Definition |
|------|------------|
| **Advanced Filter** | A UI feature for filtering transactions using complex multi-criteria queries (address, method, token, amount ranges, etc.). Distinct from the basic filter controls present on most list pages. Config-gated via `NEXT_PUBLIC_ADVANCED_FILTER_ENABLED`. |
| **Beacon Chain** | The Ethereum Proof-of-Stake consensus layer. When enabled, exposes beacon chain deposits and withdrawals alongside regular transactions. Not a rollup — it is the Ethereum L1 consensus mechanism. |
| **BENS (Blockscout Name Service)** | Blockscout's own address naming service, chain-agnostic and operated by Blockscout. Distinct from ENS (which is Ethereum-specific). In the codebase also referred to as `name-services` or `name-domains`. |
| **Clusters** | An address identity and grouping service. Aggregates multiple addresses under a named cluster (individual, protocol, organization). Exposes a directory, leaderboard, and per-address lookup. Backed by the Clusters API (`NEXT_PUBLIC_CLUSTERS_API_HOST`). |
| **Data Availability** | The config-gated *feature* that surfaces **Blob** data posted to Ethereum (EIP-4844). `data-availability` is the name used for the feature folder and config flag — the underlying entity is still called a **Blob**. Config-gated via `NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED`. |
| **Fault Proof System** | Optimism's mechanism for proving the correctness of L2 state transitions on L1 via **Dispute Games**. Enabled by the `NEXT_PUBLIC_FAULT_PROOF_ENABLED` feature flag. |
| **Flashblocks** | MegaETH's sub-second block streaming mechanism. Delivers real-time pre-confirmation block data via WebSocket. Specific to the MegaETH chain variant. |
| **Hot Contracts** | A ranked list of the most recently and frequently interacted-with smart contracts on the network. Config-gated via `NEXT_PUBLIC_HOT_CONTRACTS_ENABLED`. |
| **Interchain Indexer** | A microservice that indexes cross-chain messages and token transfers across heterogeneous chains (not ZetaChain-specific — a general interoperability indexer). Distinct from **CCTX**. Backed by `NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED`. |
| **Marketplace** | A curated directory of dApps and DeFi applications integrated with Blockscout. Config-gated via `NEXT_PUBLIC_MARKETPLACE_ENABLED`. Has its own full-page UI with categories and app detail views. |
| **MetaSuites** | A third-party browser extension that enhances the Blockscout UI with additional data and links. The frontend notifies it about route changes via a dedicated hook. |
| **MUD Worlds** | Instances of the MUD framework — an on-chain autonomous world / game engine. Chains that use MUD expose a list of active worlds. Config-gated via `mudFramework` feature flag. |
| **Multichain** | The feature that aggregates data across multiple Blockscout-indexed chains into a single explorer view. Introduces an "Ecosystems" page and a multichain balance button. Config-gated via `NEXT_PUBLIC_MULTICHAIN_ENABLED`. |
| **Pools** | DEX liquidity pool positions tracked on-chain. Exposed as a "DEX tracker" section under Tokens. Config-gated via `NEXT_PUBLIC_DEX_POOLS_ENABLED`. |
| **Public Tags** | Community-submitted labels for addresses, visible on address pages. Submitted via a dedicated form. Config-gated via `NEXT_PUBLIC_METADATA_SERVICE_API_HOST`. |
| **Rewards** | A token rewards and incentives program operated by Blockscout. Has its own API, context provider, and UI modals. Config-gated via `NEXT_PUBLIC_REWARDS_SERVICE_API_HOST`. |
| **SolidityScan** | A third-party smart contract security vulnerability scanner integrated into contract detail pages. Displays a security score and known vulnerability findings. |
| **SUAVE** | A MEV-focused chain developed by Flashbots, built around a trusted execution environment (TEE) architecture. Introduces the **Kettle** entity. |
| **TAC (Ton Application Chain)** | A chain that bridges the TON blockchain and EVM ecosystems. Introduces the **Operation** entity. Its data comes from a dedicated `tac-operation-lifecycle` microservice. Config-gated via `NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST`. |
| **Validators** | The set of active block validators on chains that expose this concept (e.g. zkSync Era, Celo). Displayed in a dedicated list. Not present on standard PoW/PoS EVM chains without explicit support. Config-gated via `NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE`. |
| **Visualize** | A service that converts Solidity source code into UML diagrams (class and storage layout). Accessed from contract detail pages. Backed by `NEXT_PUBLIC_VISUALIZE_API_HOST`. |
| **Watchlist** | An **Account** feature that lets authenticated users track a set of addresses and receive notifications for their activity. |
