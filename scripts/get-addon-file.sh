#!/bin/bash

. ./scripts/proxy.cfg

scp -P "$PORT" "$HOST:$ADDONS_PATH/$1" "$2"