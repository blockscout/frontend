# Run-time environment variables

The app instance could be customized by passing following variables to NodeJS environment at run-time. See their list below.

**IMPORTANT NOTE!** For _production_ build purposes all json-like values should be single-quoted. If it contains a hash (`#`) or a dollar-sign (`$`) the whole value should be wrapped in single quotes as well (see `dotenv` [readme](https://github.com/bkeepers/dotenv#variable-substitution) for the reference)

## Table of contents
- [App configuration](ENVS.md#app-configuration)
- [Blockchain parameters](ENVS.md#blockchain-parameters)
- [API configuration](ENVS.md#api-configuration)
- [UI configuration](ENVS.md#ui-configuration)
  - [Homepage](ENVS.md#homepage)
  - [Sidebar](ENVS.md#sidebar)
  - [Footer](ENVS.md#footer)
  - [Misc](ENVS.md#misc)
- [App features](ENVS.md#app-features)
  - [My account](ENVS.md#my-account)
  - [Address verification](ENVS.md#address-verification-in-my-account) in "My account"
  - [Blockchain interaction](ENVS.md#blockchain-interaction-writing-to-contract-etc) (writing to contract, etc.)
  - [Banner ads](ENVS.md#banner-ads)
  - [Text ads](ENVS.md#text-ads)
  - [Beacon chain](ENVS.md#beacon-chain)
  - [Rollup (L2) chain](ENVS.md#rollup-l2-chain)
  - [Export data to CSV file](ENVS.md#export-data-to-csv-file)
  - [Google analytics](ENVS.md#google-analytics)
  - [Mixpanel analytics](ENVS.md#mixpanel-analytics)
  - [GraphQL API documentation](ENVS.md#graphql-api-documentation)
  - [REST API documentation](ENVS.md#rest-api-documentation)
  - [Marketplace](ENVS.md#marketplace)
  - [Solidity to UML diagrams](ENVS.md#solidity-to-uml-diagrams)
  - [Blockchain statistics](ENVS.md#blockchain-statistics)
  - [Web3 wallet integration](ENVS.md#web3-wallet-integration-add-token-or-network-to-the-wallet) (add token or network to the wallet)
  - [Verified tokens info](ENVS.md#verified-tokens-info)
  - [Sentry error monitoring](ENVS.md#sentry-error-monitoring)
- 3rd party services configuration

## App configuration

| Variable | Type| Description | Is required | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_APP_PROTOCOL | `http \| https` | App url schema | - | `https` | `http` |
| NEXT_PUBLIC_APP_HOST | `string` | App host | yes | - | `blockscout.com` |
| NEXT_PUBLIC_APP_PORT | `number` | Port where app is running | - | `3000` | `3001` |
| NEXT_PUBLIC_USE_NEXT_JS_PROXY | `boolean` | Tells the app to proxy all APIs request through the NextJs app. **We strongly advise not to use it in the production environment** | - | `false` | `true` |

## Blockchain parameters

// TODO @tom2drum rename required/optional

| Variable | Type| Description | Is required | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_NAME | `string` | Displayed name of the network | yes | - | `Gnosis Chain` |
| NEXT_PUBLIC_NETWORK_SHORT_NAME | `string` | Used for SEO attributes (page description) | - | -  | `OoG` |
| NEXT_PUBLIC_NETWORK_ID | `number` | Chain id, see [https://chainlist.org](https://chainlist.org) for the reference | yes | -  | `99` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | Chain server RPC url, see [https://chainlist.org](https://chainlist.org) for the reference | - | - | `https://core.poa.network` |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | Network currency name | - | - | `Ether` |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | Network currency symbol | - | - | `ETH` |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | Network currency decimals | - | `18` | `6` |
| NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS | `string` | Address of network's native token | - | - | `0x029a799563238d0e75e20be2f4bda0ea68d00172` |
| NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE | `validation` or `mining` | Verification type in the network | - | `mining` | `validation` |
| NEXT_PUBLIC_IS_TESTNET | `boolean`| Set to true if network is testnet | - | `false` | `true` |

## API configuration

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_PROTOCOL | `http \| https` | Main API protocol | - | `https` | `http` |
| NEXT_PUBLIC_API_HOST | `string` | Main API host | yes | - | `blockscout.com` |
| NEXT_PUBLIC_API_PORT | `number` | Port where API is running on the host | - | - | `3001` |
| NEXT_PUBLIC_API_BASE_PATH | `string` | Base path for Main API endpoint url | - | - | `/poa/core` |
| NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL | `ws \| wss` | Main API websocket protocol | - | `wss` | `ws` |

## UI configuration

### Homepage

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HOMEPAGE_CHARTS | `Array<'daily_txs' \| 'coin_price' \| 'market_cap'>` | List of charts displayed on the home page | - | - | `['daily_txs','coin_price','market_cap']` |
| NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR | `string` | Text color of the hero plate on the homepage (escape "#" symbol if you use HEX color codes) | - | `white` | `\#DCFE76` |
| NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND | `string` | Background css value for hero plate on the homepage (escape "#" symbol if you use HEX color codes) | - | `radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)` | `radial-gradient(at 15% 86%, hsla(350,65%,70%,1) 0px, transparent 50%)` \| `no-repeat bottom 20% right 0px/100% url(https://placekitten/1400/200)` |
| NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER | `boolean` | Set to false if network doesn't have gas tracker | - | `true` | `false` |
| NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME | `boolean` | Set to false if average block time is useless for the network | - | `true` | `false` |

### Sidebar

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_LOGO | `string` | Network logo; if not provided, placeholder will be shown; *Note* the logo height should be 20px and width less than 120px | - | - | `https://placekitten.com/240/40` |
| NEXT_PUBLIC_NETWORK_LOGO_DARK | `string` | Network logo for dark color mode; if not provided, **inverted** regular logo will be used instead | - | - | `https://placekitten.com/240/40` |
| NEXT_PUBLIC_NETWORK_ICON | `string` | Network icon; used as a replacement for regular network logo when nav bar is collapsed; if not provided, placeholder will be shown; *Note* the icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` |
| NEXT_PUBLIC_NETWORK_ICON_DARK | `string` | Network icon for dark color mode; if not provided, **inverted** regular icon will be used instead | - | - | `https://placekitten.com/60/60` |
| NEXT_PUBLIC_FEATURED_NETWORKS | `string` | URL of configuration file (`.json` format only) which contains list of featured networks that will be shown in the network menu. See [below](#featured-network-configuration-properties) list of available properties for particular network | - | - | `https://example.com/featured_networks_config.json` |
| NEXT_PUBLIC_OTHER_LINKS | `Array<{url: string; text: string}>` | List of links for the "Other" navigation menu | - | - | `[{'url':'https://blockscout.com','text':'Blockscout'}]` |

#### Featured network configuration properties

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the network | yes | - | `Gnosis Chain` |
| url | `string` | Network explorer main page url | yes | - | `https://blockscout.com/xdai/mainnet` |
| group | `Mainnets \| Testnets \| Other` | Indicates in which tab network appears in the menu | yes | - | `Mainnets` |
| icon | `string` | Network icon; if not provided, the common placeholder will be shown; *Note* that icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` |
| isActive | `boolean` | Pass `true` if item should be shonw as active in the menu | - | - | `true` |
| invertIconInDarkMode | `boolean` | Pass `true` if icon colors should be inverted in dark mode | - | - | `true` |

### Footer

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FOOTER_LINKS | `string` | URL of configuration file (`.json` format only) which contains list of link groups to be displayed in the footer. See [below](#footer-links-configuration-properties) list of available properties for particular group | - | - | `https://example.com/footer_links_config.json` |

The app version shown in the footer is derived from build-time ENV variables `NEXT_PUBLIC_GIT_TAG` and `NEXT_PUBLIC_GIT_COMMIT_SHA` and cannot be overwritten at run-time.

#### Footer links configuration properties

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Title of link group | yes | - | `Company` |
| links | `Array<{'text':string;'url':string;}>` | list of links | yes | - | `[{'text':'Homepage','url':'https://www.blockscout.com'}]` |

### Misc

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_EXPLORERS | `Array<NetworkExplorer>` where `NetworkExplorer` can have following [properties](#network-explorer-configuration-properties) | Used to build up links to transactions, blocks, addresses in other chain explorers. | - | - | `[{'title':'Anyblock','baseUrl':'https://explorer.anyblock.tools','paths':{'tx':'/ethereum/poa/core/tx'}}]` |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT | `boolean` | Set to `true` to hide indexing alert, if the chain indexing isn't completed | - | `false` | `true` |

#### Network explorer configuration properties

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the explorer | yes | - | `Anyblock` |
| baseUrl | `string` | Base url of the explorer | yes | - | `https://explorer.anyblock.tools` |
| paths | `Record<'tx' \| 'block' \| 'address' \| 'token', string>` | Map of explorer entities and their paths | yes | - | `{'tx':'/ethereum/poa/core/tx'}` |

*Note* The url of an entity will be constructed as `<baseUrl><paths[<entity-type>]><entity-id>`, e.g `https://explorer.anyblock.tools/ethereum/poa/core/tx/<tx-id>`

## App features

*Note* The variables which are marked as required should be passed as described in order to enable the particular feature, but there are not required in the whole app context.

### My account

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED | `boolean` | Set to true if network has account feature | yes | - | `true` |
| NEXT_PUBLIC_AUTH0_CLIENT_ID | `string` | Client id for [Auth0](https://auth0.com/) provider | yes | - | `<your-secret>` |
| NEXT_PUBLIC_AUTH_URL | `string` | Account auth base url; it is used for building login URL (`${ NEXT_PUBLIC_AUTH_URL }/auth/auth0`) and logout return URL (`${ NEXT_PUBLIC_AUTH_URL }/auth/logout`); if not provided the base app URL will be used instead | yes | - | `https://blockscout.com` |
| NEXT_PUBLIC_LOGOUT_URL | `string` | Account logout url. Required if account is supported for the app instance. | yes | - | `https://blockscoutcom.us.auth0.com/v2/logout` |

### Address verification in "My account"

*Note* all ENV variables required for [My account](ENVS.md#my-account) feature should be passed along side with the following ones:

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | yes | - | `https://contracts-info.services.blockscout.com` |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url | yes | - | `https://admin-rs.services.blockscout.com` |

### Blockchain interaction (writing to contract, etc.)

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID | `string` | Project id for [WalletConnect](https://docs.walletconnect.com/2.0/web3modal/react/installation#obtain-project-id) integration | yes | - | `<your-secret>` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | yes | - | `https://core.poa.network` |

### Banner ads

This feature is **enabled by default** with the `slise` ads provider. To switch it off pass `NEXT_PUBLIC_AD_BANNER_PROVIDER=none`.

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_BANNER_PROVIDER | `slise` \| `adbutler` \| `coinzilla` \| `none` | Ads provider  | - | `slise` | `coinzilla` |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP | `{ id: string; width: string; height: string }` | Placement config for desktop Adbutler banner | - | - | `{'id':'123456','width':'728','height':'90'}` |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE | `{ id: string; width: number; height: number }` | Placement config for mobile Adbutler banner | - | - | `{'id':'654321','width':'300','height':'100'}` |

### Text ads

This feature is **enabled by default** with the `coinzilla` ads provider. To switch it off pass `NEXT_PUBLIC_AD_TEXT_PROVIDER=none`.

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_TEXT_PROVIDER | `coinzilla` \| `none` | Ads provider | - | `coinzilla` | `none` |

### Beacon chain

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_BEACON_CHAIN | `boolean` | Set to true for networks with the beacon chain | yes | - | `true` |
| NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL | `string` | Beacon network currency symbol | - | `NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL` | `ETH` |

### Rollup (L2) chain

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_L2_NETWORK | `boolean` | Set to true for L2 solutions | yes | - | `true` |
| NEXT_PUBLIC_L1_BASE_URL | `string` | Blockscout base URL for L1 network | yes | - | `'http://eth-goerli.blockscout.com'` |
| NEXT_PUBLIC_L2_WITHDRAWAL_URL | `string` | URL for L2 -> L1 withdrawals | yes | - | `https://app.optimism.io/bridge/withdraw` |

### Export data to CSV file

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | See [below](ENVS.md#google-recaptcha) | true | - | `<your-secret>` |

### Google analytics

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID | `string` | Property ID for [Google Analytics](https://analytics.google.com/) service | true | - | `UA-XXXXXX-X` |

### Mixpanel analytics

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN | `string` | Project token for [Mixpanel](https://mixpanel.com/) analytics service | true | - | `<your-secret>` |

### GraphQL API documentation

This feature is **always enabled**, but you can configure its behavior by passing the following variables.

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GRAPHIQL_TRANSACTION | `string` | Txn hash for default query at GraphQl playground page | - | - | `0x4a0ed8ddf751a7cb5297f827699117b0f6d21a0b2907594d300dc9fed75c7e62` |

### REST API documentation

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_SPEC_URL | `string` | Spec to be displayed on api-docs page | yes | - | `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml` |

### Marketplace

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MARKETPLACE_CONFIG_URL | `string` | URL of configuration file (`.json` format only) which contains list of apps that will be shown on the marketplace page. See [below](#marketplace-app-configuration-properties) list of available properties for an app | yes | - | `https://example.com/marketplace_config.json` |
| NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM | `string` | Link to form where authors can submit their dapps to the marketplace | yes | - | `https://airtable.com/shrqUAcjgGJ4jU88C` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | See in [Blockchain parameters](ENVS.md#blockchain-parameters) section | yes | - | `https://core.poa.network` |

#### Marketplace app configuration properties

| Property | Type | Description | Example value
| --- | --- | --- | --- |
| id | `string` | Used as slug for the app. Must be unique in the app list. | `'app'` |
| external | `boolean` | If true means that the application opens in a new window, but not in an iframe. | `true` |
| title | `string` | Displayed title of the app. | `'The App'` |
| logo | `string` | URL to logo file. Should be at least 288x288. | `'https://foo.app/icon.png'` |
| shortDescription | `string` | Displayed only in the app list. | `'Awesome app'` |
| categories | `Array<MarketplaceCategoryId>` | Displayed category. Select one of the following bellow. | `['security', 'tools']` |
| author | `string` | Displayed author of the app | `'Bob'` |
| url | `string` | URL of the app which will be launched in the iframe. | `'https://foo.app/launch'` |
| description | `string` | Displayed only in the modal dialog with additional info about the app. | `'The best app'` |
| site | `string` *(optional)* | Displayed site link | `'https://blockscout.com'` |
| twitter | `string` *(optional)* | Displayed twitter link | `'https://twitter.com/blockscoutcom'` |
| telegram | `string`  *(optional)* | Displayed telegram link | `'https://t.me/poa_network'` |
| github | `string` *(optional)* | Displayed github link | `'https://github.com/blockscout'` |

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

### Solidity to UML diagrams

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VISUALIZE_API_HOST | `string` | Visualize API endpoint url | yes | - | `https://visualizer.services.blockscout.com` |

### Blockchain statistics

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_STATS_API_HOST | `string` | API endpoint url | yes | - | `https://stats.services.blockscout.com` |

### Web3 wallet integration (add token or network to the wallet)

This feature is **enabled by default** with the `metamask` wallet type. To switch it off pass `NEXT_PUBLIC_WEB3_DEFAULT_WALLET=none`.

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WEB3_DEFAULT_WALLET | `metamask` \| `coinbase` \| `none` | Type of Web3 wallet which will be used by default to add tokens or chains to | - | `metamask` | `coinbase` |
| NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET | `boolean`| Set to `true` to hide icon "Add to your wallet" next to token addresses | - | - | `true` |

### Verified tokens info

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | yes | - | `https://contracts-info.services.blockscout.com` |

### Sentry error monitoring

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SENTRY_DSN | `string` | Client key for your Sentry.io app | yes | - | `<your-secret>` |
| SENTRY_CSP_REPORT_URI | `string` | URL for sending CSP-reports to your Sentry.io app | - | - | `<your-secret>` |
| NEXT_PUBLIC_APP_ENV | `string` | Current app env (e.g development, review or production). Passed as `environment` property to Sentry config | - | `process.env.NODE_ENV` | `production` |
| NEXT_PUBLIC_APP_INSTANCE | `string` | Name of app instance. Used as custom tag `app_instance` value in the main Sentry scope | - | - | `wonderful_kepler` |

## External services configuration

### Google ReCaptcha

For obtaining the variables values please refer to [reCAPTCHA documentation](https://developers.google.com/recaptcha).

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | Site key | - | - | `<your-secret>` |
