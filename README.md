# Zenchain Explorer Frontend

Zenchain Explorer is a comprehensive block explorer and analytics platform tailored for the Zenchain blockchain. Originating as a fork from Blockscout, the Zenchain Explorer has undergone significant enhancements to improve functionality and ease of deployment across various operating systems.

The Zenchain Explorer ecosystem consists of the following components:

* Zenchain Explorer Backend <https://github.com/zenchain-protocol/zenchain-explorer-backend>
* Zenchain Explorer Frontend (**the current repository**)
* Zenchain Explorer Rust Services <https://github.com/zenchain-protocol/zenchain-explorer-rs>

# Development environment configuration

The process of setting up the development environment for Zenchain Explorer Frontend, which is built using the Next.js, differs depending on the operating system in use. This tutorial is designed to guide you through the preparation of your development environment, tailored to each of these operating systems.

## Dependencies

To successfully compile your code, it's essential to first install the required dependencies, with the installation process varying depending on your operating system.

### Git

Git is needed to get code from repositories.

#### Linux/WSL (Windows Subsystem for Linux)

Follow the instructions based on your Linux distribution (WSL by default installs Ubuntu) <https://git-scm.com/download/linux>

#### MacOS

Install Homebrew <https://brew.sh> and execute the following command:

```bash
brew install git
```

#### Windows

Download and execute the installer based on your architecture <https://git-scm.com/download/win>

### Node.js

Node.js is essential for managing Frontend dependencies and compiling the application.

#### Linux/MacOS/WSL (Windows Subsystem for Linux)

Execute the following commands (Ubuntu as reference, for updates please check <https://nodejs.org/en/download/package-manager>):

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
```

after installation restart the shell.

#### Windows

Download and execute the installer (for updates please check <https://nodejs.org/en/download>) <https://nodejs.org/dist/v20.12.2/node-v20.12.2-x64.msi>

### Yarn

It's the package manager used by Zenchain Explorer Frontend.

#### Linux/MacOS/WSL (Windows Subsystem for Linux)/Windows

Execute the following command:

```
npm install --global yarn
```

after installation restart the shell.

## How to compile

Create a new folder, open it in the terminal and execute:

```text
git clone https://github.com/zenchain-protocol/zenchain-explorer-frontend
```

authenticate to GitHub, after confirmation, git starts cloning the repository.

Open `zenchain-explorer-frontend` folder and execute:

```bash
yarn
```

## Check and change environment variables

All supported environment variables are detailed in the [docs](docs) folder. Create a `.env` file starting from `.env.example`, edit variables as needed.
To start the application without errors, beside already defined, it's mandatory to set few environment variables like `NEXT_PUBLIC_SENTRY_DSN` and `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`.

## Docker based development

You can also build and run the frontend within Docker directly.

```bash
docker compose up -d
```

starts a container using the `zenchain-explorer/frontend` built image and starts listening using the port `3000` (NEXT_PUBLIC_APP_PORT).

# Start the application locally

You can start the application locally for development:

## Building assets and envs scripts

#### Linux/MacOS/WSL (Windows Subsystem for Linux)

Execute the following command:

```
yarn dev
```

once compiled, starts listening using the port `3000` (NEXT_PUBLIC_APP_PORT). 

## With prebuilt assets and envs scripts

Only if you already built assets and envs scripts at least once.

#### Linux/MacOS/WSL (Windows Subsystem for Linux)/Windows

Execute the following command:

```
yarn run dev:p
```

then starts listening using the port `3000` (NEXT_PUBLIC_APP_PORT).

# Deployment

When you're ready for deployment, we recommend using the Zenchain Explorer Backend <https://github.com/zenchain-protocol/zenchain-explorer-backend> through Docker containers. The provided Docker Compose file will automatically download and compile this repository.
Please ensure that you configure the frontend-related environment variables located at <https://github.com/zenchain-protocol/zenchain-explorer-backend/blob/master/docker-compose/envs/common-frontend.env> before proceeding with deployment.
