#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Usage: npm run compile -- SCRIPT_PATH [OPTIONS]'
    exit 1
fi

frida-compile "$@" -o "./dist/$(basename "$1")"