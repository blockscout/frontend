# Run-time environment variables

The app instance can be customized by passing the following variables to the Node.js environment at runtime.

Two related references:
- **Build-time variables** (compiled into the Docker image via `ARG`) live in [BUILD-TIME_ENVS.md](./BUILD-TIME_ENVS.md).
- **Deprecated variables** that have been removed or renamed live in [DEPRECATED_ENVS.md](./DEPRECATED_ENVS.md).

## Read before you run the app

### Variables compulsoriness
The "Compulsoriness" column is scoped to the section the variable lives in:
- **App configuration**, **APIs configuration > Core API**, and **Slices > Chain** — `Required` means required for the app to start.
- All other sections (other APIs, App shell, the remaining slices, Features, External services, Misc) — `Required` means required to enable that section's capability. Skipping the whole section is always optional.

If a feature also needs variables that live in another section (an API host, a service key, etc.), they're listed in that feature's **Dependencies** table and linked back to their canonical row.

### Disclaimer about using variables
Please be aware that all environment variables prefixed with `NEXT_PUBLIC_` will be exposed to the browser. So any user can obtain its values. Make sure that for all 3rd-party services keys (e.g., Reown, etc.) in the services administration panel you have created a whitelist of allowed origins and have added your app domain into it. That will help you prevent using your key by unauthorized app, if someone gets its value.

