#!/bin/bash

#Usage: config-iptables.sh PACKAGE_NAME

. ./scripts/adb-utils.sh

# Clear previous configuration
adb_sudo iptables -N BlockQuick '&&' iptables -I OUTPUT -j BlockQuick '||' iptables -F BlockQuick
adb_sudo iptables -t nat -N MitmProxy '&&' iptables -t nat -I OUTPUT -j MitmProxy '||' iptables -t nat -F MitmProxy

if [ "$1" = "reset" ]; then
  exit 0
fi

if [[ "$(adb_sudo cat /data/system/packages.list)" =~ "$1 "([0-9]+) ]]; then
  APP_UID="${BASH_REMATCH[1]}"
  echo "Found app UID: $APP_UID"

  # Block quic traffic
  adb_sudo iptables -A BlockQuick -p udp --dport 80 -j DROP
  adb_sudo iptables -A BlockQuick -p udp --dport 443 -j DROP

  # Redirect traffic to proxy
  adb_sudo iptables -t nat -A MitmProxy -p tcp --dport 80 -m owner --uid-owner "$APP_UID" -j DNAT --to 127.0.0.1:8080
  adb_sudo iptables -t nat -A MitmProxy -p tcp --dport 443 -m owner --uid-owner "$APP_UID" -j DNAT --to 127.0.0.1:8080
else
  echo "Failed to find app UID"
  exit 1
fi

