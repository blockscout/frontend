#!/bin/bash

./replace_envs.sh

echo "starting Nextjs"
exec "$@"