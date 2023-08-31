import os
import json
from datetime import datetime
from mitmproxy import io, http
from mitmproxy.exceptions import FlowReadException
import math


def get_last_line(file):
    try:
        file.seek(-2, os.SEEK_END)
        while file.read(1) != b'\n':
            file.seek(-2, os.SEEK_CUR)
    except OSError:
        file.seek(0)

    return file.readline().decode()


flows_file = open("combined.flows", "rb")
log_file = open("crawlLog.txt", "rb")

request_counts = {}
start_timestamp = 0
end_timestamp = datetime.fromisoformat(json.loads(get_last_line(log_file))['timestamp']).timestamp()


def get_bucket_index(timestamp):
    return math.floor(timestamp - start_timestamp)


flows_reader = io.FlowReader(flows_file)
try:
    for f in flows_reader.stream():
        if not isinstance(f, http.HTTPFlow):
            continue

        if not start_timestamp:
            start_timestamp = f.timestamp_start

        bucket_index = get_bucket_index(f.timestamp_start)
        request_counts[bucket_index] = request_counts.get(bucket_index, 0) + 1
except FlowReadException as e:
    print(f"Flow file corrupted: {e}")
finally:
    flows_file.close()

timeline = [0]
max_bucket_index = get_bucket_index(end_timestamp)
for i in range(max_bucket_index + 1):
    timeline.append(timeline[-1] + request_counts.get(i, 0))

print(timeline[-600:])
