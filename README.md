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

**Pre-requisites** You should have installed Node.js v16. The best way to manage your local Node.js version is [nvm](https://github.com/nvm-sh/nvm)

For local development please follow next steps:
- clone repo
- install dependencies with `yarn`
- clone `env.example` into local env file `env.local` (see explanation of all used environment variables [below](#environment-variables))
- run `yarn dev` to spin up local dev server and navigate to the host from logs output

## Environment variables
### Variables list
The app instance could be customized by passing following variables to NodeJS environment.

**IMPORTANT NOTE!** For _production_ build purposes all json-like values should be single-quoted

| Variable | Type | Description | Default value
| --- | --- | --- | --- |
| NEXT_PUBLIC_BLOCKSCOUT_VERSION | `string` *(optional)* | Current running version of Blockscout (used to display link to release in the footer) |
| NEXT_PUBLIC_FOOTER_GITHUB_LINK | `string` *(optional)* | Link to Github in the footer | `https://github.com/blockscout/blockscout` |
| NEXT_PUBLIC_FOOTER_TWITTER_LINK | `string` *(optional)* | Link to Twitter in the footer | `https://www.twitter.com/blockscoutcom` |
| NEXT_PUBLIC_FOOTER_TELEGRAM_LINK | `string` *(optional)* | Link to Telegram in the footer | `https://t.me/poa_network` |
| NEXT_PUBLIC_FOOTER_STAKING_LINK | `string` *(optional)* | Link to staking dashboard in the footer | `https://duneanalytics.com/maxaleks/xdai-staking` |
| NEXT_PUBLIC_SUPPORTED_NETWORKS | `Array<Network>` where `Network` can have following [properties](#network-configuration-properties) | Configuration of supported networks | `[{'name':'Gnosis Chain','type':'xdai','subType':'mainnet','group':'mainnets','isAccountSupported':true, 'chainId': 100,'icon':'https://www.fillmurray.com/60/60','logo':'https://www.fillmurray.com/240/40'}]` |

### Network configuration properties

| Property | Type | Description | Example value
| --- | --- | --- | --- |
| name | `string` | Displayed name of the network | `'Gnosis Chain'` |
| chainId | `number` | Id of the network. Could be seen there – [https://chainlist.org/](https://chainlist.org/) | `1` |
| type | `string` | Network type (used as first part of the base path) | `'xdai'` |
| subType | `string` | Network subtype (used as second part of the base path) | `"mainnet"` |
| group | `mainnets \| testnets \| other` | Indicates in which tab network appears in the menu | `'mainnets'` |
| isAccountSupported | `boolean` *(optional)* | Set to true if network has account feature | `true` |
| icon | `string` *(optional)* | Network icon; if not provided, will fallback to  icon predefined in the project; if the project doesn't have icon for such network then the common placeholder will be shown; *Note* that icon size should be 30px by 30px | `'https://www.fillmurray.com/60/60'` |
| logo | `string` *(optional)* | Network logo; if not provided, will fallback to logo predefined in the project; if the project doesn't have logo for such network then the common placeholder will be shown; *Note* that logo height should be 20px and width less than 120px | `'https://www.fillmurray.com/240/40'` |

*Note* the base path for the network is built up from its `type` and `subType` like so `https://blockscout.com/<type>/<subType>`

### Sentry.io setup

TBD