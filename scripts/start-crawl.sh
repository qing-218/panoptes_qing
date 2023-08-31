#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Usage: npm start -- BROWSER_DIR'
    exit 1
fi

(cd "$1" && ts-node index.ts)