#!/bin/sh
yarn install --modules-folder node_modules_linux
export NODE_PATH=$(pwd)/node_modules_linux
rm -rf ./playwright/.cache
yarn test:pw "$@"