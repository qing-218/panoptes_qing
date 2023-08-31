from mitmproxy import io, http
from mitmproxy.exceptions import FlowReadException

web_count = 0
other_count = 0
web_size = 0
other_size = 0

flows_file = open("combined.flows", "rb")
flows_reader = io.FlowReader(flows_file)
try:
    for f in flows_reader.stream():
        if not isinstance(f, http.HTTPFlow):
            continue

        request_size = \
            len(f.request.method) + \
            len(f.request.path) + \
            len(f.request.http_version) + \
            len(f.request.raw_content)

        for name, value in f.request.headers.items(True):
            request_size += len(name) + len(value)

        if f.comment:
            web_count += 1
            web_size += request_size
        else:
            other_count += 1
            other_size += request_size
except FlowReadException as e:
    print(f"Flow file corrupted: {e}")
finally:
    flows_file.close()

print("Other count, Web count, Other size, Web size, Total count, Total size")
print(f"{other_count} {web_count} {other_size} {web_size} {other_count + web_count} {other_size + web_size}")
