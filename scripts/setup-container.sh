#!/bin/bash

. ./scripts/proxy.cfg

./scripts/port-forward.sh
./scripts/adb-sudo.sh chmod +x /data/local/tmp/frida-server

ssh-copy-id -p "$PORT" "$HOST"
ssh -t -p "$PORT" "$HOST" '
  echo "Updating package index"
  apt update

  echo "Installing python dependencies"
  apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev

  echo "Installing rsync"
  apt install rsync

  echo "Downloading python"
  curl -J -O https://www.python.org/ftp/python/3.10.10/Python-3.10.10.tgz

  echo "Extracting python"
  tar xf ./Python-3.10.10.tgz
  cd ./Python-3.10.10

  echo "Configuring python"
  ./configure --enable-optimizations

  echo "Building python"
  make -j $(nproc)

  echo "Installing python"
  make install

  echo "Done"
'