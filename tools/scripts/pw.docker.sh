#!/bin/bash

yarn install --modules-folder node_modules_linux

export NODE_PATH=$(pwd)/node_modules_linux

yarn test:pw "$@"
