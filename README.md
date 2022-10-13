[Design](https://www.figma.com/file/07zoJSAP7Vo655ertmlppA/My_Account?node-id=279%3A1006) | [API Doc](https://github.com/blockscout/blockscout-account/blob/account/apps/block_scout_web/API.md) | [Swagger](https://app.swaggerhub.com/apis/NIKITOSING4/blockscout-account-api/1.0)

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
To perform testing locally you need to install docker and run `yarn test-docker`

## Environment variables
### Variables list
The app instance could be customized by passing following variables to NodeJS environment at runtime.

**IMPORTANT NOTE!** For _production_ build purposes all json-like values should be single-quoted

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_NETWORK_NAME | `string` | Displayed name of the network | `Gnosis Chain` |
| NEXT_PUBLIC_NETWORK_SHORT_NAME | `string` *(optional)* | Used for SEO attributes (page title and description) | `OoG` |
| NEXT_PUBLIC_NETWORK_TYPE | `string` | Network type (used as first part of the base path) | `xdai` |
| NEXT_PUBLIC_NETWORK_SUBTYPE | `string` | Network subtype (used as second part of the base path) | `mainnet` |
| NEXT_PUBLIC_NETWORK_ID | `number` | Chain id, see [https://chainlist.org/](https://chainlist.org/) for the reference | `99` |
| NEXT_PUBLIC_NETWORK_CURRENCY | `string` | Network currency symbol | `xDAI` |
| NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS | `string` | Address of network's native token | `0x029a799563238d0e75e20be2f4bda0ea68d00172` |
| NEXT_PUBLIC_NETWORK_ASSETS_PATHNAME | `string` *(optional)* | Network name for constructing url of token logos according to template `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${assetsNamePath}/assets/${tokenAddress}/logo.png`. It should match network name in TrustWallet assets repo, see the full list [here](https://github.com/trustwallet/assets/tree/master/blockchains). If not provided, the network type will be used as its assets path part | `ethereum` |
| NEXT_PUBLIC_NETWORK_LOGO | `string` *(optional)* | Network logo; if not provided, will fallback to logo predefined in the project; if the project doesn't have logo for such network then the common placeholder will be shown; *Note* that logo height should be 20px and width less than 120px | `https://www.fillmurray.com/240/40` |
| NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED | `boolean` *(optional)* | Set to true if network has account feature | `true` |
| NEXT_PUBLIC_FEATURED_NETWORKS | `Array<FeaturedNetwork>` where `FeaturedNetwork` can have following [properties](#network-configuration-properties) | Configuration of featured networks that will be shown in the app menu | `[{'title':'Gnosis Chain','basePath':'/xdai/mainnet','group':'mainnets'}]` |
| NEXT_PUBLIC_BLOCKSCOUT_VERSION | `string` *(optional)* | Current running version of Blockscout (used to display link to release in the footer) |
| NEXT_PUBLIC_FOOTER_GITHUB_LINK | `string` *(optional)* | Link to Github in the footer | `https://github.com/blockscout/blockscout` |
| NEXT_PUBLIC_FOOTER_TWITTER_LINK | `string` *(optional)* | Link to Twitter in the footer | `https://www.twitter.com/blockscoutcom` |
| NEXT_PUBLIC_FOOTER_TELEGRAM_LINK | `string` *(optional)* | Link to Telegram in the footer | `https://t.me/poa_network` |
| NEXT_PUBLIC_FOOTER_STAKING_LINK | `string` *(optional)* | Link to staking dashboard in the footer | `https://duneanalytics.com/maxaleks/xdai-staking` |
| NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM | `string` | Link to form where authors can submit their dapps to the marketplace | `https://airtable.com/shrqUAcjgGJ4jU88C` |
| NEXT_PUBLIC_APP_INSTANCE | `string` *(optional)* | Name of app instance | `wonderful_kepler` |
| NEXT_PUBLIC_APP_PROTOCOL | `http \| https` *(optional)* | App protocol (`https` used as default value) | `https` |
| NEXT_PUBLIC_APP_HOST | `string` | App host | `blockscout.com` |
| NEXT_PUBLIC_APP_PORT | `number` *(optional)* | Port where app is running. Have to be provided if it is different to default port | `3000` |
| NEXT_PUBLIC_API_ENDPOINT | `string` *(optional)* | By default the API endpoint base URL will be set as `https://blockscout.com`. If it is not the case, pass the API endpoint base URL in this variable  | `https://blockscout.com` |
| NEXT_PUBLIC_API_BASE_PATH | `string` *(optional)* | Base path for API endpoint url  | `/poa/core` |
| NEXT_PUBLIC_SENTRY_DSN | `string` *(optional)* | Client key for your Senty.io app | `<secret>` |
| SENTRY_CSP_REPORT_URI | `string` *(optional)* | URL for sending CSP-reports to your Senty.io app | `<secret>` |

### Featured network configuration properties

| Property | Type | Description | Example value
| --- | --- | --- | --- |
| title | `string` | Displayed name of the network | `'Gnosis Chain'` |
| basePath | `string` | Network explorer main page url | `'/xdai/mainnet'` |
| group | `mainnets \| testnets \| other` | Indicates in which tab network appears in the menu | `'mainnets'` |
| icon | `string` *(optional)* | Network icon; if not provided, will fallback to  icon predefined in the project; if the project doesn't have icon for such network then the common placeholder will be shown; *Note* that icon size should be 30px by 30px | `'https://www.fillmurray.com/60/60'` |

*Note* the base path for the network is built up from its `type` and `subType` like so `https://blockscout.com/<type>/<subType>`

### Sentry.io setup

TBD