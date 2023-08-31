from utils.tracking_utils import read_native_flows, print_counts

tracking_request_bodies = []


def found_url(req):
    if not req.pretty_url.startswith("https://trpcpb.imtt.qq.com/"):
        return

    tracking_request_bodies.append(req.text)


def is_tracked(parsed_url):
    for body in tracking_request_bodies:
        if parsed_url.netloc in body:
            return True

    return False


read_native_flows(found_url)
print_counts(is_tracked)
