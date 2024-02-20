# Run-time environment variables

The app instance could be customized by passing following variables to NodeJS environment at run-time. See their list below.

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
  - [Sidebar](ENVS.md#sidebar)
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
  - [User operations](ENVS.md#user-operations-feature-erc-4337)
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
  - [Bridged tokens](ENVS.md#bridged-tokens)
  - [Safe{Core} address tags](ENVS.md#safecore-address-tags)
  - [SUAVE chain](ENVS.md#suave-chain)
  - [Sentry error monitoring](ENVS.md#sentry-error-monitoring)
  - [OpenTelemetry](ENVS.md#opentelemetry)
  - [Swap button](ENVS.md#swap-button)
- [3rd party services configuration](ENVS.md#external-services-configuration)

&nbsp;

## App configuration

| Variable | Type| Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_APP_PROTOCOL | `http \| https` | App url schema | - | `https` | `http` |
| NEXT_PUBLIC_APP_HOST | `string` | App host | Required | - | `blockscout.com` |
| NEXT_PUBLIC_APP_PORT | `number` | Port where app is running | - | `3000` | `3001` |
| NEXT_PUBLIC_USE_NEXT_JS_PROXY | `boolean` | Tells the app to proxy all APIs request through the NextJS app. **We strongly advise not to use it in the production environment**, since it can lead to performance issues of the NodeJS server | - | `false` | `true` |

&nbsp;

## Blockchain parameters

| Variable | Type| Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_NAME | `string` | Displayed name of the network | Required | - | `Gnosis Chain` |
| NEXT_PUBLIC_NETWORK_SHORT_NAME | `string` | Used for SEO attributes (e.g, page description) | - | -  | `OoG` |
| NEXT_PUBLIC_NETWORK_ID | `number` | Chain id, see [https://chainlist.org](https://chainlist.org) for the reference | Required | -  | `99` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | Chain public RPC server url, see [https://chainlist.org](https://chainlist.org) for the reference | - | - | `https://core.poa.network` |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | Network currency name | - | - | `Ether` |
| NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME | `string` | Name of network currency subdenomination | - | `wei` | `duck` |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | Network currency symbol | - | - | `ETH` |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | Network currency decimals | - | `18` | `6` |
| NEXT_PUBLIC_NETWORK_GOVERNANCE_TOKEN_SYMBOL | `string` | Network governance token symbol | - | - | `GNO` |
| NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE | `validation` or `mining` | Verification type in the network | - | `mining` | `validation` |
| NEXT_PUBLIC_IS_TESTNET | `boolean`| Set to true if network is testnet | - | `false` | `true` |

&nbsp;

## API configuration

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_PROTOCOL | `http \| https` | Main API protocol | - | `https` | `http` |
| NEXT_PUBLIC_API_HOST | `string` | Main API host | Required | - | `blockscout.com` |
| NEXT_PUBLIC_API_PORT | `number` | Port where API is running on the host | - | - | `3001` |
| NEXT_PUBLIC_API_BASE_PATH | `string` | Base path for Main API endpoint url | - | - | `/poa/core` |
| NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL | `ws \| wss` | Main API websocket protocol | - | `wss` | `ws` |

&nbsp;

## UI configuration

### Homepage

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HOMEPAGE_CHARTS | `Array<'daily_txs' \| 'coin_price' \| 'market_cap' \| 'tvl'>` | List of charts displayed on the home page | - | - | `['daily_txs','coin_price','market_cap']` |
| NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR | `string` | Text color of the hero plate on the homepage (escape "#" symbol if you use HEX color codes or use rgba-value instead) | - | `white` | `\#DCFE76` |
| NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND | `string` | Background css value for hero plate on the homepage (escape "#" symbol if you use HEX color codes or use rgba-value instead) | - | `radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)` | `radial-gradient(at 15% 86%, hsla(350,65%,70%,1) 0px, transparent 50%)` \| `no-repeat bottom 20% right 0px/100% url(https://placekitten/1400/200)` |
| NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME | `boolean` | Set to false if average block time is useless for the network | - | `true` | `false` |

&nbsp;

### Sidebar

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_LOGO | `string` | Network logo; if not provided, placeholder will be shown; *Note* the logo height should be 24px and width less than 120px | - | - | `https://placekitten.com/240/40` |
| NEXT_PUBLIC_NETWORK_LOGO_DARK | `string` | Network logo for dark color mode; if not provided, **inverted** regular logo will be used instead | - | - | `https://placekitten.com/240/40` |
| NEXT_PUBLIC_NETWORK_ICON | `string` | Network icon; used as a replacement for regular network logo when nav bar is collapsed; if not provided, placeholder will be shown; *Note* the icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` |
| NEXT_PUBLIC_NETWORK_ICON_DARK | `string` | Network icon for dark color mode; if not provided, **inverted** regular icon will be used instead | - | - | `https://placekitten.com/60/60` |
| NEXT_PUBLIC_FEATURED_NETWORKS | `string` | URL of configuration file (`.json` format only) which contains list of featured networks that will be shown in the network menu. See [below](#featured-network-configuration-properties) list of available properties for particular network | - | - | `https://example.com/featured_networks_config.json` |
| NEXT_PUBLIC_OTHER_LINKS | `Array<{url: string; text: string}>` | List of links for the "Other" navigation menu | - | - | `[{'url':'https://blockscout.com','text':'Blockscout'}]` |
| NEXT_PUBLIC_NAVIGATION_HIDDEN_LINKS | `Array<LinkId>` | List of external links hidden in the navigation. Supported ids are `eth_rpc_api`, `rpc_api` | - | - | `['eth_rpc_api']` |

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

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FOOTER_LINKS | `string` | URL of configuration file (`.json` format only) which contains list of link groups to be displayed in the footer. See [below](#footer-links-configuration-properties) list of available properties for particular group | - | - | `https://example.com/footer_links_config.json` |

The app version shown in the footer is derived from build-time ENV variables `NEXT_PUBLIC_GIT_TAG` and `NEXT_PUBLIC_GIT_COMMIT_SHA` and cannot be overwritten at run-time.

#### Footer links configuration properties

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Title of link group | Required | - | `Company` |
| links | `Array<{'text':string;'url':string;}>` | list of links | Required | - | `[{'text':'Homepage','url':'https://www.blockscout.com'}]` |

&nbsp;

### Favicon

By default, the app has generic favicon. You can override this behavior by providing the following variables. Hence, the favicon assets bundle will be generated at the container start time and will be used instead of default one.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| FAVICON_GENERATOR_API_KEY | `string` | RealFaviconGenerator [API key](https://realfavicongenerator.net/api/) | Required | - | `<your-secret>` |
| FAVICON_MASTER_URL | `string` | - | - | `NEXT_PUBLIC_NETWORK_ICON` | `https://placekitten.com/180/180` |

&nbsp;

### Meta

Settings for meta tags and OG tags

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE | `boolean` | Set to `true` to promote Blockscout in meta and OG titles | - | `true` | `true` |
| NEXT_PUBLIC_OG_DESCRIPTION | `string` | Custom OG description | - | - | `Blockscout is the #1 open-source blockchain explorer available today. 100+ chains and counting rely on Blockscout data availability, APIs, and ecosystem tools to support their networks.` |
| NEXT_PUBLIC_OG_IMAGE_URL | `string` | OG image url. Minimum image size is 200 x 20 pixels (recommended: 1200 x 600); maximum supported file size is 8 MB; 2:1 aspect ratio; supported formats: image/jpeg, image/gif, image/png | - | `static/og_placeholder.png` | `https://placekitten.com/1200/600` |

&nbsp;

### Views

#### Block views

| Variable | Type | Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS | `Array<BlockFieldId>` | Array of the block fields ids that should be hidden. See below the list of the possible id values. | - | - | `'["burnt_fees","total_reward"]'` |


##### Block fields list
| Id | Description |
| --- | --- |
| `burnt_fees` | Burnt fees |
| `total_reward` | Total block reward |
| `nonce` | Block nonce |
| `miner` | Address of block's miner or validator |

&nbsp;

#### Address views

| Variable | Type | Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE | `"github" \| "jazzicon" \| "gradient_avatar" \| "blockie"` | Style of address identicon appearance. Choose between [GitHub](https://github.blog/2013-08-14-identicons/), [Metamask Jazzicon](https://metamask.github.io/jazzicon/), [Gradient Avatar](https://github.com/varld/gradient-avatar) and [Ethereum Blocky](https://mycryptohq.github.io/ethereum-blockies-base64/) | - | `jazzicon` | `gradient_avatar` |
| NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS | `Array<AddressViewId>` | Address views that should not be displayed. See below the list of the possible id values.  | - | - | `'["top_accounts"]'` |
| NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED | `boolean` | Set to `true` if SolidityScan reports are supported | - | - | `true` |

##### Address views list
| Id | Description |
| --- | --- |
| `top_accounts` | Top accounts |

&nbsp;

#### Transaction views

| Variable | Type | Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS | `Array<TxFieldsId>` | Array of the transaction fields ids that should be hidden. See below the list of the possible id values. | - | - | `'["value","tx_fee"]'` |
| NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS | `Array<TxAdditionalFieldsId>` | Array of the additional fields ids that should be added to the transaction details. See below the list of the possible id values. | - | - | `'["fee_per_gas"]'` |

##### Transaction fields list
| Id | Description |
| --- | --- |
| `value` | Sent value |
| `fee_currency` | Fee currency |
| `gas_price` | Price per unit of gas |
| `tx_fee` | Total transaction fee |
| `gas_fees` | Gas fees breakdown |
| `burnt_fees` | Amount of native coin burnt for transaction |

##### Transaction additional fields list
| Id | Description |
| --- | --- |
| `fee_per_gas` | Amount of total fee divided by total amount of gas used by transaction |

&nbsp;

#### NFT views

| Variable | Type | Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES | `Array<NftMarketplace>` where `NftMarketplace` can have following [properties](#nft-marketplace-properties) | Used to build up links to NFT collections and NFT instances in external marketplaces. | - | - | `[{'name':'OpenSea','collection_url':'https://opensea.io/assets/ethereum/{hash}','instance_url':'https://opensea.io/assets/ethereum/{hash}/{id}','logo_url':'https://opensea.io/static/images/logos/opensea-logo.svg'}]` |


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

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_EXPLORERS | `Array<NetworkExplorer>` where `NetworkExplorer` can have following [properties](#network-explorer-configuration-properties) | Used to build up links to transactions, blocks, addresses in other chain explorers. | - | - | `[{'title':'Anyblock','baseUrl':'https://explorer.anyblock.tools','paths':{'tx':'/ethereum/poa/core/tx'}}]` |
| NEXT_PUBLIC_CONTRACT_CODE_IDES | `Array<ContractCodeIde>` where `ContractCodeIde` can have following [properties](#contract-code-ide-configuration-properties) | Used to build up links to IDEs with contract source code. | - | - | `[{'title':'Remix IDE','url':'https://remix.blockscout.com/?address={hash}&blockscout={domain}','icon_url':'https://example.com/icon.svg'}]` |
| NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS | `boolean` | Set to `true` to enable Submit Audit form on the contract page | - | `false` | `true` |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS | `boolean` | Set to `true` to hide indexing alert in the page header about indexing chain's blocks | - | `false` | `true` |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS | `boolean` | Set to `true` to hide indexing alert in the page footer about indexing block's internal transactions | - | `false` | `true` |
| NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE | `string` | Used for displaying custom announcements or alerts in the header of the site. Could be a regular string or a HTML code. | - | - | `Hello world! 🤪` |

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

&nbsp;

## App features

*Note* The variables which are marked as required should be passed as described in order to enable the particular feature, but they are not required in the whole app context.

### My account

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED | `boolean` | Set to true if network has account feature | Required | - | `true` |
| NEXT_PUBLIC_AUTH0_CLIENT_ID | `string` | Client id for [Auth0](https://auth0.com/) provider | Required | - | `<your-secret>` |
| NEXT_PUBLIC_AUTH_URL | `string` | Account auth base url; it is used for building login URL (`${ NEXT_PUBLIC_AUTH_URL }/auth/auth0`) and logout return URL (`${ NEXT_PUBLIC_AUTH_URL }/auth/logout`); if not provided the base app URL will be used instead | Required | - | `https://blockscout.com` |
| NEXT_PUBLIC_LOGOUT_URL | `string` | Account logout url. Required if account is supported for the app instance. | Required | - | `https://blockscoutcom.us.auth0.com/v2/logout` |

&nbsp;

### Gas tracker

This feature is **enabled by default**. To switch it off pass `NEXT_PUBLIC_GAS_TRACKER_ENABLED=false`.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GAS_TRACKER_ENABLED | `boolean` | Set to true to enable "Gas tracker" in the app | Required | `true` | `false` |
| NEXT_PUBLIC_GAS_TRACKER_UNITS | Array<`usd` \| `gwei`> | Array of units for displaying gas prices on the Gas Tracker page, in the stats snippet on the Home page, and in the top bar. The first value in the array will take priority over the second one in all mentioned views. If only one value is provided, gas prices will be displayed only in that unit. | - | `[ 'usd', 'gwei' ]` | `[ 'gwei' ]` |

&nbsp;

### Address verification in "My account"

*Note* all ENV variables required for [My account](ENVS.md#my-account) feature should be passed alongside the following ones:

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | Required | - | `https://contracts-info.services.blockscout.com` |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url | Required | - | `https://admin-rs.services.blockscout.com` |

&nbsp;

### Blockchain interaction (writing to contract, etc.)

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID | `string` | Project id for [WalletConnect](https://cloud.walletconnect.com/) integration | Required | - | `<your-secret>` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `https://core.poa.network` |
| NEXT_PUBLIC_NETWORK_NAME | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `Gnosis Chain` |
| NEXT_PUBLIC_NETWORK_ID | `number` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | -  | `99` |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `Ether` |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `ETH` |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | - | `18` | `6` |

&nbsp;

### Banner ads

This feature is **enabled by default** with the `slise` ads provider. To switch it off pass `NEXT_PUBLIC_AD_BANNER_PROVIDER=none`.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_BANNER_PROVIDER | `slise` \| `adbutler` \| `coinzilla` \|  `hype` \| `none` | Ads provider  | - | `slise` | `coinzilla` |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP | `{ id: string; width: string; height: string }` | Placement config for desktop Adbutler banner | - | - | `{'id':'123456','width':'728','height':'90'}` |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE | `{ id: string; width: number; height: number }` | Placement config for mobile Adbutler banner | - | - | `{'id':'654321','width':'300','height':'100'}` |

&nbsp;

### Text ads

This feature is **enabled by default** with the `coinzilla` ads provider. To switch it off pass `NEXT_PUBLIC_AD_TEXT_PROVIDER=none`.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_TEXT_PROVIDER | `coinzilla` \| `none` | Ads provider | - | `coinzilla` | `none` |

&nbsp;

### Beacon chain

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_BEACON_CHAIN | `boolean` | Set to true for networks with the beacon chain | Required | - | `true` |
| NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL | `string` | Beacon network currency symbol | - | `NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL` | `ETH` |

&nbsp;

### User operations feature (ERC-4337)

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_USER_OPS | `boolean` | Set to true to show user operations related data and pages | - | - | `true` |

&nbsp;

### Rollup chain

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ROLLUP_TYPE | `'optimistic' \| 'shibarium' \| 'zkEvm' ` | Rollup chain type | Required | - | `'optimistic'` |
| NEXT_PUBLIC_ROLLUP_L1_BASE_URL | `string` | Blockscout base URL for L1 network | Required | - | `'http://eth-goerli.blockscout.com'` |
| NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL | `string` | URL for L2 -> L1 withdrawals | - | - | `https://app.optimism.io/bridge/withdraw` |

&nbsp;

### Export data to CSV file

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | See [below](ENVS.md#google-recaptcha) | true | - | `<your-secret>` |

&nbsp;

### Google analytics

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID | `string` | Property ID for [Google Analytics](https://analytics.google.com/) service | true | - | `UA-XXXXXX-X` |

&nbsp;

### Mixpanel analytics

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN | `string` | Project token for [Mixpanel](https://mixpanel.com/) analytics service | true | - | `<your-secret>` |

&nbsp;

### GrowthBook feature flagging and A/B testing

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY | `string` | Client SDK key for [GrowthBook](https://www.growthbook.io/) service | true | - | `<your-secret>` |

&nbsp;

### GraphQL API documentation

This feature is **always enabled**, but you can configure its behavior by passing the following variables.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GRAPHIQL_TRANSACTION | `string` | Txn hash for default query at GraphQl playground page | - | - | `0x4a0ed8ddf751a7cb5297f827699117b0f6d21a0b2907594d300dc9fed75c7e62` |

&nbsp;

### REST API documentation

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_SPEC_URL | `string` | Spec to be displayed on `/api-docs` page | Required | `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml` | `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml` |

&nbsp;

### Marketplace

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MARKETPLACE_ENABLED | `boolean` | `true` means that the marketplace page will be enabled | - | - | `true` |
| NEXT_PUBLIC_MARKETPLACE_CONFIG_URL | `string` | URL of configuration file (`.json` format only) which contains list of apps that will be shown on the marketplace page. See [below](#marketplace-app-configuration-properties) list of available properties for an app. Can be replaced with NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | Required | - | `https://example.com/marketplace_config.json` |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url. Can be used instead of NEXT_PUBLIC_MARKETPLACE_CONFIG_URL | - | - | `https://admin-rs.services.blockscout.com` |
| NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM | `string` | Link to form where authors can submit their dapps to the marketplace | Required | - | `https://airtable.com/shrqUAcjgGJ4jU88C` |
| NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM | `string` | Link to form where users can suggest ideas for the marketplace | - | - | `https://airtable.com/appiy5yijZpMMSKjT/pag3t82DUCyhGRZZO/form` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | Required | - | `https://core.poa.network` |
| NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL | `string` | URL of configuration file (`.json` format only) which contains the list of categories to be displayed on the marketplace page in the specified order. If no URL is provided, then the list of categories will be compiled based on the `categories` fields from the marketplace (apps) configuration file | - | - | `https://example.com/marketplace_categories.json` |

#### Marketplace app configuration properties

| Property | Type | Description | Compulsoriness | Example value
| --- | --- | --- | --- | --- |
| id | `string` | Used as slug for the app. Must be unique in the app list. | Required | `'app'` |
| external | `boolean` | `true` means that the application opens in a new window, but not in an iframe. | - | `true` |
| title | `string` | Displayed title of the app. | Required | `'The App'` |
| logo | `string` | URL to logo file. Should be at least 288x288. | Required | `'https://foo.app/icon.png'` |
| shortDescription | `string` | Displayed only in the app list. | Required | `'Awesome app'` |
| categories | `Array<MarketplaceCategoryId>` | Displayed category. Select one of the following below. | Required | `['security', 'tools']` |
| author | `string` | Displayed author of the app | Required | `'Bob'` |
| url | `string` | URL of the app which will be launched in the iframe. | Required | `'https://foo.app/launch'` |
| description | `string` | Displayed only in the modal dialog with additional info about the app. | Required | `'The best app'` |
| site | `string` | Displayed site link | - | `'https://blockscout.com'` |
| twitter | `string` | Displayed twitter link | - | `'https://twitter.com/blockscoutcom'` |
| telegram | `string`  | Displayed telegram link | - | `'https://t.me/poa_network'` |
| github | `string` | Displayed github link | - | `'https://github.com/blockscout'` |
| internalWallet | `boolean` | `true` means that the application can automatically connect to the Blockscout wallet. | - | `true` |
| priority | `number` | The higher the priority, the higher the app will appear in the list on the Marketplace page. | - | `7` |

#### Marketplace categories ids

For each application, you need to specify the `MarketplaceCategoryId` to which it belongs. Select one of the following:

- `defi`
- `exchanges`
- `finance`
- `games`
- `marketplaces`
- `nft`
- `security`
- `social`
- `tools`
- `yieldFarming`

&nbsp;

### Solidity to UML diagrams

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VISUALIZE_API_HOST | `string` | Visualize API endpoint url | Required | - | `https://visualizer.services.blockscout.com` |

&nbsp;

### Blockchain statistics

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_STATS_API_HOST | `string` | API endpoint url | Required | - | `https://stats.services.blockscout.com` |

&nbsp;

### Web3 wallet integration (add token or network to the wallet)

This feature is **enabled by default** with the `['metamask']` value. To switch it off pass `NEXT_PUBLIC_WEB3_WALLETS=none`.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WEB3_WALLETS | `Array<'metamask' \| 'coinbase' \| 'token_pocket'>` | Array of Web3 wallets which will be used  to add tokens or chain to. The first wallet which is enabled in user's browser will be shown. | - | `[ 'metamask' ]` | `[ 'coinbase' ]` |
| NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET | `boolean`| Set to `true` to hide icon "Add to your wallet" next to token addresses | - | - | `true` |

&nbsp;

### Transaction interpretation

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER | `blockscout` \| `none` | Transaction interpretation provider that displays human readable transaction description | - | `none` | `blockscout` |

&nbsp;

### Verified tokens info

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | Required | - | `https://contracts-info.services.blockscout.com` |

&nbsp;

### Name service integration

This feature allows resolving blockchain addresses using human-readable domain names.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NAME_SERVICE_API_HOST | `string` | Name Service API endpoint url | Required | - | `https://bens.services.blockscout.com` |

&nbsp;

### Bridged tokens

This feature allows users to view tokens that have been bridged from other EVM chains. Additional tab "Bridged" will be added to the tokens page and the link to original token will be displayed on the token page.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS | `Array<BridgedTokenChain>` where `BridgedTokenChain` can have following [properties](#bridged-token-chain-configuration-properties) | Used for displaying filter by the chain from which token where bridged. Also, used for creating links to original tokens in other explorers. | Required | - | `[{'id':'1','title':'Ethereum','short_title':'ETH','base_url':'https://eth.blockscout.com/token'}]` |
| NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES | `Array<TokenBridge>` where `TokenBridge` can have following [properties](#token-bridge-configuration-properties) | Used for displaying text about bridges types on the tokens page. | Required | - | `[{'type':'omni','title':'OmniBridge','short_title':'OMNI'}]` |

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

For the smart contract addresses which are [Safe{Core} accounts](https://safe.global/) public tag "Multisig: Safe" will be displayed in the address page header alongside to Safe logo. The Safe service is available only for certain networks, see full list [here](https://docs.safe.global/safe-core-api/available-services). Based on provided value of `NEXT_PUBLIC_NETWORK_ID`, the feature will be enabled or disabled.

&nbsp;

### SUAVE chain

For blockchains that implement SUAVE architecture additional fields will be shown on the transaction page ("Allowed peekers", "Kettle"). Users also will be able to see the list of all transactions for a particular Kettle in the separate view.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_SUAVE_CHAIN | `boolean` | Set to true for blockchains with [SUAVE architecture](https://writings.flashbots.net/mevm-suave-centauri-and-beyond) | Required | - | `true` |

&nbsp;

### Validators list

The feature enables the Validators page which provides detailed information about the validators of the PoS chains.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE | `'stability'` | Chain type | Required | - | `'stability'` |

&nbsp;

### Sentry error monitoring

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SENTRY_DSN | `string` | Client key for your Sentry.io app | Required | - | `<your-secret>` |
| SENTRY_CSP_REPORT_URI | `string` | URL for sending CSP-reports to your Sentry.io app | - | - | `<your-secret>` |
| NEXT_PUBLIC_SENTRY_ENABLE_TRACING | `boolean` | Enables tracing and performance monitoring in Sentry.io | - | `false` | `true` |
| NEXT_PUBLIC_APP_ENV | `string` | App env (e.g development, review or production). Passed as `environment` property to Sentry config | - | `production` | `production` |
| NEXT_PUBLIC_APP_INSTANCE | `string` | Name of app instance. Used as custom tag `app_instance` value in the main Sentry scope. If not provided, it will be constructed from `NEXT_PUBLIC_APP_HOST` | - | - | `wonderful_kepler` |

&nbsp;

### OpenTelemetry

OpenTelemetry SDK for Node.js app could be enabled by passing `OTEL_SDK_ENABLED=true` variable. Configure the OpenTelemetry Protocol Exporter by using the generic environment variables described in the [OT docs](https://opentelemetry.io/docs/specs/otel/protocol/exporter/#configuration-options).

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| OTEL_SDK_ENABLED | `boolean` | Flag to enable the feature | Required | `false` | `true` |

&nbsp;

### Swap button

If the feature is enabled, a Swap button will be displayed at the top of the explorer page, which will take you to the specified application in the marketplace or to an external site.

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SWAP_BUTTON_URL | `string` | Application ID in the marketplace or website URL | - | - | `uniswap` |

&nbsp;

## External services configuration

### Google ReCaptcha

For obtaining the variables values please refer to [reCAPTCHA documentation](https://developers.google.com/recaptcha).

| Variable | Type| Description | Compulsoriness  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | Site key | - | - | `<your-secret>` |
