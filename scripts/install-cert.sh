#!/bin/bash

#Usage: install-cert.sh [system|user|reset]

. ./scripts/adb-utils.sh

# Certificate directories
USER_CERT_DIR=/data/misc/user/0/cacerts-added
SYSTEM_CERT_DIR=/system/etc/security/cacerts

# Uninstall previously installed certificates
adb_sudo umount "$SYSTEM_CERT_DIR"
adb_sudo umount "$USER_CERT_DIR"

mount_cert_dir () {
  # Usage: mount_cert_dir TEMP_DIR CERT_DIR

  # Copy certificate
  CERT_NAME=$(openssl x509 -inform PEM -subject_hash_old -in mitmproxy.cer | head -n 1).0
  cp mitmproxy.cer "$CERT_NAME"

  # Mount tmpfs over system certificate directory
  adb shell mkdir "$1/"
  adb_sudo cp "$2/*" "$1/"
  adb_sudo mount -t tmpfs tmpfs "$2"

  # Install certificate
  adb push "$CERT_NAME" "$1/"
  adb_sudo mv "$1/*" "$2/"

  # Delete certificate copy
  rm "$CERT_NAME"
}

case $1 in
  system)
    echo Installing as system certificate
    mount_cert_dir /data/local/tmp/cacerts-sys "$SYSTEM_CERT_DIR"
    adb_sudo chcon u:object_r:system_file:s0 "$SYSTEM_CERT_DIR/*"
    ;;
  user)
    echo Installing as user certificate
    adb_sudo mkdir -p "$USER_CERT_DIR"
    mount_cert_dir /data/local/tmp/cacerts-usr "$USER_CERT_DIR"
    ;;
  reset)
    ;;
  *)
    echo Invalid certificate type argument
    exit 1
    ;;
esac