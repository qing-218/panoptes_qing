from utils.tracking_utils import read_native_flows, print_counts

tracked_urls = set()


def found_url(req):
    if not req.pretty_url.startswith('https://gjtrack.ucweb.com/collect'):
        return

    referer = req.headers.get('Referer')
    if referer is None or referer.startswith('http://127.0.0.1'):
        return

    tracked_urls.add(req.headers.get('Referer'))


def is_tracked(parsed_url):
    return parsed_url.geturl() in tracked_urls


read_native_flows(found_url)
print_counts(is_tracked, True)
