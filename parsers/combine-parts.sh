#!/bin/bash

# Note: DO NOT USE, as it does not support the latest crawl result format.

id="$1"
first_part_dir="$id-1"
last_part_dir="$first_part_dir"

for (( part=2 ; 1 ; part++ )); do
  part_dir="$id-$part"
  if [ ! -d "$part_dir" ]; then break; fi
  last_part_dir="$part_dir"

  cat "$part_dir/crawlLog.txt" >> "$first_part_dir/crawlLog.txt"
  mitmdump -q -n -r "$part_dir/combined.flows" -w "+$first_part_dir/combined.flows"

  for website_dir in "$part_dir/websites/"*; do
      rm -rf "$first_part_dir/websites/$(basename "$website_dir")"
      mv "$website_dir" "$first_part_dir/websites/"
  done

  rm -rf "$part_dir"
  echo "Appended $part_dir"
done

rm -f "$first_part_dir/lastNumberCrawled.txt"
mv "$first_part_dir" "$last_part_dir"