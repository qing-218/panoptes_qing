from urllib.parse import urlparse
from mitmproxy import io, http
from mitmproxy.exceptions import FlowReadException

hostname_requests = {}
native_request_count = 0

flows_file = open("combined.flows", "rb")
flows_reader = io.FlowReader(flows_file)
try:
    for f in flows_reader.stream():
        if not isinstance(f, http.HTTPFlow):
            continue

        url = urlparse(f.request.pretty_url)
        hostname_requests[url.netloc] = hostname_requests.get(url.netloc, 0) + 1
except FlowReadException as e:
    print(f"Flow file corrupted: {e}")
finally:
    flows_file.close()

print("Requests per hostname:")
for hostname, count in sorted(hostname_requests.items(), key=lambda x: x[1], reverse=True):
    print(f"{hostname}: {count}")
