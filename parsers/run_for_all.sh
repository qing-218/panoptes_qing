#!/bin/bash

root_dir=$(pwd)
for results_dir in ../browsers/*/results/current; do
  echo
  echo "Entering directory $results_dir"
  cd "$results_dir" && "$1" "$root_dir/$2"
  cd "$root_dir" || exit
done