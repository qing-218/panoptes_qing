#!/bin/bash

#Usage: intercept-traffic.sh [PACKAGE]

./scripts/install-cert.sh system
./scripts/config-iptables.sh "$1"

./scripts/adb-sudo.sh pm clear "$1"
frida -U -f "$1" -l ./fridaScripts/available/certUnpinning.js --kill-on-exit

./scripts/config-iptables.sh reset
./scripts/install-cert.sh reset