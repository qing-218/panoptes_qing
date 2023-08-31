import sys
import json
from mitmproxy import io, http
from mitmproxy.exceptions import FlowReadException


def multidict_to_pairs(multidict):
    pairs = []
    for key, value in multidict.items(True):
        pairs.append([key, value])

    return pairs

for results_dir in sys.argv[1:]:
    print('\nEntering directory ' + results_dir)

    flows_file = open(results_dir + "/combined.flows", "rb")
    flows_reader = io.FlowReader(flows_file)
    try:
        native_flows = []

        for f in flows_reader.stream():
            if not isinstance(f, http.HTTPFlow):
                continue

            if f.comment:
                continue

            native_flows.append({
                'method': f.request.method,
                'url': f.request.pretty_url,
                'requestHeaders': multidict_to_pairs(f.request.headers),
                'responseHeaders': multidict_to_pairs(f.response.headers)
            })

        with open(results_dir + "/nativeFlows.json", "w") as outfile:
            outfile.write(json.dumps(native_flows))
    except FlowReadException as e:
        print(f"Flow file corrupted: {e}")
    finally:
        flows_file.close()