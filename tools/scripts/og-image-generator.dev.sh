#!/bin/bash

# use this script for testing the og image generator

config_file="./configs/envs/.env.eth"

dotenv \
  -e $config_file \
  -- bash -c 'node ./deploy/scripts/og_image_generator.js'