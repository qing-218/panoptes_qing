from mitmproxy import io, http
from mitmproxy.exceptions import FlowReadException
from urllib.parse import urlparse
import os
import json

flow_navigations = {}


def read_native_flows(found_req):
    flows_file = open("combined.flows", "rb")
    flows_reader = io.FlowReader(flows_file)

    try:
        for f in flows_reader.stream():
            if not isinstance(f, http.HTTPFlow):
                continue

            found_req(f.request)
            if not f.comment:
                continue

            metadata = json.loads(f.comment)
            if not metadata.get('isNavigation'):
                continue

            list_number = metadata['listNumber']
            visit_navigations = flow_navigations.get(list_number, [])

            visit_navigations.append({
                'url': f.request.pretty_url,
                'targetId': metadata['targetId']
            })

            flow_navigations[list_number] = visit_navigations

    except FlowReadException as e:
        print(f"Flow file corrupted: {e}")
    finally:
        flows_file.close()


def print_counts(is_tracked, read_navigation_file=False, print_untracked=False):
    fail_tracked_count = 0
    success_tracked_count = 0

    websites_dir = "./websites"
    for entry in os.scandir(websites_dir):
        website_dir = os.path.join(websites_dir, entry.name)

        with open(os.path.join(website_dir, "metadata.json")) as metadata_file:
            metadata = json.load(metadata_file)

        if read_navigation_file:
            with open(os.path.join(website_dir, "navigations.json")) as navigation_file:
                navigations = json.load(navigation_file)
        else:
            navigations = []
            for navigation in flow_navigations.get(metadata['listNumber'], []):
                if navigation['targetId'] != metadata['targetId']:
                    continue
                navigations.append(navigation)

        tracked = is_tracked(urlparse(metadata['url']))
        for navigation in navigations:
            tracked = tracked or is_tracked(urlparse(navigation['url']))

        if not tracked:
            if print_untracked:
                print(
                    f"Untracked navigation: {metadata['url']}. " +
                    f"Number: {metadata['listNumber']}. " +
                    f"Error code: {metadata['errorCode']}"
                )

            continue

        if metadata['errorCode']:
            fail_tracked_count += 1
        else:
            success_tracked_count += 1

    print(f"Successful tracked navigations: {success_tracked_count}")
    print(f"Failed tracked navigation: {fail_tracked_count}")
