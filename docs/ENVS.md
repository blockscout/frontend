# Environment variables

The app instance could be customized by passing following variables to NodeJS environment at runtime. See their list below.

**IMPORTANT NOTE!** For _production_ build purposes all json-like values should be single-quoted. If it contains a hash (`#`) or a dollar-sign (`$`) the whole value should be wrapped in single quotes as well (see `dotenv` [readme](https://github.com/bkeepers/dotenv#variable-substitution))

## Network configuration

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_NAME | `string` | Displayed name of the network | yes | - | `Gnosis Chain` |
| NEXT_PUBLIC_NETWORK_SHORT_NAME | `string` | Used for SEO attributes (page title and description) | - | -  | `OoG` |
| NEXT_PUBLIC_NETWORK_ID | `number` | Chain id, see [https://chainlist.org](https://chainlist.org) for the reference | yes | -  | `99` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` | Chain server RPC url, see [https://chainlist.org](https://chainlist.org) for the reference. If not provided, some functionality of the explorer, related to smart contracts interaction and third-party apps integration, will be unavailable | - | - | `https://core.poa.network` |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | Network currency name | - | - | `Ether` |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | Network currency symbol | - | - | `ETH` |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | Network currency decimals | - | `18` | `6` |
| NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS | `string` | Address of network's native token | - | - | `0x029a799563238d0e75e20be2f4bda0ea68d00172` |
| NEXT_PUBLIC_NETWORK_ASSETS_PATHNAME | `string` | Network name for constructing url of token logos according to template `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${assetsNamePath}/assets/${tokenAddress}/logo.png`. It should match network name in TrustWallet assets repo, see the full list [here](https://github.com/trustwallet/assets/tree/master/blockchains) | - | - | `ethereum` |
| NEXT_PUBLIC_NETWORK_LOGO | `string` | Network logo; if not provided, placeholder will be shown; *Note* the logo height should be 20px and width less than 120px | - | - | `https://placekitten.com/240/40` |
| NEXT_PUBLIC_NETWORK_LOGO_DARK | `string` | Network logo for dark color mode; if not provided, **inverted** regular logo will be used instead | - | - | `https://placekitten.com/240/40` |
| NEXT_PUBLIC_NETWORK_ICON | `string` | Network icon; used as a replacement for regular network logo when nav bar is collapsed; if not provided, placeholder will be shown; *Note* the icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` |
| NEXT_PUBLIC_NETWORK_ICON_DARK | `string` | Network icon for dark color mode; if not provided, **inverted** regular icon will be used instead | - | - | `https://placekitten.com/60/60` |
| NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED | `boolean` | Set to true if network has account feature | - | `false` | `true` |
| NEXT_PUBLIC_IS_TESTNET | `boolean`| Set to true if network is testnet | - | `false` | `true` |

## UI configuration

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FEATURED_NETWORKS | `string` | URL of configuration file (`.json` format only) which contains list of featured networks that will be shown in the network menu. See [below](#featured-network-configuration-properties) list of available properties for particular network | - | - | `https://example.com/featured_networks_config.json` |
| NEXT_PUBLIC_OTHER_LINKS | `Array<{url: string; text: string}>` | List of links for the "Other" navigation menu | - | - | `[{'url':'https://blockscout.com','text':'Blockscout'}]` |
| NEXT_PUBLIC_FOOTER_LINKS | `string` | URL of configuration file (`.json` format only) which contains list of link groups to be displayed in the footer. See [below](#footer-links-configuration-properties) list of available properties for particular group | - | - | `https://example.com/footer_links_config.json` |
| NEXT_PUBLIC_BLOCKSCOUT_VERSION | `string` | Current running version of Blockscout (used to display link to release in the footer) | - | - | `v.5.1.0-beta`
| NEXT_PUBLIC_MARKETPLACE_CONFIG_URL | `string` | URL of configuration file (`.json` format only) which contains list of apps that will be shown on the marketplace page. See [below](#marketplace-app-configuration-properties) list of available properties for an app | - | - | `https://example.com/marketplace_config.json` |
| NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM | `string` | Link to form where authors can submit their dapps to the marketplace | - | - | `https://airtable.com/shrqUAcjgGJ4jU88C` |
| NEXT_PUBLIC_NETWORK_EXPLORERS | `Array<NetworkExplorer>` where `NetworkExplorer` can have following [properties](#network-explorer-configuration-properties) | Used to build up links to transactions, blocks, addresses in other chain explorers. | - | - | `[{'title':'Anyblock','baseUrl':'https://explorer.anyblock.tools','paths':{'tx':'/ethereum/poa/core/tx'}}]` |
| NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE | `validation` or `mining` | Verification type in the network | - | `mining` | `validation` |
| NEXT_PUBLIC_AUTH_URL | `string` | Account auth base url; the login path (`/auth/auth0`) will be added to it at execution time. Required if account is supported for the app instance. | - | - | `https://blockscout.com` |
| NEXT_PUBLIC_LOGOUT_URL | `string` | Account logout url. Required if account is supported for the app instance. | - | - | `https://blockscoutcom.us.auth0.com/v2/logout` |
| NEXT_PUBLIC_LOGOUT_RETURN_URL | `string` | Account logout return url. Required if account is supported for the app instance. | - | - | `https://blockscout.com/poa/core/auth/logout` |
| NEXT_PUBLIC_HOMEPAGE_CHARTS | `Array<'daily_txs' \| 'coin_price' \| 'market_cap'>` | List of charts displayed on the home page | - | - | `['daily_txs','coin_price','market_cap']` |
| NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR | `string` | Text color of the hero plate on the homepage (escape "#" symbol if you use HEX color codes) | `\#FFFFFF \| rgb(220, 254, 118)` | `\#DCFE76` |
| NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND | `string` | Background css value for hero plate on the homepage (escape "#" symbol if you use HEX color codes) | - | `radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)` | `radial-gradient(at 15% 86%, hsla(350,65%,70%,1) 0px, transparent 50%)` \| `no-repeat bottom 20% right 0px/100% url(https://placekitten/1400/200)` |
| NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER | `boolean` | Set to false if network doesn't have gas tracker | - | `true` | `false` |
| NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME | `boolean` | Set to false if average block time is useless for the network | - | `true` | `false` |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP | `{ id: string; width: string; height: string }` | Placement config for desktop Adbutler banner | - | - | `{'id':'123456','width':'728','height':'90'}` |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE | `{ id: string; width: number; height: number }` | Placement config for mobile Adbutler banner | - | - | `{'id':'654321','width':'300','height':'100'}` |
| NEXT_PUBLIC_AD_BANNER_PROVIDER | `slise` \| `adbutler` \| `coinzilla` \| `none` | Banner ad provider. Set to `none` to disable ad banners  | - | `slise` | `coinzilla` |
| NEXT_PUBLIC_AD_TEXT_PROVIDER | `coinzilla` \| `none` | Text ad provider. Set to `none` to disable text ad | - | `coinzilla` | `none` |
| NEXT_PUBLIC_API_SPEC_URL | `string` | Spec to be displayed on api-docs page | - | - | `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml` |
| NEXT_PUBLIC_GRAPHIQL_TRANSACTION | `string` | Txn hash for default query at GraphQl playground page | - | - | `0x69e3923eef50eada197c3336d546936d0c994211492c9f947a24c02827568f9f` |
| NEXT_PUBLIC_WEB3_DEFAULT_WALLET | `metamask` \| `coinbase`| Type of Web3 wallet which will be used by default to add tokens or chains to | - | `metamask` | `coinbase` |
| NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET | `boolean`| Set to `true` to hide icon "Add to your wallet" next to token addresses | - | `false` | `true` |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT | `boolean` | Set to `true` to hide indexing alert, if the chain indexing isn't completed | - | `false` | `true` |
### Marketplace app configuration properties

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

### Marketplace categories ids

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

### Featured network configuration properties

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the network | yes | - | `Gnosis Chain` |
| url | `string` | Network explorer main page url | yes | - | `https://blockscout.com/xdai/mainnet` |
| group | `Mainnets \| Testnets \| Other` | Indicates in which tab network appears in the menu | yes | - | `Mainnets` |
| icon | `string` | Network icon; if not provided, the common placeholder will be shown; *Note* that icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` |
| isActive | `boolean` | Pass `true` if item should be shonw as active in the menu | - | - | `true` |
| invertIconInDarkMode | `boolean` | Pass `true` if icon colors should be inverted in dark mode | - | - | `true` |

### Network explorer configuration properties

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the explorer | yes | - | `Anyblock` |
| baseUrl | `string` | Base url of the explorer | yes | - | `https://explorer.anyblock.tools` |
| paths | `Record<'tx' \| 'block' \| 'address' \| 'token', string>` | Map of explorer entities and their paths | yes | - | `{'tx':'/ethereum/poa/core/tx'}` |

*Note* The url of an entity will be constructed as `<baseUrl><paths[<entity-type>]><entity-id>`, e.g `https://explorer.anyblock.tools/ethereum/poa/core/tx/<tx-id>`

## Footer links configuration properties

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Title of link group | yes | - | `Company` |
| links | `Array<{'text':string;'url':string;}>` | list of links | yes | - | `[{'text':'Homepage','url':'https://www.blockscout.com'}]` |


## App configuration

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_APP_INSTANCE | `string` | Name of app instance | - | - | `wonderful_kepler` |
| NEXT_PUBLIC_APP_PROTOCOL | `http \| https` | App url schema | - | `https` | `http` |
| NEXT_PUBLIC_APP_HOST | `string` | App host | yes | - | `blockscout.com` |
| NEXT_PUBLIC_APP_PORT | `number` | Port where app is running | - | `3000` | `3001` |
| NEXT_PUBLIC_APP_ENV | `string` | Current app env (e.g development, review or production). Used for Sentry.io configuration | - | equals to `process.env.NODE_ENV` | `production` |

## API configuration

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_PROTOCOL | `http \| https` | Main API protocol | - | `https` | `http` |
| NEXT_PUBLIC_API_HOST | `string` | Main API host | - | `blockscout.com` | `my-host.com` |
| NEXT_PUBLIC_API_BASE_PATH | `string` | Base path for Main API endpoint url | - | - | `/poa/core` |
| NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL | `ws \| wss` | Main API websocket protocol | - | `wss` | `ws` |
| NEXT_PUBLIC_STATS_API_HOST | `string` | Stats API endpoint url | - | - | `https://my-host.com` |
| NEXT_PUBLIC_VISUALIZE_API_HOST | `string` | Visualize API endpoint url | - | - | `https://my-host.com` |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | - | - | `https://my-host.com` |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url | - | - | `https://my-host.com` |


## External services configuration

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SENTRY_DSN | `string` | Client key for your Sentry.io app | - | - | `<secret>` |
| SENTRY_CSP_REPORT_URI | `string` | URL for sending CSP-reports to your Sentry.io app | - | - | `<secret>` |
| NEXT_PUBLIC_AUTH0_CLIENT_ID | `string` | Client id for [Auth0](https://auth0.com/) provider | - | - | `<secret>` |
| NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID | `string` | Project id for [WalletConnect](https://docs.walletconnect.com/2.0/web3modal/react/installation#obtain-project-id) integration | - | - | `<secret>` |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | Site key for [reCAPTCHA](https://developers.google.com/recaptcha) service | - | - | `<secret>` |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID | `string` | Property ID for [Google Analytics](https://analytics.google.com/) service | - | - | `UA-XXXXXX-X` |
| NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN | `string` | Project token for [Mixpanel](https://mixpanel.com/) analytics service | - | - | `<secret>` |

## L2 configuration
*Note* All variables are required only for roll-up instances

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_L2_NETWORK | `boolean` | Set to true for L2 solutions (Optimism Bedrock based) | yes | - | `true` |
| NEXT_PUBLIC_L1_BASE_URL | `string` | Base Blockscout URL for L1 network | yes | - | `'http://eth-goerli.blockscout.com'` |
| NEXT_PUBLIC_L2_WITHDRAWAL_URL | `string` | URL for L2 -> L1 withdrawals | yes | - | `https://app.optimism.io/bridge/withdraw` |

## Beacon chain configuration

| Variable | Type| Description | Is required  | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_BEACON_CHAIN | `boolean` | Set to true for networks with the beacon chain | - | - | `true` |




# How to add new environment variable

If the variable should be exposed to the browser don't forget to add prefix `NEXT_PUBLIC_` to its name.

These are the steps that you have to follow to make everything work:
- create the variable placeholder for build-time in file `.env.template`; this is the most important step, without this the app will not receive any variables that are passed at run-time
- for local development purposes add the variable to either `configs/envs/.env.common` or `configs/envs/.env.<network>` files depending on if the variable has the same value for all network or specific value for each network
- add the variable to CI configs
    - `deploy/values/review/values.yaml` - review environment
    - `deploy/values/main/values.yaml` - production environment
    - `deploy/values/e2e/values.yaml` - e2e-test environment

Keep in mind that all json-like values should be single-quoted, e.g `[{'foo': 'bar'}]`
