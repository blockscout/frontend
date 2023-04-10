[Design](https://www.figma.com/file/07zoJSAP7Vo655ertmlppA/My_Account?node-id=279%3A1006) | [API Doc](https://github.com/blockscout/blockscout-account/blob/account/apps/block_scout_web/API.md) | [Core Swagger](https://app.swaggerhub.com/apis/NIKITOSING4/CoreBlockScoutAPI/1.0.0) | [Account Swagger](https://app.swaggerhub.com/apis/NIKITOSING4/blockscout-account-api/1.0)

-----
## Technology stack

Core technologies what used in the project are
- [yarn](https://yarnpkg.com/) as package manager
- [React](https://reactjs.org/) as UI library
- [Next.js](https://nextjs.org/) as application framework
- [Chakra](https://chakra-ui.com/) as component library; our theme customization could be found in `/theme` folder
- [css-modules](https://github.com/css-modules/css-modules) as lib for styling custom components
- [playwright](https://playwright.dev/) as a tool for components visual testing

And of course our premier language is [Typescript](https://www.typescriptlang.org/)

-----
## Local Development

**Pre-requisites** You should have installed Node.js v16. The best way to manage your local Node.js version is [nvm](https://github.com/nvm-sh/nvm)

For local development please follow next steps:
- clone repo
- install dependencies with `yarn`
- clone `.env.example` into `configs/envs/.env.secrets` and fill it with necessary secret values (see description [below](#environment-variables))
- to spin up local dev server
    - for predefined networks configs (see full available list in `package.json`) you can just run `yarn dev:<app_name>`
    - for custom network setup create `.env.local` file with all required environment variables from the [list](#environment-variables) and run `yarn dev`
- navigate to the host from logs output

## Components visual testing

We use [playwright experimental components testing](https://playwright.dev/docs/test-components) for visual (screenshots) CI check. Test renders a single component in headless browser in docker, generates screenshots and then compares this screenshot with a reference one.
To perform testing locally you need to install docker and run `yarn test:pw:docker`

## Environment variables

The app instance could be customized by passing following variables to NodeJS environment at runtime.

**IMPORTANT NOTE!** For _production_ build purposes all json-like values should be single-quoted. If it contains a hash (`#`) or a dollar-sign (`$`) the whole value should be wrapped in single quotes as well (see `dotenv` [readme](https://github.com/bkeepers/dotenv#variable-substitution))

### Network configuration

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_NAME | `string` | Displayed name of the network | `Gnosis Chain` |
| NEXT_PUBLIC_NETWORK_SHORT_NAME | `string` *(optional)* | Used for SEO attributes (page title and description) | `OoG` |
| NEXT_PUBLIC_NETWORK_TYPE | `string` *(optional)* | Network type (used for matching pre-defined assets, e.g network logo and icon, which are stored in the project). See all possible values here | `xdai_mainnet` |
| NEXT_PUBLIC_NETWORK_ID | `number` | Chain id, see [https://chainlist.org](https://chainlist.org) for the reference | `99` |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string` *(optional)* | Chain server RPC url, see [https://chainlist.org](https://chainlist.org) for the reference. If not provided, some functionality of the explorer, related to smart contracts interaction and third-party apps integration, will be unavailable | `https://core.poa.network` |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | Network currency name | `Ether` |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | Network currency symbol | `ETH` |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | Network currency decimals | `18` |
| NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS | `string` | Address of network's native token | `0x029a799563238d0e75e20be2f4bda0ea68d00172` |
| NEXT_PUBLIC_NETWORK_ASSETS_PATHNAME | `string` *(optional)* | Network name for constructing url of token logos according to template `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${assetsNamePath}/assets/${tokenAddress}/logo.png`. It should match network name in TrustWallet assets repo, see the full list [here](https://github.com/trustwallet/assets/tree/master/blockchains) | `ethereum` |
| NEXT_PUBLIC_NETWORK_LOGO | `string` *(optional)* | Network logo; if not provided, will fallback to logo predefined in the project; if the project doesn't have logo for such network then the common placeholder will be shown; *Note* that logo height should be 20px and width less than 120px | `https://www.fillmurray.com/240/40` |
| NEXT_PUBLIC_NETWORK_SMALL_LOGO | `string` *(optional)* | Small version of network logo; if not provided, will fallback to logo predefined in the project; if the project doesn't have logo for such network then the common placeholder will be shown; *Note* that logo should have square format (e.g 60px by 60px) | `https://www.fillmurray.com/60/60` |
| NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED | `boolean` *(optional)* | Set to true if network has account feature | `true` |
| NEXT_PUBLIC_IS_TESTNET | `boolean` *(optional)* | Set to true if network is testnet | `true` |

### UI configuration

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_FEATURED_NETWORKS | `Array<FeaturedNetwork>` where `FeaturedNetwork` can have following [properties](#featured-network-configuration-properties) | Configuration of featured networks that will be shown in the network menu | `[{'title':'Gnosis Chain','url':'https://blockscout.com/xdai/mainnet','group':'mainnets'}]` |
| NEXT_PUBLIC_BLOCKSCOUT_VERSION | `string` *(optional)* | Current running version of Blockscout (used to display link to release in the footer) |
| NEXT_PUBLIC_FOOTER_GITHUB_LINK | `string` *(optional)* | Link to Github in the footer | `https://github.com/blockscout/blockscout` |
| NEXT_PUBLIC_FOOTER_TWITTER_LINK | `string` *(optional)* | Link to Twitter in the footer | `https://www.twitter.com/blockscoutcom` |
| NEXT_PUBLIC_FOOTER_TELEGRAM_LINK | `string` *(optional)* | Link to Telegram in the footer | `https://t.me/poa_network` |
| NEXT_PUBLIC_FOOTER_STAKING_LINK | `string` *(optional)* | Link to staking dashboard in the footer | `https://duneanalytics.com/maxaleks/xdai-staking` |
| NEXT_PUBLIC_MARKETPLACE_APP_LIST | `Array<MarketplaceApp>` where `MarketplaceApp` can have following [properties](#marketplace-app-configuration-properties) | List of apps that will be shown on the marketplace page | `[{'author': 'Bob', 'id': 'app', 'external': true, 'title': 'The App', 'logo': 'https://foo.app/icon.png', 'categories': ['security'], 'shortDescription': 'Awesome app', 'site': 'https://foo.app', 'description': 'The best app', 'url': 'https://foo.app/launch'}]` |
| NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM | `string` | Link to form where authors can submit their dapps to the marketplace | `https://airtable.com/shrqUAcjgGJ4jU88C` |
| NEXT_PUBLIC_NETWORK_EXPLORERS | `Array<NetworkExplorer>` where `NetworkExplorer` can have following [properties](#network-explorer-configuration-properties) | Used to build up links to transactions, blocks, addresses in other chain explorers.  | `[{'title':'Anyblock','baseUrl':'https://explorer.anyblock.tools','paths':{'tx':'/ethereum/poa/core/tx'}}]` |
| NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE | `validation` or `mining` *(optional)* | Verification type in the network | `mining` |
| NEXT_PUBLIC_AUTH_URL | `string` *(optional)* | Account auth base url; the login path (`/auth/auth0`) will be added to it at execution time | `https://blockscout.com` |
| NEXT_PUBLIC_LOGOUT_URL | `string` *(optional)* | Account logout url | `https://blockscoutcom.us.auth0.com/v2/logout` |
| NEXT_PUBLIC_LOGOUT_RETURN_URL | `string` *(optional)* | Account logout return url | `https://blockscout.com/poa/core/auth/logout` |
| NEXT_PUBLIC_HOMEPAGE_CHARTS | `Array<'daily_txs' \| 'coin_price' \| 'market_cup'>` *(optional)* | List of charts displayed on the home page | `['daily_txs','coin_price','market_cup']` |
| NEXT_PUBLIC_HOMEPAGE_PLATE_GRADIENT | `string` *(optional)* | Gradient value for hero plate on the homepage | `radial-gradient(at 15% 86%, hsla(350,65%,70%,1) 0px, transparent 50%), radial-gradient(at 72% 57%, hsla(14,95%,76%,1) 0px, transparent 50%)` |
| NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER | `boolean` *(optional)* | Set to false if network doesn't have gas tracker | `true` |
| NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME | `boolean` *(optional)* | Set to false if average block time is useless for the network | `true` |
| NEXT_PUBLIC_DOMAIN_WITH_AD | `string` *(optional)* | The domain on which we display ads | `blockscout.com` |
| NEXT_PUBLIC_AD_ADBUTLER_ON | `boolean` *(optional)* | Set to true to show Adbutler banner instead of Coinzilla banner | `false` |
| NEXT_PUBLIC_API_SPEC_URL | `string` *(optional)* | Spec to be displayed on api-docs page | `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml` |
| NEXT_PUBLIC_GRAPHIQL_TRANSACTION | `string` *(optional)* | Txn hash for default query at GraphQl playground page | `0x69e3923eef50eada197c3336d546936d0c994211492c9f947a24c02827568f9f` |

### App configuration

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_APP_INSTANCE | `string` *(optional)* | Name of app instance | `wonderful_kepler` |
| NEXT_PUBLIC_APP_PROTOCOL | `http \| https` *(optional)* | App protocol (`https` used as default value) | `https` |
| NEXT_PUBLIC_APP_HOST | `string` | App host | `blockscout.com` |
| NEXT_PUBLIC_APP_PORT | `number` *(optional)* | Port where app is running. Have to be provided if it is different to default port | `3000` |
| NEXT_PUBLIC_APP_ENV | `string` *(optional)* | Current app env (e.g development, review or production). Used for Sentry.io configuration | `production` |

### API configuration

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_API_HOST | `string` *(optional)* | By default the API endpoint base URL will be set as `https://blockscout.com`. If it is not the case, pass the API host in this variable  | `my-host.com` |
| NEXT_PUBLIC_API_BASE_PATH | `string` *(optional)* | Base path for API endpoint url  | `/poa/core` |
| NEXT_PUBLIC_STATS_API_HOST | `string` *(optional)* | Pass the Stats API host in this variable  | `https://my-host.com` |
| NEXT_PUBLIC_VISUALIZE_API_HOST | `string` *(optional)* | Pass the Visualize API host in this variable  | `https://my-host.com` |


### Featured network configuration properties

| Property | Type | Description | Example value
| --- | --- | --- | --- |
| title | `string` | Displayed name of the network | `'Gnosis Chain'` |
| url | `string` | Network explorer main page url | `'https://blockscout.com/xdai/mainnet'` |
| group | `mainnets \| testnets \| other` | Indicates in which tab network appears in the menu | `'mainnets'` |
| icon | `string` *(optional)* | Network icon; if not provided, will fallback to  icon predefined in the project; if the project doesn't have icon for such network then the common placeholder will be shown; *Note* that icon size should be 30px by 30px | `'https://www.fillmurray.com/60/60'` |
| type | `string` *(optional)* | Network type (used for matching pre-defined network icon, which is stored in the project). See all possible values here | `xdai_mainnet` |

### Network explorer configuration properties

| Property | Type | Description | Example value
| --- | --- | --- | --- |
| title | `string` | Displayed name of the explorer | `'Anyblock'` |
| baseUrl | `string` | Base url of the explorer | `'https://explorer.anyblock.tools'` |
| paths | `Record<'tx' \| 'block' \| 'address', string>` | Map of explorer entities and their paths | `'paths':{'tx':'/ethereum/poa/core/tx'}` |

*Note* The url of an entity will be constructed as `<baseUrl><paths[<entity-type>]><entity-id>`, e.g `https://explorer.anyblock.tools/ethereum/poa/core/tx/<tx-id>`

### External services configuration

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_SENTRY_DSN | `string` *(optional)* | Client key for your Sentry.io app | `<secret>` |
| SENTRY_CSP_REPORT_URI | `string` *(optional)* | URL for sending CSP-reports to your Sentry.io app | `<secret>` |
| NEXT_PUBLIC_AUTH0_CLIENT_ID | `string` | Client id for [Auth0](https://auth0.com/) provider | `<secret>` |
| NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID | `string` | Project id for [WalletConnect](https://docs.walletconnect.com/2.0/web3modal/react/installation#obtain-project-id) integration | `<secret>` |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | Site key for [reCAPTCHA](https://developers.google.com/recaptcha) service | `<secret>` |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID | `string` | Property ID for [Google Analytics](https://analytics.google.com/) service | `UA-XXXXXX-X` |

### L2 configuration
| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_IS_L2_NETWORK | `boolean` *(optional)* | Set to true for L2 solutions (Optimism Bedrock based)  | false |
| NEXT_PUBLIC_L1_BASE_URL | `string` *(optional)* | Base Blockscout URL for L1 network | `'http://eth-goerli.blockscout.com'` |
| NEXT_PUBLIC_L2_WITHDRAWAL_URL | `string` *(optional)* | URL for L2 -> L1 withdrawals | `https://app.optimism.io/bridge/withdraw` |

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

### How to add new environment variable

If the variable should be exposed to the browser don't forget to add prefix `NEXT_PUBLIC_` to its name.

These are the steps that you have to follow to make everything work:
- create the variable placeholder for build-time in file `.env.template`; this is the most important step, without this the app will not receive any variables that are passed at run-time
- for local development purposes add the variable to either `configs/envs/.env.common` or `configs/envs/.env.<network>` files depending on if the variable has the same value for all network or specific value for each network
- add the variable to CI configs
    - `deploy/values/review/values.yaml` - review environment
    - `deploy/values/main/values.yaml` - production environment
    - `deploy/values/e2e/values.yaml` - e2e-test environment

Keep in mind that all json-like values should be single-quoted, e.g `[{'foo': 'bar'}]`
