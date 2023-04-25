#!/bin/bash

targetFile='./playwright/envs.js'

declare -a envFiles=('./configs/envs/.env.pw')

touch $targetFile;
truncate -s 0 $targetFile;

echo "Creating script file with envs"

echo "window.process = { env: { } };" >> $targetFile;

for envFile in "${envFiles[@]}"
do
    # read each env file
    while read line; do
        # if it is a comment or an empty line, continue to next one
        if [ "${line:0:1}" == "#" ] || [ "${line}" == "" ]; then
            continue
        fi

        # split by "=" sign to get variable name and value
        configName="$(cut -d'=' -f1 <<<"$line")";
        configValue="$(cut -d'=' -f2- <<<"$line")";

        # if there is a value, escape it and add line to target file
        escapedConfigValue=$(echo $configValue | sed s/\'/\"/g);
        echo "window.process.env.${configName} = localStorage.getItem('${configName}') ?? '${escapedConfigValue}';" >> $targetFile;
    done < $envFile
done

echo "Done"