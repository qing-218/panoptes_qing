adb_sudo () {
  adb shell su -c \' "$@" \'
}