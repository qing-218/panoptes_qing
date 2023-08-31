# Panoptes

A multi-browser android crawler

## Features

- Support for Chrome, Brave, CocCoc, DuckDuckGo, Dolphin, Edge, Kiwi, Mint, Opera, QQ, Samsung Internet, UC China
  Edition, UC International Edition, Vivaldi, Whale and Yandex
- Isolation of browser application traffic from background android traffic
- Capturing and separation of native (browser generated) and web (website generated) traffic
- Parallel crawling using N tabs
- Tab, browser, and crawler crash recovery
- Link, Meta tag redirect, and 302 HTTP redirect navigation type emulation
- Pop-up blocking (CDP only)
- Factory resetting
- Optional setup wizard automation
- Manual crawl mode with live traffic visualization
- Certificate installation
- Optional tab creation
- Service worker registration logging
- Head section mutation logging
- Website javascript injection with hot reloading
- Frida script loading

## [Setup guide](./docs/setup.md)

## [Usage guide](./docs/usage.md)

## Credits

The mitmproxy addon, is loosely based on [mitmproxy-node](https://github.com/jvilk/mitmproxy-node)
