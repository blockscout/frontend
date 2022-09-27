[Design](https://www.figma.com/file/07zoJSAP7Vo655ertmlppA/My_Account?node-id=279%3A1006) | [API Doc](https://github.com/blockscout/blockscout-account/blob/account/apps/block_scout_web/API.md) | [Swagger](https://app.swaggerhub.com/apis/NIKITOSING4/blockscout-account-api/1.0)

-----
## Technology stack

Core technologies what used in the project are
- [yarn](https://yarnpkg.com/) as package manager
- [React](https://reactjs.org/) as UI library
- [Next.js](https://nextjs.org/) as application framework
- [Chakra](https://chakra-ui.com/) as component library; our theme customization could be found in `/theme` folder
- [css-modules](https://github.com/css-modules/css-modules) as lib for styling custom components

And of course our premier language is [Typescript](https://www.typescriptlang.org/)

-----
## Local Development

For local development please follow next steps:
- clone repo
- install dependencies with `yarn`
- create local env file `env.local` according to `env.example` snapshot (see list of used environment variables [below](#environment-variables))
- run `yarn dev` to spin up local dev server and navigate to the host from logs output

## Environment variables
### Variables list
The app instance could be customized by passing following variables to NodeJS environment.

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_BLOCKSCOUT_VERSION | `string` | Current running version of Blockscout (used to display link to release in the footer) |
| NEXT_PUBLIC_FOOTER_GITHUB_LINK | `string` | Link to Github in the footer | `https://github.com/blockscout/blockscout` |
| NEXT_PUBLIC_FOOTER_TWITTER_LINK | `string` | Link to Twitter in the footer | `https://www.twitter.com/blockscoutcom` |
| NEXT_PUBLIC_FOOTER_TELEGRAM_LINK | `string` | Link to Telegram in the footer | `https://t.me/poa_network` |
| NEXT_PUBLIC_FOOTER_STAKING_LINK | `string` | Link to staking dashboard in the footer | `https://duneanalytics.com/maxaleks/xdai-staking` |
| NEXT_PUBLIC_SUPPORTED_NETWORKS | `Array<Network>` where `Network` can have following [properties](#network-configuration-properties) | Configuration of supported networks | `[{"name":"POA","type":"poa","subType":"core","group":"mainnets","isAccountSupported":true,"chainId":99,"currency":"POA"}]` |

### Network configuration properties

| Property | Type | Description | Example value
| --- | --- | --- | --- |
| name | `string` | Displayed name of the network | `"Gnosis Chain"` |
| shortName | `string` | Used for SEO attributes (page title and description) | `"OoG"` |
| chainId | `number` | Id of the network. Could be found here – [https://chainlist.org/](https://chainlist.org/) | `1` |
| currency | `string` | Network currency symbol. Could be found here – [https://chainlist.org/](https://chainlist.org/) | `"xDAI"` |
| nativeTokenAddress | `string` | Address of network's native token | `"0x029a799563238d0e75e20be2f4bda0ea68d00172"` |
| type | `string` | Network type (used as first part of the base path) | `"xdai"` |
| subType | `string` | Network subtype (used as second part of the base path) | `"mainnet"` |
| group | `mainnets \| testnets \| other` | Indicates in which tab network appears in the menu | `"mainnets"` |
| isAccountSupported | `boolean` *(optional)* | Set to true if network has account feature | `true` |
| icon | `string` *(optional)* | Network icon; if not provided, will fallback to  icon predefined in the project; if the project doesn't have icon for such network then the common placeholder will be shown; *Note* that icon size should be 30px by 30px | `"https://www.fillmurray.com/60/60"` |
| logo | `string` *(optional)* | Network logo; if not provided, will fallback to logo predefined in the project; if the project doesn't have logo for such network then the common placeholder will be shown; *Note* that logo height should be 20px and width less than 120px | `"https://www.fillmurray.com/240/40"` |
| assetsNamePath | `string` *(optional)* | Network name for constructing url of token logos according to template `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${assetsNamePath}/assets/${tokenAddress}/logo.png`. It should match network name in TrustWallet assets repo, see the full list [here](https://github.com/trustwallet/assets/tree/master/blockchains). The project already has some pre-defined mapping for popular network, which is match assetsNamePath against provided network type and sub-type. So typically you don't need to provide this variable, if you network is in the list or its type in config is conformed to a name in TrustWallet repo. If it is not the case, pass value here | `"ethereum"` |

*Note* the base path for the network is built up from its `type` and `subType` like so `https://blockscout.com/<type>/<subType>`
