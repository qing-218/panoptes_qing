#!/bin/bash

. ./scripts/adb-utils.sh
. ./scripts/proxy.cfg

IS_GUI=
SAVE_RES_BODY='false'

while getopts 'rg' flag; do
   case "${flag}" in
      g) IS_GUI=1 ;;
      r) SAVE_RES_BODY='true' ;;
      *) echo "Usage: $0 [-g (enable gui)]"
         exit 1 ;;
    esac
done

# Exit if any command fails
set -e

# Port forward
./scripts/port-forward.sh

# Update proxy addons
rsync -Lru -e "ssh -p $PORT" ./addons/* "$HOST:$ADDONS_PATH"

# Install dependencies and generate certificate
ssh "${SSH_ARGS[@]}" make

# Get certificate
./scripts/get-addon-file.sh mitmproxy.cer ./

PROXY_ARGS=(
  --ssl-insecure
  --anticache
  --mode transparent
  --showhost
  --scripts mark-native.py
  --set console_mouse=false
  --set block_global=false
  --set "save_res_body=$SAVE_RES_BODY"
)

# Start proxy
if [ -n "$IS_GUI" ]; then
  ssh -t "${SSH_ARGS[@]}" mitmproxy "${PROXY_ARGS[@]}"
else
  ssh -t "${SSH_ARGS[@]}" mitmdump "${PROXY_ARGS[@]}"
fi



