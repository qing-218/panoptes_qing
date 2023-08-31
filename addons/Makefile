all: installed-requirements.txt mitmproxy.cer

installed-requirements.txt: requirements.txt
	pip3 install -r $<
	cp $< $@

mitmproxy.cer:
	mitmdump -n -s generate-cert.py
	cp ~/.mitmproxy/mitmproxy-ca-cert.cer $@

clean:
	rm installed-requirements.txt mitmproxy.cer

.PHONY: all clean