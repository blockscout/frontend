<h1 align="center">Blockscout frontend</h1>

<p align="center">
    <span>Frontend application for </span>
    <a href="https://github.com/blockscout/blockscout/blob/master/README.md">Blockscout</a>
    <span> blockchain explorer</span>
</p>

## Running and configuring the app

App is distributed as a docker image. Here you can find information about the [package](https://github.com/blockscout/frontend/pkgs/container/frontend) and its recent [releases](https://github.com/blockscout/frontend/releases).

You can configure your app by passing necessary environment variables when starting the container. See full list of ENVs and their description [here](./docs/ENVS.md).

```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> ghcr.io/blockscout/frontend:latest
```

Alternatively, you can build your own docker image and run your app from that. Please follow this [guide](./docs/CUSTOM_BUILD.md).

For more information on migrating from the previous frontend, please see the [frontend migration docs](https://docs.blockscout.com/for-developers/frontend-migration).

## Contributing

See our [Contribution guide](./docs/CONTRIBUTING.md) for pull request protocol. We expect contributors to follow our [code of conduct](./CODE_OF_CONDUCT.md) when submitting code or comments.

## Resources
- [App ENVs list](./docs/ENVS.md)
- [Contribution guide](./docs/CONTRIBUTING.md)
- [Making a custom build](./docs/CUSTOM_BUILD.md)
- [Frontend migration guide](https://docs.blockscout.com/for-developers/frontend-migration)
- [Manual deployment guide with backend and microservices](https://docs.blockscout.com/for-developers/deployment/manual-deployment-guide)

## License

[![License: GPL v3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Common Setup Errors

### Unexpected argument NEXT_PUBLIC_GIT_TAG=
The error message `Unexpected argument NEXT_PUBLIC_GIT_TAG=. Expected variable in format variable=value` indicates that the environment variable `NEXT_PUBLIC_GIT_TAG` is not being set correctly, likely because the command to retrieve the Git tag failed, resulting in an empty value.

**Steps to Resolve the Issue:**
1. Check if there are any tags in your Git repository:
   ```sh
   git tag
   ```
   If your repository does not have any tags, the command `git describe --tags --abbrev=0` will fail, leading to an empty value for `NEXT_PUBLIC_GIT_TAG`.
   
2. If there are no tags, you can create one with:
   ```sh
   git tag v1.0.0

### error Command "icons" not found
This error indicates that the icons command is not recognized. It seems like you might be missing a dependency or script in your package.json.

**Steps to Resolve the Issue:**
1. Install the necessary dependency using Yarn:
   ```sh
   yarn add -D @icons
   ```

