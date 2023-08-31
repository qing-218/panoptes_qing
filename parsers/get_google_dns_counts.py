from utils.tracking_utils import read_native_flows, print_counts
from urllib.parse import parse_qs, urlparse
from base64 import urlsafe_b64decode
import dns.message

dns_requests = []


def found_req(req):
    if not req.pretty_url.startswith("https://dns.google/dns-query"):
        return

    parsed_url = urlparse(req.pretty_url)
    query_params = parse_qs(parsed_url.query)
    payload = urlsafe_b64decode(query_params['dns'][0] + '==')

    for question in dns.message.from_wire(payload).question:
        dns_requests.append(question.to_text())


def is_tracked(parsed_url):
    for body in dns_requests:
        if parsed_url.netloc in body:
            return True

    return False


read_native_flows(found_req)
print_counts(is_tracked)
