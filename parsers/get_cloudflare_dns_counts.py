from utils.tracking_utils import read_native_flows, print_counts
import dns.message

dns_requests = []


def found_url(req):
    if not req.pretty_url.startswith("https://chrome.cloudflare-dns.com/dns-query"):
        return

    for question in dns.message.from_wire(req.content).question:
        dns_requests.append(question.to_text())


def is_tracked(parsed_url):
    for body in dns_requests:
        if parsed_url.netloc in body:
            return True


read_native_flows(found_url)
print_counts(is_tracked)