### Note about escaping variables values
All json-like values should be single-quoted. If it contains a hash (`#`) or a dollar-sign (`$`) the whole value should be wrapped in single quotes as well (see `dotenv` [readme](https://github.com/bkeepers/dotenv#variable-substitution) for the reference)

&nbsp;

## Table of contents
- [App configuration](#app-configuration)
- [APIs configuration](#apis-configuration)
  - [Core API](#core-api)
  - [Admin Service API](#admin-service-api)
  - [BENS (Name Service) API](#bens-name-service-api)
  - [Clusters API](#clusters-api)
  - [Contract Info API](#contract-info-api)
  - [Interchain Indexer API](#interchain-indexer-api)
  - [Metadata Service API](#metadata-service-api)
  - [Multichain Aggregator API](#multichain-aggregator-api)
  - [Multichain Stats API](#multichain-stats-api)
  - [Rewards Service API](#rewards-service-api)
  - [Stats API](#stats-api)
  - [TAC Operation Lifecycle API](#tac-operation-lifecycle-api)
  - [User Operations Indexer API](#user-operations-indexer-api)
  - [Visualize API](#visualize-api)
  - [ZetaChain Service API](#zetachain-service-api)
- [App shell](#app-shell)
  - [Favicon](#favicon)
  - [Footer](#footer)
  - [Header](#header)
  - [Layout](#layout)
  - [Metadata](#metadata)
  - [Navigation](#navigation)
  - [Top bar](#top-bar)
- [Slices](#slices)
  - [Address](#address)
  - [Block](#block)
  - [Chain](#chain)
  - [Contract](#contract)
  - [Home](#home)
  - [Internal transaction](#internal-transaction)
  - [Token](#token)
  - [Transaction](#transaction)
- [Features](#features)
  - [Account](#account)
  - [Address 3rd party widgets](#address-3rd-party-widgets)
  - [Address metadata](#address-metadata)
  - [Address profile API](#address-profile-api)
  - [Ads](#ads)
  - [Advanced filter](#advanced-filter)
  - [Alternative explorers](#alternative-explorers)
  - [API documentation](#api-documentation)
  - [Blockchain statistics](#blockchain-statistics)
  - [Bridged tokens](#bridged-tokens)
  - [Chain variants](#chain-variants)
  - [Connect wallet](#connect-wallet)
  - [Cross-chain transactions](#cross-chain-transactions)
  - [CSV export](#csv-export)
  - [Data availability](#data-availability)
  - [DeFi dropdown](#defi-dropdown)
  - [DEX pools](#dex-pools)
  - [Easter eggs](#easter-eggs)
  - [External transactions](#external-transactions)
  - [Flashblocks](#flashblocks)
  - [Gas tracker](#gas-tracker)
  - [Get gas button](#get-gas-button)
  - [Hot contracts](#hot-contracts)
  - [Marketplace](#marketplace)
  - [MetaSuites extension](#metasuites-extension)
  - [Multichain button](#multichain-button)
  - [Multichain explorer](#multichain-explorer)
  - [Name services](#name-services)
  - [Rewards](#rewards)
  - [Rollup](#rollup)
  - [Safe{Core} address tags](#safecore-address-tags)
  - [Solidity to UML](#solidity-to-uml)
  - [Transaction interpretation](#transaction-interpretation)
  - [User operations (ERC-4337)](#user-operations-erc-4337)
  - [Validators](#validators)
  - [Verified tokens](#verified-tokens)
  - [Web3 wallet integration](#web3-wallet-integration)
  - [X-Star score](#x-star-score)
- [External services](#external-services)
  - [Google Analytics](#google-analytics)
  - [Google ReCaptcha](#google-recaptcha)
  - [GrowthBook](#growthbook)
  - [Mixpanel](#mixpanel)
  - [OpenTelemetry](#opentelemetry)
  - [Rollbar](#rollbar)
  - [Usercentrics CMP](#usercentrics-cmp)
- [Misc](#misc)
  - [Design system](#design-system)
  - [Pro API support](#pro-api-support)

&nbsp;

## App configuration

| Variable | Type| Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_APP_PROTOCOL | `http \| https` | App url schema | - | `https` | `http` | v1.0.x+ |
| NEXT_PUBLIC_APP_HOST | `string` | App host | Required | - | `blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_APP_PORT | `number` | Port where app is running | - | `3000` | `3001` | v1.0.x+ |
| NEXT_PUBLIC_APP_ENV | `string` | App env (e.g development, staging, production, etc.). | - | `production` | `staging` | v1.0.x+ |
| NEXT_PUBLIC_APP_INSTANCE | `string` | Name of app instance. Used for app monitoring purposes. If not provided, it will be constructed from `NEXT_PUBLIC_APP_HOST` | - | - | `wonderful_kepler` | v1.0.x+ |
| NEXT_PUBLIC_USE_NEXT_JS_PROXY | `boolean` | Tells the app to proxy all APIs request through the NextJS app. **We strongly advise not to use it in the production environment**, since it can lead to performance issues of the NodeJS server | - | `false` | `true` | v1.8.0+ |

&nbsp;

## APIs configuration

### Core API

Primary Blockscout backend that serves the main explorer data (blocks, transactions, addresses, tokens, etc.).

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_PROTOCOL | `http \| https` | Core API protocol | - | `https` | `http` | v1.0.x+ |
| NEXT_PUBLIC_API_HOST | `string` | Core API host | Required (except for multichain) | - | `blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_API_PORT | `number` | Port where API is running on the host | - | - | `3001` | v1.0.x+ |
| NEXT_PUBLIC_API_BASE_PATH | `string` | Base path for Core API endpoint url | - | - | `/poa/core` | v1.0.x+ |
| NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL | `ws \| wss` | Core API websocket protocol | - | `wss` | `ws` | v1.0.x+ |

&nbsp;

### Admin Service API

Admin-managed content (e.g. marketplace listings) used by several features.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ADMIN_SERVICE_API_HOST | `string` | Admin Service API endpoint url | Required | - | `https://admin-rs.services.blockscout.com` | v1.1.0+ |
| NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID | `string` | Instance ID to use in the service resource paths | - | same as `NEXT_PUBLIC_NETWORK_ID` | `420:duck` | v2.8.0+ |

&nbsp;

### BENS (Name Service) API

Address-to-name resolution service (BENS — Blockscout ENS).

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NAME_SERVICE_API_HOST | `string` | Name Service API endpoint url | Required | - | `https://bens.services.blockscout.com` | v1.22.0+ |

&nbsp;

### Clusters API

Clusters.xyz universal name service — cross-chain identity and address mapping.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CLUSTERS_API_HOST | `string` | Clusters.xyz API endpoint for fetching cluster data, directory listings, and cross-chain address mappings | Required | - | `https://example.com/clusters-api` | v2.4.0+ |

&nbsp;

### Contract Info API

Verified-contract metadata service powering features like DEX pools.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CONTRACT_INFO_API_HOST | `string` | Contract Info API endpoint url | Required | - | `https://contracts-info.services.blockscout.com` | v1.1.0+ |
| NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID | `string` | Instance ID to use in the service resource paths | - | same as `NEXT_PUBLIC_NETWORK_ID` | `420:duck` | v2.8.0+ |

&nbsp;

### Interchain Indexer API

Cross-chain transaction indexer used by the cross-chain transactions feature.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST | `string` | Interchain indexer API service host used to fetch cross-chain transaction data and metadata | Required | - | `https://bridge-indexer.k8s-dev.blockscout.com` | v2.7.0+ |

&nbsp;

### Metadata Service API

Address metadata (public tags, profiles) and the public-tag submission flow.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_METADATA_SERVICE_API_HOST | `string` | Metadata Service API endpoint url | Required | - | `https://metadata.services.blockscout.com` | v1.30.0+ |

&nbsp;

### Multichain Aggregator API

Primary backend for the multichain explorer — aggregated chain, address, and transaction data.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST | `string` | Multichain aggregator API service host | Required | - | `https://multichain-aggregator.k8s-dev.blockscout.com` | v2.5.0+ |
| NEXT_PUBLIC_MULTICHAIN_CLUSTER | `string` | Chain's cluster name; used to construct the full URL for requests to the aggregator API service | Required | - | `interop` | v2.5.0+ |

&nbsp;

### Multichain Stats API

Stats and charts backend for the multichain explorer.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST | `string` | Multichain statistics API service host | Required | - | `http://multichain-search-stats.k8s-dev.blockscout.com` | v2.5.0+ |

&nbsp;

### Rewards Service API

Blockscout Merits / rewards program backend.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_REWARDS_SERVICE_API_HOST | `string` | Rewards Service API endpoint url | Required | - | `https://example.com` | v1.36.0+ |

&nbsp;

### Stats API

Chain statistics and charts.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_STATS_API_HOST | `string` | Stats API endpoint url | Required | - | `https://stats.services.blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_STATS_API_BASE_PATH | `string` | Base path for Stats API endpoint url | - | - | `/poa/core` | v1.29.0+ |
| NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL | `Record<StatsApiResourceName, number>` | Map that holds information about time in milliseconds that the resources should be continuously refetched; possible values for `StatsApiResourceName` are: `stats:counters`, `stats:pages_main` | - | - | `{'stats:pages_main': 10000}` | v2.9.0+ |

&nbsp;

### TAC Operation Lifecycle API

TAC chain bridge operation status tracking.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST | `string` | URL for the TAC Operation Lifecycle service | Required | - | `https://tac-operation-lifecycle.blockscout.com` | v2.1.0+ |

&nbsp;

### User Operations Indexer API

ERC-4337 (account abstraction) user operations indexer.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST | `string` | The user operations indexer API host; pass to show API documentation for the service | Required | - | `https://user-ops-indexer-base-mainnet.k8s-prod-2.blockscout.com` | v2.3.0+ |

&nbsp;

### Visualize API

Solidity-to-UML smart contract visualizer.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VISUALIZE_API_HOST | `string` | Visualize API endpoint url | Required | - | `https://visualizer.services.blockscout.com` | v1.0.x+ |
| NEXT_PUBLIC_VISUALIZE_API_BASE_PATH | `string` | Base path for Visualize API endpoint url | - | - | `/poa/core` | v1.29.0+ |

&nbsp;

### ZetaChain Service API

ZetaChain cross-chain transaction (CCTX) tracking.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST | `string` | ZetaChain cross-chain transactions service API endpoint url | Required | - | `https://zetachain-cctx.services.blockscout.com` | v2.3.2+ |

&nbsp;

## App shell

### Favicon

Operator-supplied favicon override. The app ships with the generic Blockscout favicon by default; set the variable below to generate a replacement bundle at container startup. Consumed by container start-up script, not by app code, so it does not need the `NEXT_PUBLIC_` prefix.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| FAVICON_MASTER_URL | `string` | URL of the source image (PNG recommended, square, at least 180×180) used to generate the favicon bundle at container startup | - | `NEXT_PUBLIC_NETWORK_ICON` | `https://placekitten.com/180/180` | v1.11.0+ |

&nbsp;

### Footer

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FOOTER_LINKS | `string` | URL of configuration file (`.json` format only) or file content string representation. It contains list of link groups to be displayed in the footer. See [below](#footer-links-configuration-properties) list of available properties for particular group | - | - | `https://example.com/footer_links_config.json` \| `[{'title':'My chain','links':[{'text':'About','url':'https://example.com/about'},{'text':'Contacts','url':'https://example.com/contacts'}]}]` | v1.1.1+ |

The app version shown in the footer is derived from build-time ENV variables `NEXT_PUBLIC_GIT_TAG` and `NEXT_PUBLIC_GIT_COMMIT_SHA` and cannot be overwritten at run-time.

#### Footer links configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Title of link group | Required | - | `Company` |
| links | `Array<{'text':string;'url':string;'iconUrl'?:[string,string]}>` | An array contains a list of links in the column. Each link can optionally have an `iconUrl` property, which should include an array of two external image URLs for light and dark themes, respectively. If only one URL is provided, it will be used for both color schemes. We expect the icons to be square, with a minimum size of 40px by 40px or in SVG format. | Required | - | `[{'text':'Homepage','url':'https://www.blockscout.com'}]` |

&nbsp;

### Header

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE | `string \| Array<string>` | Used to display custom announcements or alerts in the site's header, this feature can handle a single instance or an array of regular strings or HTML code. If an array of instances is provided, the banners will rotate randomly each time the user reloads the page. In this case, please ensure that you properly escape the values of HTML attributes or other special symbols (for example, `<a href=\\"https://example.com\\">Link!</a>`). | - | - | `Hello world! 🤪` | v1.13.0+ |

&nbsp;

### Layout

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED | `boolean` | Set to `true` to restrict the page content width on extra-large screens. | - | `true` | `false` | v1.34.1+ |

&nbsp;

### Metadata

Meta tags, Open Graph, and SEO.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE | `boolean` | Set to `true` to promote Blockscout in meta and OG titles | - | `true` | `true` | v1.12.0+ |
| NEXT_PUBLIC_OG_DESCRIPTION | `string` | Custom OG description | - | - | `Open-source block explorer by Blockscout. Search transactions, verify smart contracts, analyze addresses, and track network activity. Complete blockchain data and APIs.` | v1.12.0+ |
| NEXT_PUBLIC_OG_IMAGE_URL | `string` | OG image url. Minimum image size is 200 x 20 pixels (recommended: 1200 x 600); maximum supported file size is 8 MB; 2:1 aspect ratio; supported formats: image/jpeg, image/gif, image/png | - | `static/og_placeholder.png` | `https://placekitten.com/1200/600` | v1.12.0+ |
| NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED | `boolean` | Set to `true` to populate OG tags (title, description) with API data for social preview robot requests | - | `true` | `false` | v1.29.0+ |
| NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED | `boolean` | Set to `true` to pre-render page titles (e.g Token page) on the server side. | - | `false` | `true` | v1.30.0+ |

&nbsp;

### Navigation

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_OTHER_LINKS | `Array<{url: string; text: string}>` | List of links for the "Other" navigation menu | - | - | `[{'url':'https://blockscout.com','text':'Blockscout'}]` | v1.0.x+ |
| NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES | `Array<string>` | List of menu item routes that should have a lightning label | - | - | `['/accounts']` | v1.31.0+ |
| NEXT_PUBLIC_NAVIGATION_LAYOUT | `vertical \| horizontal` | Navigation menu layout type | - | `vertical` | `horizontal` | v1.32.0+ |
| NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG | `string` | Configuration of promo banner in the navigation menu. See [below](#navigation-promo-banner-configuration-properties) list of available properties for particular banner type | - | - | `{'img_url': 'https://example.com/promo.svg', 'text': 'Promo text', 'bg_color': {'light': 'rgb(250, 245, 255)', 'dark': 'rgb(68, 51, 122)'}, 'text_color': {'light': 'rgb(107, 70, 193)', 'dark': 'rgb(233, 216, 253)'}, 'link_url': 'https://example.com'}` | v2.3.0+ |

#### Navigation promo banner configuration properties

##### Text promo banner

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| img_url | `string` | Displayed icon url. The recommended minimum image size is 60x60 pixels (1:1 aspect ratio). | Required | - | `https://example.com/promo.svg` |
| text | `string` | Displayed text | Required | - | `Promo text` |
| bg_color | `{'light': string, 'dark': string}` | Background color | Required | - | `{'light': 'rgb(250, 245, 255)', 'dark': 'rgb(68, 51, 122)'}` |
| text_color | `{'light': string, 'dark': string}` | Text color | Required | - | `{'light': 'rgb(107, 70, 193)', 'dark': 'rgb(233, 216, 253)'}` |
| link_url | `string` | Redirect link url | Required | - | `https://example.com` |

##### Image promo banner

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| img_url | `{'small': string, 'large': string}` | Displayed image urls. Small image is used in the collapsed navigation menu and in horizontal navigation, large image is used in the expanded navigation menu and in tooltip. The recommended minimum image sizes are 120x120 pixels (1:1 aspect ratio) for small image and 500x250 pixels (2:1 aspect ratio) for large image. | Required | - | `{'small': 'https://example.com/promo-sm.svg', 'large': 'https://example.com/promo-lg.svg'}` |
| link_url | `string` | Redirect link url | Required | - | `https://example.com` |

&nbsp;

### Top bar

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FEATURED_NETWORKS | `string` | URL of configuration file (`.json` format only) or file content string representation. It contains list of featured networks that will be shown in the network menu. See [below](#featured-network-configuration-properties) list of available properties for particular network | - | - | `https://example.com/featured_networks_config.json` \| `[{'title':'Astar(EVM)','url':'https://astar.blockscout.com/','group':'Mainnets','icon':'https://example.com/astar.svg'}]` | v1.0.x+ |
| NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK | `string` | Link to the all chains resource. Will be displayed at the bottom of featured networks list. | Works only if NEXT_PUBLIC_FEATURED_NETWORKS is set | - | `https://example.com` | v2.3.0+ |
| NEXT_PUBLIC_FEATURED_NETWORKS_MODE | `tabs \| list` | Indicates how the networks are presented: in one list or in separate tabs. | Works only if NEXT_PUBLIC_FEATURED_NETWORKS is set | `list` | `tabs` | v2.5.0+ |
| NEXT_PUBLIC_COLOR_THEME_DEFAULT | `'light' \| 'dim' \| 'midnight' \| 'dark'` | Preferred color theme of the app | - | - | `midnight` | v1.30.0+ |
| NEXT_PUBLIC_COLOR_THEME_OVERRIDES | `string` | Color overrides for the default theme; pass a JSON-like string that represents a subset of the `DEFAULT_THEME_COLORS` object (see `toolkit/theme/foundations/colors.ts`) to customize the app's main colors. See [here](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=29124-23813&t=XOv4ahHUSsTDlNkN-4) the Figma worksheet with description of available color tokens. | - | - | `{'text':{'primary':{'_light':{'value':'rgba(16,17,18,0.80)'},'_dark':{'value':'rgba(222,217,217)'}}}}` | v2.3.0+ |

#### Featured network configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the network | Required | - | `Gnosis Chain` |
| url | `string` | Network explorer main page url | Required | - | `https://blockscout.com/xdai/mainnet` |
| group | `Mainnets \| Testnets \| Other` | Indicates in which tab network appears in the menu | Required | - | `Mainnets` |
| icon | `string` | Network icon; if not provided, the common placeholder will be shown; *Note* that icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` |
| isActive | `boolean` | Pass `true` if item should be shown as active in the menu | - | - | `true` |
| invertIconInDarkMode | `boolean` | Pass `true` if icon colors should be inverted in dark mode | - | - | `true` |

&nbsp;

## Slices

### Address

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE | `"github" \| "jazzicon" \| "gradient_avatar" \| "blockie" \| "nouns"` | Default style of address identicon appearance. Choose between [GitHub](https://github.blog/2013-08-14-identicons/), [Metamask Jazzicon](https://metamask.github.io/jazzicon/), [Gradient Avatar](https://github.com/varld/gradient-avatar), [Ethereum Blocky](https://mycryptohq.github.io/ethereum-blockies-base64/) and [Nouns](https://nouns.wtf) | - | `blockie` | `gradient_avatar` | v1.12.0+ |
| NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT | `Array<"base16" \| "bech32">` | Displayed address format, could be either `base16` standard or [`bech32`](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki#bech32) standard. If the array contains multiple values, the address format toggle will appear in the UI, allowing the user to switch between formats. The first item in the array will be the default format. | - | `'["base16"]'` | `'["bech32", "base16"]'` | v1.36.0+ |
| NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX | `string` | Human-readable prefix of `bech32` address format. | Required, if `NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT` contains "bech32" value | - | `duck` | v1.36.0+ |
| NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS | `Array<AddressViewId>` | Address views that should not be displayed. See below the list of the possible id values. | - | - | `'["top_accounts"]'` | v1.15.0+ |
| NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS | `string` | The address of a native ERC-20 token that shadows the balance of the native coin; used to exclude its balance from the net worth value of user tokens. | - | - | `0x471EcE3750Da237f93B8E339c536989b8978a438` | v2.4.0+ |

#### Address views list
| Id | Description |
| --- | --- |
| `top_accounts` | Top accounts |

&nbsp;

### Block

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS | `Array<BlockFieldId>` | Array of the block fields ids that should be hidden. See below the list of the possible id values. | - | - | `'["burnt_fees","total_reward"]'` | v1.10.0+ |
| NEXT_PUBLIC_VIEWS_BLOCK_PENDING_UPDATE_ALERT_ENABLED | `boolean` | The flag enables indication of the incomplete data for the block in the list and detailed views of the re-indexing block and its transactions. *Feature is enabled by default; pass `false` to disable it.* | - | `true` | `false` | v2.4.0+ |

#### Block fields list
| Id | Description |
| --- | --- |
| `base_fee` | Base fee |
| `burnt_fees` | Burnt fees |
| `total_reward` | Total block reward |
| `nonce` | Block nonce |
| `miner` | Address of block's miner or validator |
| `L1_status` | Short interpretation of the batch lifecycle (applicable for Rollup chains) |
| `batch` | Batch index (applicable for Rollup chains) |

&nbsp;

### Chain

*Note!* The `NEXT_PUBLIC_NETWORK_CURRENCY` variables represent the blockchain's native token used for paying transaction fees. `NEXT_PUBLIC_NETWORK_SECONDARY_COIN` variables refer to tokens like protocol-specific tokens (e.g., OP token on Optimism chain) or governance tokens (e.g., GNO on Gnosis chain).

Also, be aware that if you customize the name of the currency or any of its denominations (wei or gwei) while running Stats microservices, you may want to change those names in the indicators and charts returned by the microservice. To do this, pass the appropriate values to the Stats microservice environment variables, such as `STATS_CHARTS__LINE_CHARTS__<LINE_CHART_NAME>__UNITS` and `STATS_CHARTS__LINE_CHARTS__<LINE_CHART_NAME>__DESCRIPTION`. For the Average Gas Price chart, the `<LINE_CHART_NAME>` will be `average_gas_price`. Please refer to the [microservice documentation](https://github.com/blockscout/blockscout-rs/tree/main/stats#charts) for the complete list of these variables.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_NAME | `string` | Displayed name of the network | Required | - | `Gnosis Chain` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_SHORT_NAME | `string` | Used for SEO attributes (e.g, page description) | - | - | `OoG` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_ID | `number` | Chain id, see [https://chainlist.org](https://chainlist.org) for the reference | Required (except for multichain) | - | `99` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_RPC_URL | `string \| Array<string>` | Chain public RPC server url, see [https://chainlist.org](https://chainlist.org) for the reference. Can contain a single string value, or an array of urls. | - | - | `https://core.poa.network` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_NAME | `string` | Network currency name | - | - | `Ether` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME | `string` | Name of the smallest unit of the native currency (e.g., 'wei' for Ethereum, where 1 ETH = 10^18 wei). Used for displaying gas prices and transaction fees in the smallest denomination. | - | `wei` | `duck` | v1.23.0+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_GWEI_NAME | `string` | Name of the giga-unit of the native currency (e.g., 'gwei' for Ethereum, where 1 gwei = 10^9 of the smallest unit). Used for displaying gas prices in a more readable format throughout the UI. | - | `gwei` | `gDuck` | v2.5.0+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL | `string` | Network currency symbol | - | - | `ETH` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS | `string` | Network currency decimals | - | `18` | `6` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL | `string` | Network secondary coin symbol. | - | - | `GNO` | v1.29.0+ |
| NEXT_PUBLIC_NETWORK_MULTIPLE_GAS_CURRENCIES | `boolean` | Set to `true` for networks where users can pay transaction fees in either the native coin or ERC-20 tokens. | - | `false` | `true` | v1.33.0+ |
| NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE | `validation` \| `mining` \| `fee reception` | Verification type in the network. Irrelevant for Arbitrum (verification type is always `posting`) L2s | - | `mining` | `validation` | v1.0.x+ |
| NEXT_PUBLIC_IS_TESTNET | `boolean` | Set to true if network is testnet | - | `false` | `true` | v1.0.x+ |
| NEXT_PUBLIC_HIDE_NATIVE_COIN_PRICE | `boolean` | Set to `true` to hide the native coin price in the top bar | - | `false` | `true` | v2.4.0+ |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS | `boolean` | Set to `true` to hide indexing alert in the page header about indexing chain's blocks | - | `false` | `true` | v1.17.0+ |
| NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS | `boolean` | Set to `true` to hide indexing alert in the page footer about indexing block's internal transactions | - | `false` | `true` | v1.17.0+ |
| NEXT_PUBLIC_NETWORK_LOGO | `string` | Network logo; if not provided, placeholder will be shown; *Note* the logo height should be 24px and width less than 120px | - | - | `https://placekitten.com/240/40` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_LOGO_DARK | `string` | Network logo for dark color mode; if not provided, **inverted** regular logo will be used instead | - | - | `https://placekitten.com/240/40` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_ICON | `string` | Network icon; used as a replacement for regular network logo when nav bar is collapsed; if not provided, placeholder will be shown; *Note* the icon size should be at least 60px by 60px | - | - | `https://placekitten.com/60/60` | v1.0.x+ |
| NEXT_PUBLIC_NETWORK_ICON_DARK | `string` | Network icon for dark color mode; if not provided, **inverted** regular icon will be used instead | - | - | `https://placekitten.com/60/60` | v1.0.x+ |

&nbsp;

### Contract

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED | `boolean` | Set to `true` if SolidityScan reports are supported | - | - | `true` | v1.19.0+ |
| NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS | `Array<'solidity-hardhat' \| 'solidity-foundry'>` | Pass an array of additional methods from which users can choose while verifying a smart contract. Both methods are available by default, pass `'none'` string to disable them all. | - | - | `['solidity-hardhat']` | v1.33.0+ |
| NEXT_PUBLIC_VIEWS_CONTRACT_DECODED_BYTECODE_ENABLED | `boolean` | If set to true, the deployed bytecode for unverified contracts will be parsed on the client side to retrieve the source code. If successful, the source code will be displayed in the snippet along with the content type selector. This feature works only for Scilla contracts. | - | - | `true` | v2.3.0+ |
| NEXT_PUBLIC_CONTRACT_CODE_IDES | `Array<ContractCodeIde>` where `ContractCodeIde` can have following [properties](#contract-code-ide-configuration-properties) | Used to build up links to IDEs with contract source code. | - | - | `[{'title':'Remix IDE','url':'https://remix.blockscout.com/?address={hash}&blockscout={domain}','icon_url':'https://example.com/icon.svg'}]` | v1.23.0+ |
| NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS | `boolean` | Set to `true` to enable Submit Audit form on the contract page | - | `false` | `true` | v1.25.0+ |

#### Contract code IDE configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Displayed name of the IDE | Required | - | `Remix IDE` |
| url | `string` | URL of the IDE with placeholders for contract hash (`{hash}`) and current domain (`{domain}`) | Required | - | `https://remix.blockscout.com/?address={hash}&blockscout={domain}` |
| icon_url | `string` | URL of the IDE icon | Required | - | `https://example.com/icon.svg` |

&nbsp;

### Home

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HOMEPAGE_CHARTS | `Array<'daily_txs' \| 'daily_operational_txs' \| 'coin_price'  \| 'secondary_coin_price' \| 'market_cap' \| 'tvl'>` | List of charts displayed on the home page | - | - | `['daily_txs','coin_price','market_cap']` | v1.0.x+ |
| NEXT_PUBLIC_HOMEPAGE_STATS | `Array<'latest_batch' \| 'total_blocks'  \| 'average_block_time' \| 'total_txs' \| 'total_operational_txs' \| 'latest_l1_state_batch' \| 'wallet_addresses' \| 'gas_tracker' \| 'btc_locked' \| 'current_epoch'>` | List of stats widgets displayed on the home page | - | For zkSync and Arbitrum rollups: `['latest_batch','average_block_time','total_txs','wallet_addresses','gas_tracker']`, for other cases: `['total_blocks','average_block_time','total_txs','wallet_addresses','gas_tracker']` | `['total_blocks','total_txs','wallet_addresses']` | v1.35.x+ |
| NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG | `HeroBannerConfig`, see details [below](#hero-banner-configuration-properties) | Configuration of hero banner appearance. | - | - | See [below](#hero-banner-configuration-properties) | v1.35.0+ |
| NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG | `string` | URL of the file (in `.json` format only) that contains the configuration for banners on the application's homepage, showcasing some of its key functionality. See the full config format [below](#highlights-banner-configuration-properties). The config should contain at least 2 banners, but only 3 banners will be visible at the same time. A larger number of banners in the config allows for random banner rotation upon page load. | - | - | See [below](#highlights-banner-configuration-properties) | v2.6.0+ |

#### Hero banner configuration properties

_Note_ Here, some values are arrays of up to two strings. The first string represents the value for the light color mode, and the second string represents the value for the dark color mode. If the array contains only one string, it will be used for both color modes.

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| text | `string` | The text on the banner | - | `{ chain_name } explorer` | `Duck migration observer` |
| background | `[string, string]` | Banner background (could be a solid color, gradient or picture). The string should be a valid `background` CSS property value. | - | `['radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)']` | `['lightpink','no-repeat bottom 20% right 0px/100% url(https://placekitten/1400/200)']` |
| text_color | `[string, string]` | Banner text background. The string should be a valid `color` CSS property value. | - | `['white']` | `['lightpink','#DCFE76']` |
| border | `[string, string]` | Banner border. The string should be a valid `border` CSS property value. | - | - | `['1px solid yellow','4px dashed #DCFE76']` |
| search | `{ background?: [string, string]; border_width?: [string, string]; border_color?: Partial<Record<'_empty' \| '_hover' \| '_focus' \| '_filled', [string, string]>> }` | Search bar customization. `background` sets the input background color (valid `background-color` CSS value). `border_width` sets the border width (in px). `border_color` sets the border color per state: `_empty` (no value), `_hover`, `_focus`, `_filled` (has value). Each value should be a valid `border-color` CSS value. | - | - | `{ 'background': ['white', '#1A202C'], 'border_width': ['2px', '2px'], 'border_color': { '_empty': ['#CBD5E0'], '_hover': ['#4299E1'], '_focus': ['#3182CE'], '_filled': ['#A0AEC0'] } }` |
| button | `Partial<Record<'_default' \| '_hover' \| '_selected', {'background'?: [string, string]; 'text_color?:[string, string]'}>>` | The button on the banner. It has three possible states: `_default`, `_hover`, and `_selected`. The `_selected` state reflects when the user is logged in or their wallet is connected to the app. | - | - | `{'_default':{'background':['deeppink'],'text_color':['white']}}` |

#### Highlights banner configuration properties

_Note_ Some properties can hold an array of up to two strings. The first string represents the value for the light color mode, while the second string represents the value for the dark color mode. If the array contains only one string, it will be used for both color modes.

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| title | `string` | Title on the banner | Required | - | `Duck Deep into Transactions` |
| description | `string` | Short description of the feature | Required | - | `Explore and track all blockchain transactions` |
| title_color | `[string, string]` | Text color of the title. | - | `['#101112', '#F8FCFF']` | `['#FFB8D4', '#D9FE41']` |
| description_color | `[string, string]` | Text color of the description. | - | `['#718096', '#AEB1B6']` | `['#FFB8D4', '#D9FE41']` |
| background | `[string, string]` | Banner background (could be a solid color, gradient or picture). The string should be a valid `background` CSS property value. | - | `['#EFF7FF', '#2A3340']` | `['deeppink']` |
| side_img_url | `[string, string]` | URL of an image that appears on the right side of the banner. | - | - | `https://placekitten/1400/200` |
| is_pinned | `boolean` | Indicates whether the banner should remain always visible despite potential rotation. | - | - | `https://placekitten/1400/200` |
| page_path | `string` | Internal page path for constructing the banner link. | - | - | `/pools` |
| redirect_url | `string` | External link on the banner. | - | - | `https://example.com` |

&nbsp;

### Internal transaction

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_INTERNAL_TXS_ENABLED | `boolean` | Set to `false` to hide all internal transaction UI in the explorer, including the global list page and tabs on transaction, address, and block detail pages. | - | `true` | `false` | v2.8.0+ |

&nbsp;

### Token

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_TOKEN_STANDARD_NAME | `string` | Name of the standard for creating tokens | - | `ERC` | `BEP` | v1.31.0+ |
| NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES | `Array<{id: string; name: string;}>` | List of additional **ERC-20-like (fungible)** token types supported by the explorer UI (extends token type filters/labels). *Note: the token type id must also be supported by the backend API responses and filters.* | - | `[]` | `'[{"id":"ERC-777","name":"ERC-777"}]'` | v2.6.0+ |
| NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED | `boolean` | Show the "Hide scam tokens" toggle in the site settings dropdown. This option controls the visibility of tokens with a poor reputation in the search results. | - | `false` | `true` | v1.38.0+ |
| NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES | `Array<NftMarketplace>` where `NftMarketplace` can have following [properties](#nft-marketplace-properties) | Used to build up links to NFT collections and NFT instances in external marketplaces. | - | - | `[{'name':'OpenSea','collection_url':'https://opensea.io/assets/ethereum/{hash}','instance_url':'https://opensea.io/assets/ethereum/{hash}/{id}','logo_url':'https://opensea.io/static/images/logos/opensea-logo.svg'}]` | v1.15.0+ |
| NEXT_PUBLIC_HELIA_VERIFIED_FETCH_ENABLED | `boolean` | Indicates that the [Helia verified fetch](https://github.com/ipfs/helia-verified-fetch/tree/main/packages/verified-fetch) should be used for retrieving content of NFT assets (currently limited to images) directly from IPFS network using trustless gateways. | - | `true` | `false` | v1.37.0+ |

#### NFT marketplace properties
| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Displayed name of the marketplace | Required | - | `OpenSea` |
| collection_url | `string` | URL template for NFT collection | - | - | `https://opensea.io/assets/ethereum/{hash}` |
| instance_url | `string` | URL template for NFT instance | - | - | `https://opensea.io/assets/ethereum/{hash}/{id}` |
| logo_url | `string` | URL of marketplace logo | Required | - | `https://opensea.io/static/images/logos/opensea-logo.svg` |

*Note* URL templates should contain placeholders for the NFT hash (`{hash}` or `{hash_lowercase}`) and NFT ID (`{id}` or `{id_lowercase}`). These placeholders will be replaced with specific values or their lowercase equivalents for each collection or instance.

&nbsp;

### Transaction

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS | `Array<TxFieldsId>` | Array of the transaction fields ids that should be hidden. See below the list of the possible id values. | - | - | `'["value","tx_fee"]'` | v1.15.0+ |
| NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS | `Array<TxAdditionalFieldsId>` | Array of the additional fields ids that should be added to the transaction details. See below the list of the possible id values. | - | - | `'["fee_per_gas"]'` | v1.15.0+ |
| NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES | `boolean` | In the detailed view group transaction fees under one collapsible section. | - | - | `true` | v2.3.5+ |
| NEXT_PUBLIC_VIEWS_TX_HIDDEN_VIEWS | `Array<TxViewId>` | Transaction views that should be hidden. See below the list of the possible id values. | - | - | `'["pending_txs"]'` | v2.8.0+ |

#### Transaction fields list
| Id | Description |
| --- | --- |
| `value` | Sent value |
| `fee_currency` | Fee currency |
| `gas_price` | Price per unit of gas |
| `tx_fee` | Total transaction fee |
| `gas_fees` | Gas fees breakdown |
| `burnt_fees` | Amount of native coin burnt for transaction |
| `batch` | Batch index (applicable for Rollup chains) |
| `L1_status` | Short interpretation of the batch lifecycle (applicable for Rollup chains) |
| `L1_gas_used` | Amount of L1 gas used by transaction (applicable for Rollup chains) |
| `L1_gas_price` | L1 gas price (applicable for Rollup chains) |
| `L1_fee` | L1 data fee (applicable for Rollup chains) |
| `L1_fee_scalar` | Dynamic overhead fee scalar (applicable for Rollup chains) |

#### Transaction additional fields list
| Id | Description |
| --- | --- |
| `fee_per_gas` | Amount of total fee divided by total amount of gas used by transaction |
| `set_max_gas_limit` | Max gas price established by the sender |

#### Transaction views list
| Id | Description |
| --- | --- |
| `pending_txs` | Pending transactions |

&nbsp;

## Features

### Account

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED | `boolean` | Set to true if network has account feature | Required | - | `true` | v1.0.x+ |
| NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER | `auth0 \| dynamic` | Auth provider that enables basic user authentication. | - | `auth0` | `dynamic` | v2.7.0+ |
| NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID | `string` | Environment ID of the Dynamic project. | Required, if provider is `dynamic` | - | `<your-secret>` | v2.7.0+ |
| NEXT_PUBLIC_ACCOUNT_API_KEYS_BUTTON | `boolean \| string` | Pass `true` or `false` to enable or disable the "Add API key" button, or provide a URL to convert it into a link. | - | `true` | `https://example.com` | v2.7.0+ |
| NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE | `string` | Used for displaying custom alerts on the API keys page. Could be a regular string or HTML code. | - | - | `Hello world! 🤪` | v2.7.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY](#google-recaptcha) | Required when `NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER` is `auth0` |
| [NEXT_PUBLIC_CONTRACT_INFO_API_HOST](#contract-info-api) | Required for the address verification flow |
| [NEXT_PUBLIC_ADMIN_SERVICE_API_HOST](#admin-service-api) | Required for the address verification flow |

&nbsp;

### Address 3rd party widgets

This feature allows to display widgets on the address page with data from 3rd party services.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS | `Array<string>` | Array of widget ids to be displayed | - | - | `['widget-1', 'widget-2']` | v2.2.0+ |
| NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL | `string` | URL of configuration file (`.json` format only) which contains mapping of widget names to their configuration. See [below](#address-3rd-party-widget-configuration-properties) list of available properties for a widget. | - | - | `https://example.com/address_3rd_party_widgets_config.json` | v2.2.0+ |

#### Address 3rd party widget configuration properties

| Property | Type | Description | Compulsoriness | Example value |
| --- | --- | --- | --- | --- |
| name | `string` | Displayed name of the widget | Required | `'Widget'` |
| url | `string` | Link URL for widget card. Can contain `{address}`, `{addressLowercase}` and `{chainId}` variables | Required | `'https://example.com/widget/{address}?chainId={chainId}'` |
| icon | `string` | Widget icon URL | Required | `'https://example.com/icon.svg'` |
| title | `string` | Title of displayed data | Required | `'Multichain balance'` |
| hint | `string` | Hint for displayed data | - | `'Widget hint'` |
| valuePath | `string` | Path to the field in the API response that contains the value to be displayed | Required | `'result.balance'` |
| valueTitlePath | `string` | Path in the API response that contains the text to display next to the widget title | - | `'result.risk.status'` |
| pages | `Array<'eoa' \| 'contract' \| 'token'>` | List of pages where the widget should be displayed | Required | `['eoa']` |
| chainIds | `Record<string, string>` | Mapping of chain IDs to custom values that will be used in `url` template | - | `{'1': 'eth', '10': 'op'}` |

&nbsp;

### Address metadata

Address name tags and other public-tag metadata. Includes the public-tag submission flow.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED | `boolean` | Enables requests to the Metadata Service to schedule an update for address tags after the user visits the address page in the app. | - | `true` | `false` | v2.2.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_METADATA_SERVICE_API_HOST](#metadata-service-api) | Required |
| [NEXT_PUBLIC_ADMIN_SERVICE_API_HOST](#admin-service-api) | Required for the public-tag submission flow |
| [NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY](#google-recaptcha) | Required for the public-tag submission flow |

&nbsp;

### Address profile API

This feature allows the integration of an external API to fetch user info for addresses or contracts. When configured, if the API returns a username, a public tag with a custom link will be displayed in the address page header.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ADDRESS_USERNAME_TAG | `{api_url: string; tag_link_template: string; tag_icon: string; tag_bg_color: string; tag_text_color: string}` | Address profile API tag configuration properties. See [below](#address-profile-api-configuration-properties). | - | - | `uniswap` | v1.35.0+ |

#### Address profile API configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| api_url_template | `string` | User profile API URL. Should be a template with `{address}` variable | Required | - | `https://example-api.com/{address}` |
| tag_link_template | `string` | External link to the profile. Should be a template with `{username}` variable | - | - | `https://example.com/{address}` |
| tag_icon | `string` | Public tag icon (.svg) url | - | - | `https://example.com/icon.svg` |
| tag_bg_color | `string` | Public tag background color (escape "#" symbol if you use HEX color codes or use rgba-value instead) | - | - | `\#000000` |
| tag_text_color | `string` | Public tag text color (escape "#" symbol if you use HEX color codes or use rgba-value instead) | - | - | `\#FFFFFF` |

&nbsp;

### Ads

Ads are enabled by default on all self-hosted instances. If you would like to disable ads, you can do so using the [Autoscout hosted service](https://docs.blockscout.com/using-blockscout/autoscout).

#### Banner ads

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_BANNER_PROVIDER | `slise` \| `adbutler` \| `sevio` \| `none` | Ads provider | - | `slise` | `sevio` | v1.0.x+ |
| NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER | `adbutler` | Additional ads provider to mix with the main one | - | - | `adbutler` | v1.28.0+ |
| NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES | `Array<string>` | Optional Sevio banner zone overrides in `[mobileZone, desktopZone]` format | - | `['52909312-7ebb-4bd5-9006-5e4f7041ed63','07cabd45-77f1-4203-8081-868bae776981']` | `['52909312-7ebb-4bd5-9006-5e4f7041ed63','07cabd45-77f1-4203-8081-868bae776981']` | v2.8.0+ |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP | `{ id: string; width: string; height: string }` | Placement config for desktop Adbutler banner | - | - | `{'id':'123456','width':'728','height':'90'}` | v1.3.0+ |
| NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE | `{ id: string; width: number; height: number }` | Placement config for mobile Adbutler banner | - | - | `{'id':'654321','width':'300','height':'100'}` | v1.3.0+ |
| NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY | `boolean` | Enables Specify ads in addition to the main ad banner provider | - | - | `true` | v2.4.0+ |

#### Text ads

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_AD_TEXT_PROVIDER | `sevio` \| `none` | Ads provider | - | `sevio` | `none` | v1.0.x+ |

&nbsp;

### Advanced filter

This feature is **enabled by default**. To switch it off pass `NEXT_PUBLIC_ADVANCED_FILTER_ENABLED=false`.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ADVANCED_FILTER_ENABLED | `boolean` | Set to true to enable "Advanced filter" page in the app | Required | `true` | `false` | v1.37.0+ |

&nbsp;

### Alternative explorers

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_EXPLORERS | `Array<AlternativeExplorer>` where `AlternativeExplorer` can have following [properties](#network-explorer-configuration-properties) | Used to build up links to transactions, blocks, addresses in other chain explorers. | - | - | `[{'title':'Anyblock','baseUrl':'https://explorer.anyblock.tools','paths':{'tx':'/ethereum/poa/core/tx'}}]` | v1.0.x+ |

#### Network explorer configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| logo | `string` | URL to explorer logo file. Should be at least 40x40. | - | - | `'https://foo.app/icon.png'` |
| title | `string` | Displayed name of the explorer | Required | - | `Anyblock` |
| baseUrl | `string` | Base url of the explorer | Required | - | `https://explorer.anyblock.tools` |
| paths | `Record<'tx' \| 'block' \| 'address' \| 'token' \| 'blob', string>` | Map of explorer entities and their paths. Path can be a template with `:id` or `:id_lowercase` param, or a string (see note below) | Required | - | `{'tx':'/ethereum/poa/core/tx'}` |

*Note* If a path template contains `:id` or `:id_lowercase`, it will be replaced with the entity-id in its original case or lowercased respectively. If neither parameter is present, the entity-id will be appended to the end of the path in lowercase. For example, with baseUrl `https://explorer.anyblock.tools`:
- Path `{'tx':'/ethereum/poa/core/tx/:id/details'}` and entity-id `0x123...AbC` results in `https://explorer.anyblock.tools/ethereum/poa/core/tx/0x123...AbC/details`
- Path `{'tx':'/ethereum/poa/core/tx/:id_lowercase/details'}` and entity-id `0x123...AbC` results in `https://explorer.anyblock.tools/ethereum/poa/core/tx/0x123...abc/details`
- Path `{'tx':'/ethereum/poa/core/tx'}` and entity-id `0x123...AbC` results in `https://explorer.anyblock.tools/ethereum/poa/core/tx/0x123...abc`

&nbsp;

### API documentation

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_DOCS_TABS | `Array<TabId>` | Controls which tabs appear on the API documentation page. Possible values for `TabId` are `pro_api`, `rest_api`, `eth_rpc_api`, `rpc_api`, and `graphql_api`. **Note** that this variable has a default value, so the feature is enabled by default. Pass an empty array to disable it. The `pro_api` tab will be automatically added to the default value for chains supported in the Pro API. | - | `['rest_api','eth_rpc_api','rpc_api','graphql_api']` | `[]` | v2.3.x+ |
| NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE | `string` | Used for displaying custom alerts on the API documentation page. Could be a regular string or HTML code. | - | - | `Hello world! 🤪` | v2.7.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST](#user-operations-indexer-api) | Optional — adds user-ops tab |
| [NEXT_PUBLIC_PRO_API_SUPPORTED](#misc) | Optional — adds Pro API tab (auto-set at startup) |

&nbsp;

### Blockchain statistics

Chain stats and charts. Requires the [Stats API](#stats-api) to be configured.

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_STATS_API_HOST](#stats-api) | Required |

&nbsp;

### Bridged tokens

This feature allows users to view tokens that have been bridged from other EVM chains. Additional tab "Bridged" will be added to the tokens page and the link to original token will be displayed on the token page.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS | `Array<BridgedTokenChain>` where `BridgedTokenChain` can have following [properties](#bridged-token-chain-configuration-properties) | Used for displaying filter by the chain from which token where bridged. Also, used for creating links to original tokens in other explorers. | Required | - | `[{'id':'1','title':'Ethereum','short_title':'ETH','base_url':'https://eth.blockscout.com/token'}]` | v1.14.0+ |
| NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES | `Array<TokenBridge>` where `TokenBridge` can have following [properties](#token-bridge-configuration-properties) | Used for displaying text about bridges types on the tokens page. | Required | - | `[{'type':'omni','title':'OmniBridge','short_title':'OMNI'}]` | v1.14.0+ |

#### Bridged token chain configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| id | `string` | Base chain id, see [https://chainlist.org](https://chainlist.org) for the reference | Required | - | `1` |
| title | `string` | Displayed name of the chain | Required | - | `Ethereum` |
| short_title | `string` | Used for displaying chain name in the list view as tag | Required | - | `ETH` |
| base_url | `string` | Base url to original token in base chain explorer | Required | - | `https://eth.blockscout.com/token` |

*Note* The url to original token will be constructed as `<base_url>/<token_hash>`, e.g `https://eth.blockscout.com/token/<token_hash>`

#### Token bridge configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| type | `string` | Bridge type; should be matched to `bridge_type` field in API response | Required | - | `omni` |
| title | `string` | Bridge title | Required | - | `OmniBridge` |
| short_title | `string` | Bridge short title for displaying in the tags | Required | - | `OMNI` |

&nbsp;
### Chain variants

#### Beacon chain

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_BEACON_CHAIN | `boolean` | Set to true for networks with the beacon chain | Required | - | `true` | v1.0.x+ |
| NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY | `boolean` | Set to true for networks that have only withdrawals (no deposits) | - | - | `true` | v2.6.0+ |
| NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL | `string` | Beacon network currency symbol | - | `NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL` | `ETH` | v1.0.x+ |
| NEXT_PUBLIC_BEACON_CHAIN_VALIDATOR_URL_TEMPLATE | `string` | Url template to build a link to validator. Should contain `{pk}` string that will be replaced with the validator's public key | - | - | `https://example.com/beacon/{pk}/validator` | v2.3.0+ |

#### Celo

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CELO_ENABLED | `boolean` | Indicates that it is a Celo-based chain. | Required | - | `true` | v1.37.0+ |

#### MegaETH

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS | `string` | Public WebSocket endpoint for streaming statistics data, used to display information on the uptime dashboard page. | - | - | `wss://testnet-dashboard.megaeth.com/metrics` | v2.4.0+ |
| NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_RPC | `string` | Public WebSocket endpoint for streaming RPC node data, including mini-block data. | - | - | `wss://carrot.megaeth.com/mafia/ws` | v2.4.0+ |

#### SUAVE

For blockchains that implement SUAVE architecture additional fields will be shown on the transaction page ("Allowed peekers", "Kettle"). Users also will be able to see the list of all transactions for a particular Kettle in the separate view.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_SUAVE_CHAIN | `boolean` | Set to true for blockchains with [SUAVE architecture](https://writings.flashbots.net/mevm-suave-centauri-and-beyond) | Required | - | `true` | v1.14.0+ |

#### TAC (Ton Application Chain)

For Ton Application Chains, this feature enables additional views, such as a list of cross-chain operations and a detailed page for a specific cross-chain operation, as well as extra fields on the transaction page.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_TAC_TON_EXPLORER_URL | `string` | URL of the Ton chain explorer. This is used to build links to transactions and addresses on the Ton chain. | Required | - | `https://tonscan.org` | v2.1.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST](#tac-operation-lifecycle-api) | Required |

#### ZetaChain

ZetaChain cross-chain transaction (CCTX) pages and views on ZetaChain instances.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL | `string` | URL of configuration file (`.json` format only) which contains chains info for the supported chains. See [below](#zetachain-supported-chain-configuration-properties) for available properties. | - | - | `https://example.com/zetachain_chains_config.json` | v2.3.2+ |
| NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG | `Array<{ regex: string; template: string }>` | List of objects with regex, template and name fields to build redirect links for external searches. The first matching regex will be used to generate the URL from the provided hash. | - | - | `'[{"regex":"^0x[0-9a-fA-F]{64}$","template":"https://example.com/cosmos/tx/{hash}","name":"Cosmos SDK style transaction"}]'` | v2.4.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST](#zetachain-service-api) | Required |

#### ZetaChain supported chain configuration properties

| Property | Type | Description | Compulsoriness | Example value |
| --- | --- | --- | --- | --- |
| chain_id | `string` | Id of the chain | Required | `'11155111'` |
| chain_name | `string` | Displayed name of the chain | Required | `'Sepolia Testnet'` |
| chain_logo | `string` | Chain logo URL. Image should be at least 40x40 px | - | `'https://example.com/logo.svg'` |
| instance_url | `string` | Base URL of the blockscout explorer for the chain | - | `'https://eth-sepolia.blockscout.com/'` |
| address_url_template | `string` | Address url template on external explorer. `{hash}` will be replaced with the address hash | - | `'https://external.explorer.com/address/{hash}'` |
| tx_url_template | `string` | Transaction url template on external explorer. `{hash}` will be replaced with the transaction hash | - | `'https://external.explorer.com/tx/{hash}'` |

&nbsp;

### Connect wallet

Wallet connection support (read transactions, write to contract, etc.) via [Reown AppKit](https://cloud.reown.com/).

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID | `string` | Project id for [Reown AppKit](https://cloud.reown.com//) integration | Required | - | `<your-secret>` | v1.0.x+ |
| NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS | `Array<string>` | List of [featured wallet IDs](https://docs.reown.com/appkit/react/core/options#featuredwalletids) in the "Connect your wallet" modal. To obtain the wallet ID, please use [WalletGuide](https://walletguide.walletconnect.network). | - | - | `['c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576']` | v2.6.0+ |

&nbsp;

### Cross-chain transactions

This feature enables cross-chain transaction tracking and visualization, allowing users to view transactions that span multiple blockchains. It provides detailed information about cross-chain operations and links to related transactions on different chains.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED | `boolean` | The flag that enables the feature | Required | - | `true` | v2.7.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST](#interchain-indexer-api) | Required |

&nbsp;

### CSV export

Export of account/address data to CSV files. Gated by Google ReCaptcha.

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY](#google-recaptcha) | Required |

&nbsp;

### Data availability

This feature enables views related to blob transactions (EIP-4844), such as the Blob Txns tab on the Transactions page and the Blob details page.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED | `boolean` | Set to true to enable blob transactions views. | Required | - | `true` | v1.28.0+ |

&nbsp;

### DeFi dropdown

If the feature is enabled, a single button or a dropdown (if more than 1 item is provided) will be displayed at the top of the explorer page, which will take a user to the specified application in the marketplace or to an external site.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS | `[{ text: string; icon?: string; dappId?: string, url?: string, isEssentialDapp?: boolean }]` | An array of dropdown items containing the button text, icon name and dappId in Dappscout or an external url | - | - | `[{'text':'Swap','icon':'swap','dappId':'swap','isEssentialDapp':true},{'text':'Payment link','icon':'payment_link','dappId':'peanut-protocol'}]` | v1.31.0+ |

&nbsp;

### DEX pools

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_DEX_POOLS_ENABLED | `boolean` | Set to true to enable the feature | Required | - | `true` | v1.37.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_CONTRACT_INFO_API_HOST](#contract-info-api) | Required |

&nbsp;

### Easter eggs

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GAME_BADGE_CLAIM_LINK | `string` | Provide to enable the easter egg runner game feature | - | - | `https://example.com` | v1.37.0+ |
| NEXT_PUBLIC_PUZZLE_GAME_BADGE_CLAIM_LINK | `string` | Provide to enable the easter egg puzzle game feature | - | - | `https://example.com` | v2.2.0+ |

&nbsp;

### External transactions

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG | `{ chain_name: string; chain_logo_url: string; explorer_url_template: string; }` | Configuration of the external transactions links that should be added to the transaction details. | - | - | `{ chain_name: 'ethereum', chain_logo_url: 'https://example.com/logo.png', explorer_url_template: 'https://explorer.com/tx/{hash}' }` | v1.38.0+ |

&nbsp;

### Flashblocks

This feature allows users to view [Flashblocks](https://docs.base.org/base-chain/flashblocks/apps)-related content in the explorer, including the Flashblocks real-time feed. It currently supports only Base chains.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL | `string` | Public WebSocket endpoint to stream Flashblocks data | Required | - | `wss://mainnet.flashblocks.base.org/ws` | v2.3.0+ |

&nbsp;

### Gas tracker

This feature is **enabled by default**. To switch it off pass `NEXT_PUBLIC_GAS_TRACKER_ENABLED=false`.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GAS_TRACKER_ENABLED | `boolean` | Set to true to enable "Gas tracker" in the app | Required | `true` | `false` | v1.25.0+ |
| NEXT_PUBLIC_GAS_TRACKER_UNITS | Array<`usd` \| `gwei`> | Array of units for displaying gas prices on the Gas Tracker page, in the stats snippet on the Home page, and in the top bar. The first value in the array will take priority over the second one in all mentioned views. If only one value is provided, gas prices will be displayed only in that unit. | - | For testnets: `[ 'gwei' ]`, for mainnets: `[ 'usd', 'gwei' ]` | `[ 'gwei' ]` | v1.25.0+ |

&nbsp;

### Get gas button

If the feature is enabled, a Get gas button will be displayed in the top bar, which will take you to the gas refuel application in the marketplace or to an external site.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG | `{ name: string; url_template: string; dapp_id?: string; logo?: string }` | Get gas button config. See [below](#get-gas-button-configuration-properties) | - | - | `{ name: 'Need gas?', dapp_id: 'smol-refuel', url_template: 'https://smolrefuel.com/?outboundChain={chainId}', logo: 'https://example.com/icon.png' }` | v1.33.0+ |

#### Get gas button configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Text on the button | Required | - | `Need gas?` |
| url_template | `string` | Url template, may contain `{chainId}` variable | Required | - | `https://smolrefuel.com/?outboundChain={chainId}` |
| dapp_id | `string` | Set for open a Blockscout dapp page instead of opening external app page | - | - | `smol-refuel` |
| logo | `string` | Gas refuel application logo url | - | - | `https://example.com/icon.png` |

&nbsp;

### Hot contracts

Show the page with aggregate metrics for the most popular contracts.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HOT_CONTRACTS_ENABLED | `boolean` | Set to true to enable the feature | Required | - | `true` | v2.6.0+ |

&nbsp;

### Marketplace

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MARKETPLACE_ENABLED | `boolean` | `true` means that the marketplace page will be enabled | Required | - | `true` | v1.24.1+ |
| NEXT_PUBLIC_MARKETPLACE_CONFIG_URL | `string` | URL of configuration file (`.json` format only) which contains list of apps that will be shown on the marketplace page. See [below](#marketplace-app-configuration-properties) list of available properties for an app. Can be replaced with the [Admin Service API](#admin-service-api). | Required (alternative to `NEXT_PUBLIC_ADMIN_SERVICE_API_HOST`) | - | `https://example.com/marketplace_config.json` | v1.0.x+ |
| NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM | `string` | Link to form where authors can submit their dapps to the marketplace | Required | - | `https://airtable.com/shrqUAcjgGJ4jU88C` | v1.0.x+ |
| NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM | `string` | Link to form where users can suggest ideas for the marketplace | - | - | `https://airtable.com/appiy5yijZpMMSKjT/pag3t82DUCyhGRZZO/form` | v1.24.0+ |
| NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL | `string` | URL of configuration file (`.json` format only) which contains the list of categories to be displayed on the marketplace page in the specified order. If no URL is provided, then the list of categories will be compiled based on the `categories` fields from the marketplace (apps) configuration file | - | - | `https://example.com/marketplace_categories.json` | v1.23.0+ |
| NEXT_PUBLIC_MARKETPLACE_FEATURED_APP | `string` | ID of the featured application to be displayed on the banner on the Marketplace page | - | - | `uniswap` | v1.29.0+ |
| NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL | `string` | URL of the banner HTML content | - | - | `https://example.com/banner` | v1.29.0+ |
| NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL | `string` | URL of the page the banner leads to | - | - | `https://example.com` | v1.29.0+ |
| NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL | `string` | URL of the file (`.json` format only) which contains the list of The Graph links to be displayed on the Marketplace page | - | - | `https://example.com/graph_links.json` | v1.36.0+ |
| NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG | `EssentialDappsConfig`, see details [below](#essential-dapps-configuration-properties) | Configuration of the essential dapps to be displayed on the Marketplace page | - | - | `{'swap': {'chains': ['1', '10', '100', '11155111'], 'fee': '0.004', 'integrator': 'blockscout'}}` | v2.4.0+ |
| NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_AD_ENABLED | `boolean` | The flag enables ad in essential dapps. *Feature is enabled by default; pass `false` to disable it.* | - | `true` | `false` | v2.5.0+ |
| NEXT_PUBLIC_MARKETPLACE_TITLES | `{ entity_name?: string; menu_item?: string; title?: string; subtitle_essential_dapps?: string; subtitle_list?: string }` | Used to override default titles of the Marketplace and dapps | - | `{ 'entity_name': 'Dapp', 'menu_item': 'Dapps', 'title': 'Dappscout', 'subtitle_essential_dapps': 'Essential dapps', 'subtitle_list': 'Explore dapps' }` | `{ 'entity_name': 'App', 'menu_item': 'Apps', 'title': 'Marketplace', 'subtitle_essential_dapps': 'Essential apps', 'subtitle_list': 'Explore apps' }` | v2.5.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_ADMIN_SERVICE_API_HOST](#admin-service-api) | Required (alternative to `NEXT_PUBLIC_MARKETPLACE_CONFIG_URL`) |

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
| telegram | `string` | Displayed telegram link | - | `'https://t.me/poa_network'` |
| github | `string` | Displayed github link | - | `'https://github.com/blockscout'` |
| internalWallet | `boolean` | `true` means that the application can automatically connect to the Blockscout wallet. | - | `true` |
| priority | `number` | The higher the priority, the higher the app will appear in the list on the Marketplace page. | - | `7` |

#### Essential dapps configuration properties

Essential dapps are built-in dapps that are displayed on the Marketplace page in a separate section.

*Note* All chains should have a Blockscout instance. The current chain id should also be present in the `chains` array, if needed.

| Property | Type | Description | Compulsoriness | Example value |
| --- | --- | --- | --- | --- |
| swap | `{ url: string, chains: Array<string>, fee: string, integrator: string }` | Swap config | - | `{'url': 'https://example.com', 'chains': ['1'], 'fee': '0.004', 'integrator': 'blockscout'}` |
| revoke | `{ chains: Array<string> }` | Revoke config | - | `{'chains': ['100']}` |
| multisend | `{ chains: Array<string> }` | Multisend config | - | `{'chains': ['1', '10']}` |

&nbsp;

### MetaSuites extension

Enables [MetaSuites browser extension](https://github.com/blocksecteam/metasuites) to integrate with the app views.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_METASUITES_ENABLED | `boolean` | Set to true to enable integration | Required | - | `true` | v1.26.0+ |

&nbsp;

### Multichain button

If the feature is enabled, a Multichain balance button will be displayed on the address page, which will take you to the portfolio application in the marketplace or to an external site.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG | `[{ name: string; url_template: string; dapp_id?: string; logo: string }]` | Multichain portfolio application config. See [below](#multichain-button-configuration-properties) | - | - | `[{ name: 'zerion', url_template: 'https://app.zerion.io/{address}/overview', logo: 'https://example.com/icon.svg'}]` | v1.31.0+ |

#### Multichain button configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Multichain portfolio application name | Required | - | `zerion` |
| url_template | `string` | Url template to the portfolio. Should be a template with `{address}` variable | Required | - | `https://app.zerion.io/{address}/overview` |
| dapp_id | `string` | Set for open a Blockscout dapp page with the portfolio instead of opening external app page | - | - | `zerion` |
| logo | `string` | Multichain portfolio application logo (.svg) url | - | - | `https://example.com/icon.svg` |
| promo | `boolean` | Make the provider stand out by placing their logo prominently at the first place in the section and in the page subheader. | - | - | `true` |

&nbsp;
### Multichain explorer

This feature enables the application to act as an explorer of multiple blockchains united in one cluster. Please note that this feature is currently in demo mode, and a major part of the cross-chain views is not implemented and serves as a placeholder. These will be developed in the future.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MULTICHAIN_ENABLED | `boolean` | The flag that enables the feature | Required | - | `true` | v2.5.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST](#multichain-aggregator-api) | Required |
| [NEXT_PUBLIC_MULTICHAIN_CLUSTER](#multichain-aggregator-api) | Required |
| [NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST](#multichain-stats-api) | Required |

&nbsp;

### Name services

Resolve and display human-readable names for blockchain addresses. Supports BENS-style protocols and the Clusters.xyz universal name service.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS | `Array<string>` | List of the protocols used by the chain. The protocol ids can be obtained from [/api/v1/protocols](https://bens.services.blockscout.com/api/v1/protocols) resource. | - | `['ens']` | `['rns']` | v2.7.0+ |
| NEXT_PUBLIC_CLUSTERS_CDN_URL | `string` | CDN base URL for serving cluster profile images and avatars displayed in search results and cluster pages | - | `https://cdn.clusters.xyz` | `https://your-cdn.example.com` | v2.4.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_NAME_SERVICE_API_HOST](#bens-name-service-api) | Required for BENS-style protocols |
| [NEXT_PUBLIC_CLUSTERS_API_HOST](#clusters-api) | Required for the Clusters.xyz integration |

&nbsp;

### Rewards

Enables Blockscout Merits / rewards program. Requires the [Account](#account) and [Connect wallet](#connect-wallet) features to be enabled.

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_REWARDS_SERVICE_API_HOST](#rewards-service-api) | Required |

&nbsp;

### Rollup

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ROLLUP_TYPE | `'optimistic' \| 'arbitrum' \| 'shibarium' \| 'zkSync' \| 'scroll'` | Rollup chain type | Required | - | `'optimistic'` | v1.24.0+ |
| NEXT_PUBLIC_ROLLUP_PARENT_CHAIN | `ParentChain`, see details [below](#parent-chain-configuration-properties) | Configuration parameters for the parent chain. | Required | - | `{'baseUrl':'https://explorer.duckchain.io'}` | v1.38.0+ |
| NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL | `string` | URL for rollup to parent chain withdrawals (Optimistic stack only) | - | - | `https://app.optimism.io/bridge/withdraw` | v1.24.0+ |
| NEXT_PUBLIC_ROLLUP_LAYER_NUMBER | `number` | Layer number of the rollup | - | `2` | `3` | v2.7.0+ |
| NEXT_PUBLIC_ROLLUP_STAGE_INDEX | `1 \| 2` | Reflects the maturity and decentralization level of the chain based on [L2BEAT's framework](https://medium.com/l2beat/introducing-stages-a-framework-to-evaluate-rollups-maturity-d290bb22befe). The label will be added to the sidebar according to the provided stage index. Not applicable for testnets. | - | - | `1` | v2.1.0+ |
| NEXT_PUBLIC_FAULT_PROOF_ENABLED | `boolean` | Set to `true` for chains with fault proof system enabled (Optimistic stack only) | - | - | `true` | v1.31.0+ |
| NEXT_PUBLIC_INTEROP_ENABLED | `boolean` | Enables "Interop messages" page (Optimistic stack only) | - | `false` | `true` | v1.39.0+ |
| NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS | `boolean` | Set to `true` to display "Latest blocks" widget instead of "Latest batches" on the home page | - | - | `true` | v1.36.0+ |
| NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED | `boolean` | Enables "Output roots" page (Optimistic stack only) | - | `false` | `true` | v1.37.0+ |
| NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE | `string` | Hex-string for creating a link to the transaction batch on the [Celenium explorer](https://celenium.io). "0x"-format and 60 symbol length. Available only for Arbitrum roll-ups. | - | - | `0x00000000000000000000000000000000000000ca1de12a9905be97beaf` | v1.38.0+ |
| NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL | `string` | URL for the Selenium explorer. It is used to create links to the Data Availability Blobs page. The URL should contain the full path without any search parameters related to the blob, as these will be constructed at runtime for each blob separately. Available only for Optimistic or Arbitrum roll-ups. | - | - | `https://mocha.celenium.io/blob` | v2.0.2+ |

#### Parent chain configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| baseUrl | `string` | Base url of the chain explorer. | Required | - | `https://explorer.duckchain.io` |
| id | `number` | Chain id, see [https://chainlist.org](https://chainlist.org) for the reference. | - | - | `42` |
| name | `string` | Displayed name of the chain. Set to customize parent chain transaction status labels in the UI (e.g., "Sent to <chain-name>"). Currently, this setting is applicable only for Arbitrum-based chains. | - | - | `DuckChain` |
| rpcUrls | `Array<string>` | Chain public RPC server urls, see [https://chainlist.org](https://chainlist.org) for the reference. | - | - | `['https://rpc.duckchain.io']` |
| currency | `{ name: string; symbol: string; decimals: number; }` | Chain currency config. | - | - | `{ name: Quack, symbol: QUA, decimals: 18 }` |
| isTestnet | `boolean` | Set to true if network is testnet. | - | - | `true` |

&nbsp;

### Safe{Core} address tags

For the smart contract addresses which are [Safe{Core} accounts](https://safe.global/) public tag "Multisig: Safe" will be displayed in the address page header alongside to Safe logo.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SAFE_TX_SERVICE_URL | `string` | The Safe transaction service URL. See full list of supported networks [here](https://docs.safe.global/api-supported-networks). | - | - | `uniswap` | v1.26.0+ |

&nbsp;

### Solidity to UML

Solidity-to-UML smart contract visualizer.

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_VISUALIZE_API_HOST](#visualize-api) | Required |

&nbsp;

### Transaction interpretation

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER | `blockscout` \| `noves` \| `none` | Transaction interpretation provider that displays human readable transaction description | - | `none` | `blockscout` | v1.21.0+ |

&nbsp;

### User operations (ERC-4337)

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_HAS_USER_OPS | `boolean` | Set to true to show user operations related data and pages | - | - | `true` | v1.23.0+ |

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST](#user-operations-indexer-api) | Optional — adds the user-ops tab to the API documentation |

&nbsp;

### Validators

The feature enables the Validators page which provides detailed information about the validators of the PoS chains.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE | `'stability' \| 'blackfort' \| 'zilliqa'` | Chain type | Required | - | `'stability'` | v1.25.0+ |

&nbsp;

### Verified tokens

Verified-token information on token pages. Requires the [Contract Info API](#contract-info-api) to be configured.

**Dependencies**

| Variable | Compulsoriness |
| --- | --- |
| [NEXT_PUBLIC_CONTRACT_INFO_API_HOST](#contract-info-api) | Required |

&nbsp;

### Web3 wallet integration

This feature is **enabled by default** with the `['metamask']` value. To switch it off pass `NEXT_PUBLIC_WEB3_WALLETS=none`.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_WEB3_WALLETS | `Array<'metamask' \| 'coinbase' \| 'token_pocket' \| 'rabby' \| 'trust' \| 'okx'>` | Array of Web3 wallets which will be used to add tokens or chain to. The first wallet which is enabled in user's browser will be shown. | - | `[ 'metamask', 'rabby', 'coinbase', 'trust', 'okx', 'token_pocket' ]` | `[ 'coinbase' ]` | v1.10.0+ |
| NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET | `boolean` | Set to `true` to hide icon "Add to your wallet" next to token addresses | - | - | `true` | v1.0.x+ |

&nbsp;

### X-Star score

This feature allows the integration of an XStar API to fetch XHS score for addresses. When configured, if the API returns a score, a public tag with that score will be displayed in the address page header.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_XSTAR_SCORE_URL | `string` | XStar XHS score documentation URL for the address tag. Enables the XStar score feature. | - | - | `https://docs.xname.app/the-solution-adaptive-proof-of-humanity-on-blockchain/xhs-scoring-algorithm` | v1.36.0+ |

&nbsp;

## External services

### Google Analytics

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID | `string` | Property ID for [Google Analytics](https://analytics.google.com/) service | Required | - | `UA-XXXXXX-X` | v1.0.x+ |

&nbsp;

### Google ReCaptcha

To obtain the variable values, please refer to the [reCAPTCHA documentation](https://developers.google.com/recaptcha) and check the [Blockscout reCAPTCHA config docs](https://docs.blockscout.com/setup/configuration-options/recaptcha). Please note that we currently support only **reCAPTCHA v2 in invisible mode**, read more [here](https://developers.google.com/recaptcha/docs/versions#recaptcha_v2_invisible_recaptcha_badge).

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY | `string` | Google reCAPTCHA v2 site key | Required | - | `<your-site-key>` | v1.0.x+ |

&nbsp;

### GrowthBook

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY | `string` | Client SDK key for [GrowthBook](https://www.growthbook.io/) service | Required | - | `<your-secret>` | v1.22.0+ |

&nbsp;

### Mixpanel

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN | `string` | Project token for [Mixpanel](https://mixpanel.com/) analytics service | Required | - | `<your-secret>` | v1.1.0+ |
| NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES | `string` | Pass a JSON-like string that represents a subset of the [Mixpanel SDK configuration](https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#library-configuration) to override the project's default properties. | - | - | `{"record_sessions_percent": 0.5}` | v2.3.0+ |

&nbsp;

### OpenTelemetry

OpenTelemetry SDK for the Node.js server-side process. Configure the OpenTelemetry Protocol Exporter using the generic environment variables described in the [OT docs](https://opentelemetry.io/docs/specs/otel/protocol/exporter/#configuration-options). Note that this Next.js feature is currently experimental. The Docker image must be built with `NEXT_OPEN_TELEMETRY_ENABLED=true` to enable it.

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| OTEL_SDK_ENABLED | `boolean` | Run-time flag to enable the SDK | Required | `false` | `true` | v1.18.0+ |

&nbsp;

### Rollbar

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN | `string` | Client token for your Rollbar project | Required | - | `<your-secret>` | v1.37.x+ |

&nbsp;

### Usercentrics CMP

Integrates [Usercentrics](https://usercentrics.com/) as the Consent Management Platform (CMP). When configured, Blockscout loads the Usercentrics script and waits for marketing consent before enabling analytics providers.

| Variable | Type| Description | Compulsoriness  | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_USERCENTRICS_CONFIG | `{ settingsId?: string; rulesetId?:string }` | Usercentrics configuration with `settingsId` or `rulesetId`. When set, Blockscout injects the CMP script and gates Google Analytics, Mixpanel, Rollbar and other 3rd party services behind marketing consent. The feature is disabled in private mode. | Required | - | `{ 'settingsId': '<your-settings-id>','rulesetId':'<your-ruleset-id>'}` | v2.9.0+ |
| NEXT_PUBLIC_USERCENTRICS_DRAFT | `boolean` | Set to `true` to load the Usercentrics CMP configuration in its draft (unpublished) version. Intended for previewing consent configuration changes before publishing. | - | - | `true` | v2.9.0+ |

## Misc

### Design system

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FONT_FAMILY_HEADING | `FontFamily`, see full description [below](#font-family-configuration-properties) | Special typeface to use in page headings (`<h1>`, `<h2>`, etc.) | - | - | `{'name':'Montserrat','url':'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'}` | v1.35.0+ |
| NEXT_PUBLIC_FONT_FAMILY_BODY | `FontFamily`, see full description [below](#font-family-configuration-properties) | Main typeface to use in page content elements. | - | - | `{'name':'Raleway','url':'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap'}` | v1.35.0+ |

#### Font family configuration properties

| Variable | Type | Description | Compulsoriness | Default value | Example value |
| --- | --- | --- | --- | --- | --- |
| name | `string` | Font family name; used to define the `font-family` CSS property. | Required | - | `Montserrat` |
| url | `string` | URL for external font. Ensure the font supports the following weights: 400, 500, 600, and 700. | Required | - | `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap` |

&nbsp;

### Pro API support

| Variable | Type | Description | Compulsoriness | Default value | Example value | Version |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_PRO_API_SUPPORTED | `boolean` | Indicates whether the current chain is supported by Blockscout Pro API. **This variable is automatically set during container startup**; manual configuration is typically not needed. | - | - | `true` | v2.9.0+ |
