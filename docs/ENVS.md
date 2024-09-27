# Run-time environment variables

The app instance can be customized by passing the following variables to the Node.js environment at runtime. Some of these variables have been deprecated, and their full list can be found in the [file](./DEPRECATED_ENVS.md).

**IMPORTANT NOTE!** For _production_ build purposes all json-like values should be single-quoted. If it contains a hash (`#`) or a dollar-sign (`$`) the whole value should be wrapped in single quotes as well (see `dotenv` [readme](https://github.com/bkeepers/dotenv#variable-substitution) for the reference)

## Disclaimer about using variables

Please be aware that all environment variables prefixed with `NEXT_PUBLIC_` will be exposed to the browser. So any user can obtain its values. Make sure that for all 3rd-party services keys (e.g., Sentri, Auth0, WalletConnect, etc.) in the services administration panel you have created a whitelist of allowed origins and have added your app domain into it. That will help you prevent using your key by unauthorized app, if someone gets its value.

&nbsp;

## Table of contents
- [App configuration](ENVS.md#app-configuration)
- [Blockchain parameters](ENVS.md#blockchain-parameters)
- [API configuration](ENVS.md#api-configuration)
- [UI configuration](ENVS.md#ui-configuration)
  - [Homepage](ENVS.md#homepage)
  - [Navigation](ENVS.md#navigation)
  - [Footer](ENVS.md#footer)
  - [Favicon](ENVS.md#favicon)
  - [Meta](ENVS.md#meta)
  - [Views](ENVS.md#views)
    - [Block](ENVS.md#block-views)
    - [Address](ENVS.md#address-views)
    - [Transaction](ENVS.md#transaction-views)
    - [NFT](ENVS.md#nft-views)
  - [Misc](ENVS.md#misc)
- [App features](ENVS.md#app-features)
  - [My account](ENVS.md#my-account)
  - [Gas tracker](ENVS.md#gas-tracker)
  - [Address verification](ENVS.md#address-verification-in-my-account) in "My account"
  - [Blockchain interaction](ENVS.md#blockchain-interaction-writing-to-contract-etc) (writing to contract, etc.)
  - [Banner ads](ENVS.md#banner-ads)
  - [Text ads](ENVS.md#text-ads)
  - [Beacon chain](ENVS.md#beacon-chain)
  - [User operations](ENVS.md#user-operations-erc-4337)
  - [Rollup chain](ENVS.md#rollup-chain)
  - [Export data to CSV file](ENVS.md#export-data-to-csv-file)
  - [Google analytics](ENVS.md#google-analytics)
  - [Mixpanel analytics](ENVS.md#mixpanel-analytics)
  - [GrowthBook feature flagging and A/B testing](ENVS.md#growthbook-feature-flagging-and-ab-testing)
  - [GraphQL API documentation](ENVS.md#graphql-api-documentation)
  - [REST API documentation](ENVS.md#rest-api-documentation)
  - [Marketplace](ENVS.md#marketplace)
  - [Solidity to UML diagrams](ENVS.md#solidity-to-uml-diagrams)
  - [Blockchain statistics](ENVS.md#blockchain-statistics)
  - [Web3 wallet integration](ENVS.md#web3-wallet-integration-add-token-or-network-to-the-wallet) (add token or network to the wallet)
  - [Transaction interpretation](ENVS.md#transaction-interpretation)
  - [Verified tokens info](ENVS.md#verified-tokens-info)
  - [Name service integration](ENVS.md#name-service-integration)
  - [Metadata service integration](ENVS.md#metadata-service-integration)
  - [Public tag submission](ENVS.md#public-tag-submission)
  - [Data availability](ENVS.md#data-availability)
  - [Bridged tokens](ENVS.md#bridged-tokens)
  - [Safe{Core} address tags](ENVS.md#safecore-address-tags)
  - [Address profile API](ENVS.md#address-profile-api)
  - [SUAVE chain](ENVS.md#suave-chain)
  - [MetaSuites extension](ENVS.md#metasuites-extension)
  - [Validators list](ENVS.md#validators-list)
  - [Sentry error monitoring](ENVS.md#sentry-error-monitoring)
  - [OpenTelemetry](ENVS.md#opentelemetry)
  - [DeFi dropdown](ENVS.md#defi-dropdown)
  - [Multichain balance button](ENVS.md#multichain-balance-button)
  - [Get gas button](ENVS.md#get-gas-button)
  - [Save on gas with GasHawk](ENVS.md#save-on-gas-with-gashawk)
- [3rd party services configuration](ENVS.md#external-services-configuration)

&nbsp;

## App configuration

| Variable | Type| Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_APP_PROTOCOL | `http \| https` | App url schema | - | `https` | `http` | v1.0.x+ |
| NEXT_PUBLIC_APP_HOST | `string` | App host | Required | - | `blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_APP_PORT | `number` | Port where app is running | - | `3000` | `3001` | v1.0.x+ |
| NEXT_PUBLIC_USE_NEXT_JS_PROXY | `boolean` | Tells the app to proxy all APIs request through the NextJS app. **We strongly advise not to use it in the production environment**, since it can lead to performance issues of the NodeJS server | - | `false` | `true` | v1.8.0+ |

&nbsp;

## Blockchain parameters

*Note!* The `NEXT_PUBLIC_NETWORK_CURRENCY` variables represent the blockchain's native token used for paying transaction fees. `NEXT_PUBLIC_NETWORK_SECONDARY_COIN` variables refer to tokens like protocol-specific tokens (e.g., OP token on Optimism chain) or governance tokens (e.g., GNO on Gnosis chain).

| Variable | Type| Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_NAME | `string` | Displayed name of the network | Required | - | `Gnosis Chain` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_SHORT_NAME | `string` | Used for SEO attributes (e.g, page description) | - | -  | `OoG` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_ID | `number` | Chain id, see [https://chainlist.org](https://chainlist.org) for the reference | Required | -  | `99` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | Chain public RPC server url, see [https://chainlist.org](https://chainlist.org) for the reference | - | - | `https://core.poa.network` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | Network currency name | - | - | `Ether` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME | `string` | Name of network currency subdenomination | - | `wei` | `duck` | v1.23.0+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | Network currency symbol | - | - | `ETH` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | Network currency decimals | - | `18` | `6` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL | `string` | Network secondary coin symbol.  | - | - | `GNO` | v1.29.0+ |
| NEXT_PUBLIC_NETWORK_MULTIPLE_GAS_CURRENCIES | `boolean` | Set to `true` for networks where users can pay transaction fees in either the native coin or ERC-20 tokens.  | - | `false` | `true` | v1.33.0+ |
| NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE | `validation` \| `mining` | Verification type in the network. Irrelevant for Arbitrum (verification type is always `posting`) and ZkEvm (verification type is always `sequencing`) L2s | - | `mining` | `validation` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_TOKEN_STANDARD_NAME | `string` | Name of the standard for creating tokens | - | `ERC` | `BEP` | v1.31.0+ |
| NEXT_PUBLIC_IS_TESTNET | `boolean`| Set to true if network is testnet | - | `false` | `true` | v1.0.x+ |

&nbsp;

## API configuration

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_PROTOCOL | `http \| https` | Main API protocol | - | `https` | `http` | v1.0.x+ |
| NEXT_PUBLIC_API_HOST | `string` | Main API host | Required | - | `blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_API_PORT | `number` | Port where API is running on the host | - | - | `3001` | v1.0.x+ |
| NEXT_PUBLIC_API_BASE_PATH | `string` | Base path for Main API endpoint url | - | - | `/poa/core` | v1.0.x+ |
| NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL | `ws \| wss` | Main API websocket protocol | - | `wss` | `ws` | v1.0.x+ |

&nbsp;

## UI configuration

### Homepage

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HOMEPAGE_CHARTS | `Array<'daily_txs' \| 'coin_price'  \| 'secondary_coin_price' \| 'market_cap' \| 'tvl'>` | List of charts displayed on the home page | - | - | `['daily_txs','coin_price','market_cap']` | v1.0.x+ |
| NEXT_PUBLIC_HOMEPAGE_STATS | `Array<'latest_batch' \| 'total_blocks'  \| 'average_block_time' \| 'total_txs' \| 'latest_l1_state_batch' \| 'wallet_addresses' \| 'gas_tracker' \| 'btc_locked' \| 'current_epoch'>` | List of stats widgets displayed on the home page | - | For zkSync, zkEvm and Arbitrum rollups: `['latest_batch','average_block_time','total_txs','wallet_addresses','gas_tracker']`, for other cases: `['total_blocks','average_block_time','total_txs','wallet_addresses','gas_tracker']` | `['total_blocks','total_txs','wallet_addresses']` | v1.35.x+ |
| NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR | `string` | Text color of the hero plate on the homepage (escape "#" symbol if you use HEX color codes or use rgba-value instead). **DEPRECATED** _Use `NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG` instead_  | - | `white` | `\#DCFE76` | v1.0.x+ |
| NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND | `string` | Background css value for hero plate on the homepage (escape "#" symbol if you use HEX color codes or use rgba-value instead). **DEPRECATED** _Use `NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG` instead_  | - | `radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)` | `radial-gradient(at 15% 86%, hsla(350,65%,70%,1) 0px, transparent 50%)` \| `no-repeat bottom 20% right 0px/100% url(https://placekitten/1400/200)` | v1.1.0+ |
| NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG | `HeroBannerConfig`, see details [below](#hero-banner-configuration-properties) | Configuration of hero banner appearance. | - | - | See [below](#hero-banner-configuration-properties) | v1.35.0+ |

#### Hero banner configuration properties

_Note_ Here, all values are arrays of up to two strings. The first string represents the value for the light color mode, and the second string represents the value for the dark color mode. If the array contains only one string, it will be used for both color modes.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| background | `[string, string]` | Banner background (could be a solid color, gradient or picture). The string should be a valid `background` CSS property value. | - | `['radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)']` | `['lightpink','no-repeat bottom 20% right 0px/100% url(https://placekitten/1400/200)']` |
| text_color | `[string, string]` | Banner text background. The string should be a valid `color` CSS property value. | - | `['white']` | `['lightpink','#DCFE76']` |
| border | `[string, string]` | Banner border. The string should be a valid `border` CSS property value. | - | - | `['1px solid yellow','4px dashed #DCFE76']` |
| button | `Partial<Record<'_default' \| '_hover' \| '_selected', {'background'?: [string, string]; 'text_color?:[string, string]'}>>` | The button on the banner. It has three possible states: `_default`, `_hover`, and `_selected`. The `_selected` state reflects when the user is logged in or their wallet is connected to the app. | - | - | `{'_default':{'background':['deeppink'],'text_color':['white']}}` |

&nbsp;

### Navigation

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_LOGO | `string` | Network logo; if not provided, placeholder will be shown; *Note* the logo height should be 24px and width less than 120px | - | - | `https://placekitten.com/240/40` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_LOGO_DARK | `string` | Network logo for dark color mode; if not provided, **inverted** regular logo will be used instead | - | - | `https://placekitten.com/240/40` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_ICON | `string` | Network icon; used as a replacement for regular network logo when nav bar is collapsed; if not provided, placeholder will be shown; *Note* the icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_ICON_DARK | `string` | Network icon for dark color mode; if not provided, **inverted** regular icon will be used instead | - | - | `https://placekitten.com/60/60` | v1.0.x+ |
| NEXT_PUBLIC_FEATURED_NETWORKS | `string` | URL of configuration file (`.json` format only) or file content string representation. It contains list of featured networks that will be shown in the network menu. See [below](#featured-network-configuration-properties) list of available properties for particular network | - | - | `https://example.com/featured_networks_config.json` \| `[{'title':'Astar(EVM)','url':'https://astar.blockscout.com/','group':'Mainnets','icon':'https://example.com/astar.svg'}]` | v1.0.x+ |
| NEXT_PUBLIC_OTHER_LINKS | `Array<{url: string; text: string}>` | List of links for the "Other" navigation menu | - | - | `[{'url':'https://blockscout.com','text':'Blockscout'}]` | v1.0.x+ |
| NEXT_PUBLIC_NAVIGATION_HIDDEN_LINKS | `Array<LinkId>` | List of external links hidden in the navigation. Supported ids are `eth_rpc_api`, `rpc_api` | - | - | `['eth_rpc_api']` | v1.16.0+ |
| NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES | `Array<string>` | List of menu item routes that should have a lightning label | - | - | `['/accounts']` | v1.31.0+ |
| NEXT_PUBLIC_NAVIGATION_LAYOUT | `vertical \| horizontal` | Navigation menu layout type | - | `vertical` | `horizontal` | v1.32.0+ |

#### Featured network configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the network | Required | - | `Gnosis Chain` |
| url | `string` | Network explorer main page url | Required | - | `https://blockscout.com/xdai/mainnet` |
| group | `Mainnets \| Testnets \| Other` | Indicates in which tab network appears in the menu | Required | - | `Mainnets` |
| icon | `string` | Network icon; if not provided, the common placeholder will be shown; *Note* that icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` |
| isActive | `boolean` | Pass `true` if item should be shown as active in the menu | - | - | `true` |
| invertIconInDarkMode | `boolean` | Pass `true` if icon colors should be inverted in dark mode | - | - | `true` |

&nbsp;

### Footer

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FOOTER_LINKS | `string` | URL of configuration file (`.json` format only) or file content string representation. It contains list of link groups to be displayed in the footer. See [below](#footer-links-configuration-properties) list of available properties for particular group | - | - | `https://example.com/footer_links_config.json` \| `[{'title':'My chain','links':[{'text':'About','url':'https://example.com/about'},{'text':'Contacts','url':'https://example.com/contacts'}]}]` | v1.1.1+ |

The app version shown in the footer is derived from build-time ENV variables `NEXT_PUBLIC_GIT_TAG` and `NEXT_PUBLIC_GIT_COMMIT_SHA` and cannot be overwritten at run-time.

#### Footer links configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Title of link group | Required | - | `Company` |
| links | `Array<{'text':string;'url':string;}>` | list of links | Required | - | `[{'text':'Homepage','url':'https://www.blockscout.com'}]` |

&nbsp;

### Favicon

By default, the app has generic favicon. You can override this behavior by providing the following variables. Hence, the favicon assets bundle will be generated at the container start time and will be used instead of default one.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| FAVICON_GENERATOR_API_KEY | `string` | RealFaviconGenerator [API key](https://realfavicongenerator.net/api/) | Required | - | `<your-secret>` | v1.16.0+ |
| FAVICON_MASTER_URL | `string` | - | - | `NEXT_PUBLIC_NETWORK_ICON` | `https://placekitten.com/180/180` | v1.11.0+ |

&nbsp;

### Meta

Settings for meta tags, OG tags and SEO

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE | `boolean` | Set to `true` to promote Blockscout in meta and OG titles | - | `true` | `true` | v1.12.0+ |
| NEXT_PUBLIC_OG_DESCRIPTION | `string` | Custom OG description | - | - | `Blockscout is the #1 open-source blockchain explorer available today. 100+ chains and counting rely on Blockscout data availability, APIs, and ecosystem tools to support their networks.` | v1.12.0+ |
| NEXT_PUBLIC_OG_IMAGE_URL | `string` | OG image url. Minimum image size is 200 x 20 pixels (recommended: 1200 x 600); maximum supported file size is 8 MB; 2:1 aspect ratio; supported formats: image/jpeg, image/gif, image/png | - | `static/og_placeholder.png` | `https://placekitten.com/1200/600` | v1.12.0+ |
| NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED | `boolean` | Set to `true` to populate OG tags (title, description) with API data for social preview robot requests | - | `false` | `true` | v1.29.0+ |
| NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED | `boolean` | Set to `true` to pre-render page titles (e.g Token page) on the server side and inject page h1-tag to the markup before it is sent to the browser. | - | `false` | `true` | v1.30.0+ |

&nbsp;

### Views

#### Block views

| Variable | Type | Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS | `Array<BlockFieldId>` | Array of the block fields ids that should be hidden. See below the list of the possible id values. | - | - | `'["burnt_fees","total_reward"]'` | v1.10.0+ |


##### Block fields list
| Id | Description |
| --- | --- |
| `burnt_fees` | Burnt fees |
| `total_reward` | Total block reward |
| `nonce` | Block nonce |
| `miner` | Address of block's miner or validator |
| `L1_status` | Short interpretation of the batch lifecycle (applicable for Rollup chains) |
| `batch` | Batch index (applicable for Rollup chains) |

&nbsp;

#### Address views

| Variable | Type | Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE | `"github" \| "jazzicon" \| "gradient_avatar" \| "blockie"` | Default style of address identicon appearance. Choose between [GitHub](https://github.blog/2013-08-14-identicons/), [Metamask Jazzicon](https://metamask.github.io/jazzicon/), [Gradient Avatar](https://github.com/varld/gradient-avatar) and [Ethereum Blocky](https://mycryptohq.github.io/ethereum-blockies-base64/) | - | `jazzicon` | `gradient_avatar` | v1.12.0+ |
| NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS | `Array<AddressViewId>` | Address views that should not be displayed. See below the list of the possible id values.  | - | - | `'["top_accounts"]'` | v1.15.0+ |
| NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED | `boolean` | Set to `true` if SolidityScan reports are supported | - | - | `true` | v1.19.0+ |
| NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS | `Array<'solidity-hardhat' \| 'solidity-foundry'>` | Pass an array of additional methods from which users can choose while verifying a smart contract. Both methods are available by default, pass `'none'` string to disable them all. | - | - | `['solidity-hardhat']` | v1.33.0+ |

##### Address views list
| Id | Description |
| --- | --- |
| `top_accounts` | Top accounts |

&nbsp;

#### Transaction views

| Variable | Type | Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS | `Array<TxFieldsId>` | Array of the transaction fields ids that should be hidden. See below the list of the possible id values. | - | - | `'["value","tx_fee"]'` | v1.15.0+ |
| NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS | `Array<TxAdditionalFieldsId>` | Array of the additional fields ids that should be added to the transaction details. See below the list of the possible id values. | - | - | `'["fee_per_gas"]'` | v1.15.0+ |

##### Transaction fields list
| Id | Description |
| --- | --- |
| `value` | Sent value |
| `fee_currency` | Fee currency |
| `gas_price` | Price per unit of gas |
| `tx_fee` | Total transaction fee |
| `gas_fees` | Gas fees breakdown |
| `burnt_fees` | Amount of native coin burnt for transaction |
| `L1_status` | Short interpretation of the batch lifecycle (applicable for Rollup chains) |
| `batch` | Batch index (applicable for Rollup chains) |

##### Transaction additional fields list
| Id | Description |
| --- | --- |
| `fee_per_gas` | Amount of total fee divided by total amount of gas used by transaction |

&nbsp;

#### NFT views

| Variable | Type | Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES | `Array<NftMarketplace>` where `NftMarketplace` can have following [properties](#nft-marketplace-properties) | Used to build up links to NFT collections and NFT instances in external marketplaces. | - | - | `[{'name':'OpenSea','collection_url':'https://opensea.io/assets/ethereum/{hash}','instance_url':'https://opensea.io/assets/ethereum/{hash}/{id}','logo_url':'https://opensea.io/static/images/logos/opensea-logo.svg'}]` | v1.15.0+ |


##### NFT marketplace properties
| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Displayed name of the marketplace | Required | - | `OpenSea` |
| collection_url | `string` | URL template for NFT collection | Required | - | `https://opensea.io/assets/ethereum/{hash}` |
| instance_url | `string` | URL template for NFT instance | Required | - | `https://opensea.io/assets/ethereum/{hash}/{id}` |
| logo_url | `string` | URL of marketplace logo | Required | - | `https://opensea.io/static/images/logos/opensea-logo.svg` |

*Note* URL templates should contain placeholders of NFT hash (`{hash}`) and NFT id (`{id}`). This placeholders will be substituted with particular values for every collection or instance.

&nbsp;

### Misc

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_EXPLORERS | `Array<NetworkExplorer>` where `NetworkExplorer` can have following [properties](#network-explorer-configuration-properties) | Used to build up links to transactions, blocks, addresses in other chain explorers. | - | - | `[{'title':'Anyblock','baseUrl':'https://explorer.anyblock.tools','paths':{'tx':'/ethereum/poa/core/tx'}}]` | v1.0.x+ |
| NEXT_PUBLIC_CONTRACT_CODE_IDES | `Array<ContractCodeIde>` where `ContractCodeIde` can have following [properties](#contract-code-ide-configuration-properties) | Used to build up links to IDEs with contract source code. | - | - | `[{'title':'Remix IDE','url':'https://remix.blockscout.com/?address={hash}&blockscout={domain}','icon_url':'https://example.com/icon.svg'}]` | v1.23.0+ |
| NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS | `boolean` | Set to `true` to enable Submit Audit form on the contract page | - | `false` | `true` | v1.25.0+ |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS | `boolean` | Set to `true` to hide indexing alert in the page header about indexing chain's blocks | - | `false` | `true` | v1.17.0+ |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS | `boolean` | Set to `true` to hide indexing alert in the page footer about indexing block's internal transactions | - | `false` | `true` | v1.17.0+ |
| NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE | `string` | Used for displaying custom announcements or alerts in the header of the site. Could be a regular string or a HTML code. | - | - | `Hello world! 🤪` | v1.13.0+ |
| NEXT_PUBLIC_COLOR_THEME_DEFAULT | `'light' \| 'dim' \| 'midnight' \| 'dark'` | Preferred color theme of the app | - | - | `midnight` | v1.30.0+ |
| NEXT_PUBLIC_FONT_FAMILY_HEADING | `FontFamily`, see full description [below](#font-family-configuration-properties) | Special typeface to use in page headings (`<h1>`, `<h2>`, etc.) | - | - | `{'name':'Montserrat','url':'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'}` | v1.35.0+ |
| NEXT_PUBLIC_FONT_FAMILY_BODY | `FontFamily`, see full description [below](#font-family-configuration-properties) | Main typeface to use in page content elements. | - | - | `{'name':'Raleway','url':'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap'}` | v1.35.0+ |
| NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED | `boolean` | Set to `true` to restrict the page content width on extra-large screens. | - | `true` | `false` | v1.34.1+ |

#### Network explorer configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| logo | `string` | URL to explorer logo file. Should be at least 40x40. | - | - | `'https://foo.app/icon.png'` |
| title | `string` | Displayed name of the explorer | Required | - | `Anyblock` |
| baseUrl | `string` | Base url of the explorer | Required | - | `https://explorer.anyblock.tools` |
| paths | `Record<'tx' \| 'block' \| 'address' \| 'token', string>` | Map of explorer entities and their paths | Required | - | `{'tx':'/ethereum/poa/core/tx'}` |

*Note* The url of an entity will be constructed as `<baseUrl><paths[<entity-type>]><entity-id>`, e.g `https://explorer.anyblock.tools/ethereum/poa/core/tx/<tx-id>`

#### Contract code IDE configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the IDE | Required | - | `Remix IDE` |
| url | `string` | URL of the IDE with placeholders for contract hash (`{hash}`) and current domain (`{domain}`) | Required | - | `https://remix.blockscout.com/?address={hash}&blockscout={domain}` |
| icon_url | `string` | URL of the IDE icon | Required | - | `https://example.com/icon.svg` |

#### Font family configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Font family name; used to define the `font-family` CSS property. | Required | - | `Montserrat` |
| url | `string` | URL for external font. Ensure the font supports the following weights: 400, 500, 600, and 700. | Required | - | `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap` |

&nbsp;

## App features

*Note* The variables which are marked as required should be passed as described in order to enable the particular feature, but they are not required in the whole app context.

### My account

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED | `boolean` | Set to true if network has account feature | Required | - | `true` | v1.0.x+ |
| NEXT_PUBLIC_AUTH0_CLIENT_ID | `string` | Client id for [Auth0](https://auth0.com/) provider | Required | - | `<your-secret>` | v1.0.x+ |
| NEXT_PUBLIC_AUTH_URL | `string` | Account auth base url; it is used for building login URL (`${ NEXT_PUBLIC_AUTH_URL }/auth/auth0`) and logout return URL (`${ NEXT_PUBLIC_AUTH_URL }/auth/logout`); if not provided the base app URL will be used instead | Required | - | `https://blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_LOGOUT_URL | `string` | Account logout url. Required if account is supported for the app instance. | Required | - | `https://blockscoutcom.us.auth0.com/v2/logout` | v1.0.x+ |

&nbsp;

### Gas tracker

This feature is **enabled by default**. To switch it off pass `NEXT_PUBLIC_GAS_TRACKER_ENABLED=false`.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GAS_TRACKER_ENABLED | `boolean` | Set to true to enable "Gas tracker" in the app | Required | `true` | `false` | v1.25.0+ |
| NEXT_PUBLIC_GAS_TRACKER_UNITS | Array<`usd` \| `gwei`> | Array of units for displaying gas prices on the Gas Tracker page, in the stats snippet on the Home page, and in the top bar. The first value in the array will take priority over the second one in all mentioned views. If only one value is provided, gas prices will be displayed only in that unit. | - | `[ 'usd', 'gwei' ]` | `[ 'gwei' ]` | v1.25.0+ |

&nbsp;

### Address verification in "My account"

*Note* all ENV variables required for [My account](ENVS.md#my-account) feature should be passed alongside the following ones:

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | Required | - | `https://contracts-info.services.blockscout.com` | v1.1.0+ |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url | Required | - | `https://admin-rs.services.blockscout.com` | v1.1.0+ |

&nbsp;

### Blockchain interaction (writing to contract, etc.)

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID | `string` | Project id for [WalletConnect](https://cloud.walletconnect.com/) integration | Required | - | `<your-secret>` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `https://core.poa.network` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_NAME | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `Gnosis Chain` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_ID | `number` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | -  | `99` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `Ether` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `ETH` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | - | `18` | `6` | v1.0.x+ |

&nbsp;

### Banner ads

This feature is **enabled by default** with the `slise` ads provider. To switch it off pass `NEXT_PUBLIC_AD_BANNER_PROVIDER=none`.
*Note* that the `getit` ad provider is temporary disabled.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_BANNER_PROVIDER | `slise` \| `adbutler` \| `coinzilla` \|  `hype` \| `getit` \| `none` | Ads provider  | - | `slise` | `coinzilla` | v1.0.x+ |
| NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER | `adbutler` | Additional ads provider to mix with the main one | - | - | `adbutler` | v1.28.0+ |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP | `{ id: string; width: string; height: string }` | Placement config for desktop Adbutler banner | - | - | `{'id':'123456','width':'728','height':'90'}` | v1.3.0+ |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE | `{ id: string; width: number; height: number }` | Placement config for mobile Adbutler banner | - | - | `{'id':'654321','width':'300','height':'100'}` | v1.3.0+ |

&nbsp;

### Text ads

This feature is **enabled by default** with the `coinzilla` ads provider. To switch it off pass `NEXT_PUBLIC_AD_TEXT_PROVIDER=none`.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_TEXT_PROVIDER | `coinzilla` \| `none` | Ads provider | - | `coinzilla` | `none` | v1.0.x+ |

&nbsp;

### Beacon chain

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_BEACON_CHAIN | `boolean` | Set to true for networks with the beacon chain | Required | - | `true` | v1.0.x+ |
| NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL | `string` | Beacon network currency symbol | - | `NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL` | `ETH` | v1.0.x+ |

&nbsp;

### User operations (ERC-4337)

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_USER_OPS | `boolean` | Set to true to show user operations related data and pages | - | - | `true` | v1.23.0+ |

&nbsp;

### Rollup chain

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ROLLUP_TYPE | `'optimistic' \| 'arbitrum' \| 'shibarium' \| 'zkEvm' \| 'zkSync' ` | Rollup chain type | Required | - | `'optimistic'` | v1.24.0+ |
| NEXT_PUBLIC_ROLLUP_L1_BASE_URL | `string` | Blockscout base URL for L1 network | Required | - | `'http://eth-goerli.blockscout.com'` | v1.24.0+ |
| NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL | `string` | URL for L2 -> L1 withdrawals (Optimistic stack only) | Required for `optimistic` rollups | - | `https://app.optimism.io/bridge/withdraw` | v1.24.0+ |
| NEXT_PUBLIC_FAULT_PROOF_ENABLED | `boolean` | Set to `true` for chains with fault proof system enabled (Optimistic stack only) | - | - | `true` | v1.31.0+ |
| NEXT_PUBLIC_HAS_MUD_FRAMEWORK | `boolean` | Set to `true` for instances that use MUD framework (Optimistic stack only) | - | - | `true` | v1.33.0+ |

&nbsp;

### Export data to CSV file

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | See [below](ENVS.md#google-recaptcha) | true | - | `<your-secret>` | v1.0.x+ |

&nbsp;

### Google analytics

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID | `string` | Property ID for [Google Analytics](https://analytics.google.com/) service | true | - | `UA-XXXXXX-X` | v1.0.x+ |

&nbsp;

### Mixpanel analytics

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN | `string` | Project token for [Mixpanel](https://mixpanel.com/) analytics service | true | - | `<your-secret>` | v1.1.0+ |

&nbsp;

### GrowthBook feature flagging and A/B testing

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY | `string` | Client SDK key for [GrowthBook](https://www.growthbook.io/) service | true | - | `<your-secret>` | v1.22.0+ |

&nbsp;

### GraphQL API documentation

This feature is **always enabled**, but you can disable it by passing `none` value to `NEXT_PUBLIC_GRAPHIQL_TRANSACTION` variable.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GRAPHIQL_TRANSACTION | `string` | Txn hash for default query at GraphQl playground page. Pass `none` to disable the feature. | - | - | `0x4a0ed8ddf751a7cb5297f827699117b0f6d21a0b2907594d300dc9fed75c7e62` | v1.0.x+ |

&nbsp;

### REST API documentation

This feature is **always enabled**, but you can disable it by passing `none` value to `NEXT_PUBLIC_API_SPEC_URL` variable.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_SPEC_URL | `string` | Spec to be displayed on `/api-docs` page. Pass `none` to disable the feature. | - | `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml` | `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml` | v1.0.x+ |

&nbsp;

### Marketplace

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MARKETPLACE_ENABLED | `boolean` | `true` means that the marketplace page will be enabled | Required | - | `true` | v1.24.1+ |
| NEXT_PUBLIC_MARKETPLACE_CONFIG_URL | `string` | URL of configuration file (`.json` format only) which contains list of apps that will be shown on the marketplace page. See [below](#marketplace-app-configuration-properties) list of available properties for an app. Can be replaced with NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | Required | - | `https://example.com/marketplace_config.json` | v1.0.x+ |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url. Can be used instead of NEXT_PUBLIC_MARKETPLACE_CONFIG_URL | - | - | `https://admin-rs.services.blockscout.com` | v1.1.0+ |
| NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM | `string` | Link to form where authors can submit their dapps to the marketplace | Required | - | `https://airtable.com/shrqUAcjgGJ4jU88C` | v1.0.x+ |
| NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM | `string` | Link to form where users can suggest ideas for the marketplace | - | - | `https://airtable.com/appiy5yijZpMMSKjT/pag3t82DUCyhGRZZO/form` | v1.24.0+ |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `https://core.poa.network` | v1.0.x+ |
| NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL | `string` | URL of configuration file (`.json` format only) which contains the list of categories to be displayed on the marketplace page in the specified order. If no URL is provided, then the list of categories will be compiled based on the `categories` fields from the marketplace (apps) configuration file | - | - | `https://example.com/marketplace_categories.json` | v1.23.0+ |
| NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL | `string` | URL of configuration file (`.json` format only) which contains app security reports for displaying security scores on the Marketplace page | - | - | `https://example.com/marketplace_security_reports.json` | v1.28.0+ |
| NEXT_PUBLIC_MARKETPLACE_FEATURED_APP | `string` | ID of the featured application to be displayed on the banner on the Marketplace page | - | - | `uniswap` | v1.29.0+ |
| NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL | `string` | URL of the banner HTML content | - | - | `https://example.com/banner` | v1.29.0+ |
| NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL | `string` | URL of the page the banner leads to | - | - | `https://example.com` | v1.29.0+ |
| NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_API_KEY | `string` | Airtable API key | - | - | - | v1.33.0+ |
| NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_BASE_ID | `string` | Airtable base ID with dapp ratings | - | - | - | v1.33.0+ |

#### Marketplace app configuration properties

| Property | Type | Description | Compulsoriness | Example value |
| --- | --- | --- | --- | --- |
| id | `string` | Used as slug for the app. Must be unique in the app list. | Required | `'app'` |
| external | `boolean` | `true` means that the application opens in a new window, but not in an iframe. | - | `true` |
| title | `string` | Displayed title of the app. | Required | `'The App'` |
| logo | `string` | URL to logo file. Should be at least 288x288. | Required | `'https://foo.app/icon.png'` |
| shortDescription | `string` | Displayed only in the app list. | Required | `'Awesome app'` |
| categories | `Array<string>` | Displayed category. | Required | `['Security', 'Tools']` |
| author | `string` | Displayed author of the app | Required | `'Bob'` |
| url | `string` | URL of the app which will be launched in the iframe. | Required | `'https://foo.app/launch'` |
| description | `string` | Displayed only in the modal dialog with additional info about the app. | Required | `'The best app'` |
| site | `string` | Displayed site link | - | `'https://blockscout.com'` |
| twitter | `string` | Displayed twitter link | - | `'https://twitter.com/blockscoutcom'` |
| telegram | `string`  | Displayed telegram link | - | `'https://t.me/poa_network'` |
| github | `string` | Displayed github link | - | `'https://github.com/blockscout'` |
| internalWallet | `boolean` | `true` means that the application can automatically connect to the Blockscout wallet. | - | `true` |
| priority | `number` | The higher the priority, the higher the app will appear in the list on the Marketplace page. | - | `7` |

&nbsp;

### Solidity to UML diagrams

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VISUALIZE_API_HOST | `string` | Visualize API endpoint url | Required | - | `https://visualizer.services.blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_VISUALIZE_API_BASE_PATH | `string` | Base path for Visualize API endpoint url | - | - | `/poa/core` | v1.29.0+ |

&nbsp;

### Blockchain statistics

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_STATS_API_HOST | `string` | Stats API endpoint url | Required | - | `https://stats.services.blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_STATS_API_BASE_PATH | `string` | Base path for Stats API endpoint url | - | - | `/poa/core` | v1.29.0+ |

&nbsp;

### Web3 wallet integration (add token or network to the wallet)

This feature is **enabled by default** with the `['metamask']` value. To switch it off pass `NEXT_PUBLIC_WEB3_WALLETS=none`.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WEB3_WALLETS | `Array<'metamask' \| 'coinbase' \| 'token_pocket'>` | Array of Web3 wallets which will be used  to add tokens or chain to. The first wallet which is enabled in user's browser will be shown. | - | `[ 'metamask' ]` | `[ 'coinbase' ]` | v1.10.0+ |
| NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET | `boolean`| Set to `true` to hide icon "Add to your wallet" next to token addresses | - | - | `true` | v1.0.x+ |

&nbsp;

### Transaction interpretation

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER | `blockscout` \| `noves` \| `none` | Transaction interpretation provider that displays human readable transaction description | - | `none` | `blockscout` | v1.21.0+ |

&nbsp;

### Verified tokens info

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | Required | - | `https://contracts-info.services.blockscout.com` | v1.0.x+ |

&nbsp;

### Name service integration

This feature allows resolving blockchain addresses using human-readable domain names.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NAME_SERVICE_API_HOST | `string` | Name Service API endpoint url | Required | - | `https://bens.services.blockscout.com` | v1.22.0+ |

&nbsp;

### Metadata service integration

This feature allows name tags and other public tags for addresses.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_METADATA_SERVICE_API_HOST | `string` | Metadata Service API endpoint url | Required | - | `https://metadata.services.blockscout.com` | v1.30.0+ |

&nbsp;

### Public tag submission

This feature allows you to submit an application with a public address tag.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_METADATA_SERVICE_API_HOST | `string` | Metadata Service API endpoint url | Required | - | `https://metadata.services.blockscout.com` | v1.30.0+ |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url | Required | - | `https://admin-rs.services.blockscout.com` | v1.1.0+ |

&nbsp;

### Data Availability

This feature enables views related to blob transactions (EIP-4844), such as the Blob Txns tab on the Transactions page and the Blob details page.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED | `boolean` | Set to true to enable blob transactions views. | Required | - | `true` | v1.28.0+ |

&nbsp;

### Bridged tokens

This feature allows users to view tokens that have been bridged from other EVM chains. Additional tab "Bridged" will be added to the tokens page and the link to original token will be displayed on the token page.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS | `Array<BridgedTokenChain>` where `BridgedTokenChain` can have following [properties](#bridged-token-chain-configuration-properties) | Used for displaying filter by the chain from which token where bridged. Also, used for creating links to original tokens in other explorers. | Required | - | `[{'id':'1','title':'Ethereum','short_title':'ETH','base_url':'https://eth.blockscout.com/token'}]` | v1.14.0+ |
| NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES | `Array<TokenBridge>` where `TokenBridge` can have following [properties](#token-bridge-configuration-properties) | Used for displaying text about bridges types on the tokens page. | Required | - | `[{'type':'omni','title':'OmniBridge','short_title':'OMNI'}]` | v1.14.0+ |

#### Bridged token chain configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| id | `string` | Base chain id, see [https://chainlist.org](https://chainlist.org) for the reference | Required | - | `1` |
| title | `string` | Displayed name of the chain | Required | - | `Ethereum` |
| short_title | `string` | Used for displaying chain name in the list view as tag | Required | - | `ETH` |
| base_url | `string` | Base url to original token in base chain explorer | Required | - | `https://eth.blockscout.com/token` |

*Note* The url to original token will be constructed as `<base_url>/<token_hash>`, e.g `https://eth.blockscout.com/token/<token_hash>`

#### Token bridge configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| type | `string` | Bridge type; should be matched to `bridge_type` field in API response | Required | - | `omni` |
| title | `string` | Bridge title | Required | - | `OmniBridge` |
| short_title | `string` | Bridge short title for displaying in the tags | Required | - | `OMNI` |

&nbsp;

### Safe{Core} address tags

For the smart contract addresses which are [Safe{Core} accounts](https://safe.global/) public tag "Multisig: Safe" will be displayed in the address page header alongside to Safe logo.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SAFE_TX_SERVICE_URL | `string` | The Safe transaction service URL. See full list of supported networks [here](https://docs.safe.global/api-supported-networks). | - | - | `uniswap` | v1.26.0+ |

&nbsp;

### Address profile API

This feature allows the integration of an external API to fetch user info for addresses or contracts. When configured, if the API returns a username, a public tag with a custom link will be displayed in the address page header.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ADDRESS_USERNAME_TAG | `{api_url: string; tag_link_template: string; tag_icon: string; tag_bg_color: string; tag_text_color: string}` | Address profile API tag configuration properties. See [below](#user-profile-api-configuration-properties). | - | - | `uniswap` | v1.35.0+ |

&nbsp;

#### Address profile API configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| api_url_template | `string` | User profile API URL. Should be a template with `{address}` variable | Required | - | `https://example-api.com/{address}` |
| tag_link_template | `string` | External link to the profile. Should be a template with `{username}` variable | - | - | `https://example.com/{address}` |
| tag_icon | `string` | Public tag icon (.svg) url | - | - | `https://example.com/icon.svg` |
| tag_bg_color | `string` | Public tag background color (escape "#" symbol if you use HEX color codes or use rgba-value instead) | - | - | `\#000000` |
| tag_text_color | `string` | Public tag text color (escape "#" symbol if you use HEX color codes or use rgba-value instead) | - | - | `\#FFFFFF` |

&nbsp;

### SUAVE chain

For blockchains that implement SUAVE architecture additional fields will be shown on the transaction page ("Allowed peekers", "Kettle"). Users also will be able to see the list of all transactions for a particular Kettle in the separate view.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_SUAVE_CHAIN | `boolean` | Set to true for blockchains with [SUAVE architecture](https://writings.flashbots.net/mevm-suave-centauri-and-beyond) | Required | - | `true` | v1.14.0+ |

&nbsp;

### MetaSuites extension

Enables [MetaSuites browser extension](https://github.com/blocksecteam/metasuites) to integrate with the app views.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_METASUITES_ENABLED | `boolean` | Set to true to enable integration | Required | - | `true` | v1.26.0+ |

&nbsp;

### Validators list

The feature enables the Validators page which provides detailed information about the validators of the PoS chains.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE | `'stability' \| 'blackfort'` | Chain type | Required | - | `'stability'` | v1.25.0+ |

&nbsp;

### Sentry error monitoring

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SENTRY_DSN | `string` | Client key for your Sentry.io app | Required | - | `<your-secret>` | v1.0.x+ |
| SENTRY_CSP_REPORT_URI | `string` | URL for sending CSP-reports to your Sentry.io app | - | - | `<your-secret>` | v1.0.x+ |
| NEXT_PUBLIC_SENTRY_ENABLE_TRACING | `boolean` | Enables tracing and performance monitoring in Sentry.io | - | `false` | `true` | v1.17.0+ |
| NEXT_PUBLIC_APP_ENV | `string` | App env (e.g development, review or production). Passed as `environment` property to Sentry config | - | `production` | `production` | v1.0.x+ |
| NEXT_PUBLIC_APP_INSTANCE | `string` | Name of app instance. Used as custom tag `app_instance` value in the main Sentry scope. If not provided, it will be constructed from `NEXT_PUBLIC_APP_HOST` | - | - | `wonderful_kepler` | v1.0.x+ |

&nbsp;

### OpenTelemetry

OpenTelemetry SDK for Node.js app could be enabled by passing `OTEL_SDK_ENABLED=true` variable. Configure the OpenTelemetry Protocol Exporter by using the generic environment variables described in the [OT docs](https://opentelemetry.io/docs/specs/otel/protocol/exporter/#configuration-options). Note that this Next.js feature is currently experimental. The Docker image should be built with the `NEXT_OPEN_TELEMETRY_ENABLED=true` argument to enable it.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| OTEL_SDK_ENABLED | `boolean` | Run-time flag to enable the feature | Required | `false` | `true` | v1.18.0+ |

&nbsp;

### DeFi dropdown

If the feature is enabled, a single button or a dropdown (if more than 1 item is provided) will be displayed at the top of the explorer page, which will take a user to the specified application in the marketplace or to an external site.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS | `[{ text: string; icon: string; dappId?: string, url?: string }]` | An array of dropdown items containing the button text, icon name and dappId in DAppscout or an external url | - | - | `[{'text':'Swap','icon':'swap','dappId':'uniswap'},{'text':'Payment link','icon':'payment_link','dappId':'peanut-protocol'}]` | v1.31.0+ |

&nbsp;

### Multichain balance button

If the feature is enabled, a Multichain balance button will be displayed on the address page, which will take you to the portfolio application in the marketplace or to an external site.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG | `{ name: string; url_template: string; dapp_id?: string; logo?: string }` | Multichain portfolio application config See [below](#multichain-button-configuration-properties) | - | - | `{ name: 'zerion', url_template: 'https://app.zerion.io/{address}/overview', logo: 'https://example.com/icon.svg'` | v1.31.0+ |

&nbsp;

#### Multichain button configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Multichain portfolio application name | Required | - | `zerion` |
| url_template | `string` | Url template to the portfolio. Should be a template with `{address}` variable | Required | - | `https://app.zerion.io/{address}/overview` |
| dapp_id | `string` | Set for open a Blockscout dapp page with the portfolio instead of opening external app page | - | - | `zerion` |
| logo | `string` | Multichain portfolio application logo (.svg) url | - | - | `https://example.com/icon.svg` |

&nbsp;

### Get gas button

If the feature is enabled, a Get gas button will be displayed in the top bar, which will take you to the gas refuel application in the marketplace or to an external site.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG | `{ name: string; url_template: string; dapp_id?: string; logo?: string }` | Get gas button config. See [below](#get-gas-button-configuration-properties) | - | - | `{ name: 'Need gas?', dapp_id: 'smol-refuel', url_template: 'https://smolrefuel.com/?outboundChain={chainId}', logo: 'https://example.com/icon.png' }` | v1.33.0+ |

&nbsp;

#### Get gas button configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Text on the button | Required | - | `Need gas?` |
| url_template | `string` | Url template, may contain `{chainId}` variable | Required | - | `https://smolrefuel.com/?outboundChain={chainId}` |
| dapp_id | `string` | Set for open a Blockscout dapp page instead of opening external app page | - | - | `smol-refuel` |
| logo | `string` | Gas refuel application logo url | - | - | `https://example.com/icon.png` |

&nbsp;

### Save on gas with GasHawk

The feature enables a "Save with GasHawk" button next to the "Gas used" value on the address page.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SAVE_ON_GAS_ENABLED | `boolean` | Set to "true" to enable the feature | - | - | `true` | v1.35.0+ |

&nbsp;

## External services configuration

### Google ReCaptcha

For obtaining the variables values please refer to [reCAPTCHA documentation](https://developers.google.com/recaptcha).

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | Site key | - | - | `<your-secret>` | v1.0.x+ |
