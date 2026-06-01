# Ubiquitous Language Glossary

Domain terms used in the Blockscout frontend codebase.

The glossary carries only what isn't already in code or other docs:
disambiguation between easily-confused terms, etymology, and scope. Folder
paths and env var names are intentionally **not** listed — paths follow
predictably from feature names (`src/features/<kebab-case-name>/`), and env
vars are documented in `docs/ENVS.md`. Architectural concepts like
**slice** and **feature** are defined in `.agents/rules/architecture.mdc`.

**Kinds** in the table below:

- *entity* — blockchain object that appears as a first-class UI element (detail page, list row, API resource)
- *feature* — a config-gated product area
- *service* — an external service (Blockscout-operated or third-party) backing a feature
- *chain* — a specific chain or chain concept
- *concept* — architectural / structural term

---

| Term | Kind | Definition |
|------|------|------------|
| **Account** | feature | Authenticated-user area covering watchlist, private tags, custom ABI, API keys, verified addresses, and profile. See also: **Watchlist**, **Public Tags**. |
| **Address Metadata** | feature | Provides address labels, metadata enrichment, and label-based address search. Backs the metadata panel on address pages and the Label Search page. **Public Tags** is one sub-feature. Distinct from **Address Profile API**. |
| **Address Profile API** | feature | Integration with a third-party API that decorates address pages with external profile tags and links. Distinct from **Address Metadata**, which surfaces Blockscout-managed labels. |
| **Advanced Filter** | feature | UI for filtering transactions using multi-criteria queries; distinct from the basic filter controls on most list pages. |
| **Alternative Explorers** | feature | "Verify with other explorers" menu linking to third-party explorers (e.g. Etherscan). |
| **Beacon Chain** | chain | The Ethereum Proof-of-Stake consensus layer. When enabled, exposes beacon-chain deposits and withdrawals alongside regular transactions. Not a rollup — it is the Ethereum L1 consensus mechanism. |
| **BENS (Blockscout Name Service)** | service | Blockscout's own chain-agnostic address naming service. Distinct from ENS (Ethereum-specific). Co-located with **Clusters** in the name-services UI. |
| **Blob** | entity | An individual EIP-4844 data blob attached to a transaction; a single tx can carry multiple. The entity is `Blob`; the feature folder/flag that surfaces it uses the name `data-availability`. |
| **Block Reward** | entity | On-chain payout to a block producer (miner, validator, etc.). Entirely distinct from the **Rewards** (Merits) program — no shared code, API, or folder. |
| **CCTX (Cross-Chain Transaction)** | entity | ZetaChain-specific transaction type that spans multiple chains. Displayed as a separate tab on the transactions list. Distinct from the general cross-chain transactions feature (**Interchain Indexer**). |
| **Chain Variant** | concept | A non-rollup chain that ships custom UI or domain entities (e.g. Celo, TAC, ZetaChain, Beacon Chain, MUD, Zilliqa). Contrast with **Rollup**, which implies an L1/L2 settlement relationship. |
| **Clusters** | service | Address identity and grouping service: aggregates multiple addresses under a named cluster (individual, protocol, organization). Co-located with **BENS** in the name-services UI. |
| **Connect Wallet** | feature | Lets users write to contracts, sign transactions, and connect a wallet to the explorer. Previously named `blockchain-interaction`; the current config key is `connectWallet`. Distinct from **Web3 Wallet**. |
| **Dispute Games** | entity | Part of the Optimism **Fault Proof System**. On-chain games used to challenge and resolve disputed L2 output roots. |
| **Easter Eggs** | feature | Hidden mini-games wired to claim links for badge rewards. |
| **Epoch** | entity | A consensus time period specific to **Celo**. Has its own index and detail pages. Always refers to a Celo epoch in this codebase — not a generic blockchain concept. |
| **Fault Proof System** | feature | Optimism's mechanism for proving the correctness of L2 state transitions on L1 via **Dispute Games**. |
| **Flashblocks** | feature | MegaETH's sub-second block streaming mechanism. |
| **Hot Contracts** | feature | Ranked list of the most recently and frequently interacted-with smart contracts on the network. |
| **Interchain Indexer** | service | Microservice that indexes cross-chain messages and token transfers across heterogeneous chains. General-purpose interop indexer, not ZetaChain-specific. Provides "Cross chain txs" feature. Distinct from **CCTX**. |
| **Interop Messages** | entity | **Deprecated** Cross-rollup messages passed between OP Stack chains using the native interoperability protocol. Distinct from **Interchain Indexer** messages. |
| **Kettle** | entity | In the **SUAVE** architecture, a Kettle is a trusted execution environment (TEE) node that processes MEV bundles. SUAVE transactions are associated with a Kettle. |
| **Marketplace** | feature | Curated directory of dApps and DeFi applications integrated with Blockscout. |
| **MetaSuites** | service | Third-party browser extension that enhances the Blockscout UI with additional data and links. |
| **MUD Worlds** | entity | Instances of the MUD framework — an on-chain autonomous world / game engine. |
| **Multichain** | feature | Aggregates data across multiple Blockscout-indexed chains into a single explorer view. |
| **Operation** | entity | **TAC**-specific entity representing a bridge operation between the TON and EVM ecosystems. No equivalent on standard EVM chains. |
| **Pools** | entity | DEX liquidity pool positions tracked on-chain. |
| **Public Tags** | feature | Community-submitted labels for addresses, visible on address pages. A sub-feature of **Address Metadata**. |
| **Rewards** | feature | The Blockscout Merits program — a token rewards and incentives system operated by Blockscout. Entirely distinct from **Block Reward** (on-chain block-producer payouts). |
| **Rollup** | concept | A chain that settles transactions on a parent (L1) chain. Introduces specific entities: deposits, withdrawals, transaction batches, output roots. Contrast with **Chain Variant**. |
| **SolidityScan** | service | Third-party smart contract security vulnerability scanner integrated into contract detail pages. |
| **SUAVE** | chain | MEV-focused chain developed by Flashbots, built around a trusted execution environment (TEE) architecture. Introduces the **Kettle** entity. |
| **TAC (Ton Application Chain)** | chain | A chain that bridges the TON blockchain and EVM ecosystems. Introduces the **Operation** entity. |
| **Tx Actions** | feature | Structured per-transaction action breakdown rendered on the tx details page — a first-party Blockscout interpretation of what a tx did. Distinct from **Tx Interpretation** (natural-language summary) and from raw calldata. |
| **Tx Interpretation** | feature | Natural-language summary of a transaction shown on detail pages. Distinct from **Tx Actions**. |
| **User Op (User Operation)** | entity | ERC-4337 account-abstraction operation — a transaction-like object submitted to a bundler rather than directly to the network. |
| **Validators** | feature | The set of active block validators on chains that expose this concept (e.g. zkSync Era, Celo). Not present on standard PoW/PoS EVM chains without explicit support. |
| **Visualize** | service | Service that converts Solidity source code into UML diagrams (class and storage layout). |
| **Watchlist** | feature | An **Account** feature that lets authenticated users track a set of addresses and receive notifications for their activity. |
| **Web3 Wallet** | feature | Lets users add tokens and networks directly from the explorer to their browser wallet. Distinct from **Connect Wallet** (signing/writing). |
| **X-Star Score** | feature | Third-party reputation score shown on address pages, linking out to the X-Star service. |
