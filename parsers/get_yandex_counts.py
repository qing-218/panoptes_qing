from utils.tracking_utils import read_native_flows, print_counts
from urllib.parse import parse_qs, urlparse
from base64 import urlsafe_b64decode
import utils.threat_matches_pb2 as threat_matches_pb2
import tldextract

threat_matches = threat_matches_pb2.Request()

thread_matches_urls = set()
nodes = []


def found_url(req):
    parsed_url = urlparse(req.pretty_url)
    query_params = parse_qs(parsed_url.query)

    if req.pretty_url.startswith('https://sba.yandex.net/v4/threatMatches:find'):
        protobuf = urlsafe_b64decode(query_params['$req'][0])
        threat_matches.ParseFromString(protobuf)
        thread_matches_urls.add(threat_matches.threat_info.threat_entries[0].url)
    elif req.pretty_url.startswith('https://api.browser.yandex.ru/dashboard3/get'):
        nodes.append(query_params['nodes'][0])


def is_threat_matches_tracked(parsed_url):
    return parsed_url.geturl() in thread_matches_urls


def is_nodes_tracked(parsed_url):
    tld = tldextract.extract(parsed_url.geturl()).registered_domain
    for node in nodes:
        if tld in node:
            return True

    return False


read_native_flows(found_url)

print('Threat matches endpoint:')
print_counts(is_threat_matches_tracked)

print('Nodes endpoint')
print_counts(is_nodes_tracked)
