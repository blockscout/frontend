<h1 align="center">Blockscout frontend app</h1>

<p align="center">
    <span>Frontend application for </span>
    <a href="https://github.com/blockscout/blockscout/blob/master/README.md">Blockscout</a>
    <span> blockchain explorer</span>
</p>


## App running and configuration

App is distributed as a docker image. Info about the package and its recent releases you can find [here](https://github.com/blockscout/frontend/pkgs/container/frontend).

You can configure your app by passing necessary environment variables when stating a container. See full list of envs and their description [here](./docs/ENVS.md).

## Development

### Technology stack

Core technologies what used in the project are
- [yarn](https://yarnpkg.com/) as package manager
- [React](https://reactjs.org/) as UI library
- [Next.js](https://nextjs.org/) as application framework
- [Chakra](https://chakra-ui.com/) as component library; our theme customization could be found in `/theme` folder
- [jest]() as JavaScript testing framework
- [playwright](https://playwright.dev/) as a tool for components visual testing

And of course our premier language is [Typescript](https://www.typescriptlang.org/)

-----
### Local Development

**Pre-requisites** You should have installed Node.js v16. The best way to manage your local Node.js version is [nvm](https://github.com/nvm-sh/nvm)

For local development please follow next steps:
- clone repo
- install dependencies with `yarn`
- clone `.env.example` into `configs/envs/.env.secrets` and fill it with necessary secret values (see description [below](#environment-variables))
- to spin up local dev server
    - for predefined networks configs (see full available list in `package.json`) you can just run `yarn dev:<app_name>`
    - for custom network setup create `.env.local` file with all required environment variables from the [list](#environment-variables) and run `yarn dev`
- navigate to the host from logs output

### Components visual testing

We use [playwright experimental components testing](https://playwright.dev/docs/test-components) for visual (screenshots) CI check. Test renders a single component in headless browser in docker, generates screenshots and then compares this screenshot with a reference one.
To perform testing locally you need to install docker and run `yarn test:pw:docker`

### Building and running your own docker image

For building a docker image simply run `yarn build:docker` or alternatively run `docker build` and pass your own args.

For running app container from freshly built image with your local env config at `./.end.local` use `yarn start:docker:local` command or run `docker run` manually.

*Disclaimer* Do no try to generate production build of the app on your local machine (outside the docker), it will fail.