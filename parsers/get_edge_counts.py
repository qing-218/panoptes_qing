from utils.tracking_utils import read_native_flows, print_counts
from urllib.parse import parse_qs, urlparse

tracked_hostnames = set()


def found_url(req):
    parsed_url = urlparse(req.pretty_url)
    if not parsed_url.geturl().startswith('https://c.bingapis.com/api/custom/opal/search'):
        return

    query_params = parse_qs(parsed_url.query)
    tracked_hostnames.add(query_params['q'][0].removeprefix('url:'))


def is_tracked(parsed_url):
    return parsed_url.netloc in tracked_hostnames


read_native_flows(found_url)
print_counts(is_tracked)
