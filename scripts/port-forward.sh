#!/bin/bash

. ./scripts/proxy.cfg

# Forward utility http server port
adb reverse tcp:3002 tcp:3002

# Forward mark native proxy addon port
adb forward tcp:3001 tcp:8765

# Forward ssh port
adb forward "tcp:$PORT" tcp:22