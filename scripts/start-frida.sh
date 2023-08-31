#!/bin/bash

. ./scripts/adb-utils.sh

trap 'adb_sudo killall frida-server' EXIT
adb_sudo /data/local/tmp/frida-server
