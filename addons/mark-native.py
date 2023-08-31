#!/usr/bin/env python3

import asyncio
import json
import threading
import websockets
import logging
import typing
from base64 import b64decode
from mitmproxy import http, io, ctx

with open("common/constants.json") as constants_file:
    constants = json.load(constants_file)
    web_request_metadata_header = constants["webRequestMetadataHeader"]


def addon_print(text):
    logging.info("[mark-native addon] " + text)


class WebSocketAdapter:
    async def server_loop(self, websocket):
        self.handle_connected()

        while not self.stop_server_future.done():
            try:
                await websocket.send(bytes())
                pong_bytes = await asyncio.wait_for(websocket.recv(), timeout=5)
                pong = json.loads(pong_bytes)

                if pong['close']:
                    break

                await asyncio.sleep(1)
            except websockets.ConnectionClosedOK:
                break

        self.handle_disconnected()

    def server_thread(self):
        event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(event_loop)

        self.stop_server_future = asyncio.Future()
        self.stop_server = lambda: event_loop.call_soon_threadsafe(
            lambda: self.stop_server_future.set_result(True))

        start_server_future = websockets.serve(self.server_loop, "localhost", 8765)
        server = event_loop.run_until_complete(start_server_future)

        event_loop.run_until_complete(self.stop_server_future)
        server.close()

        event_loop.run_until_complete(server.wait_closed())
        event_loop.close()

    def handle_connected(self):
        self.flow_file = open("combined.flows", "wb")
        self.flow_writer = io.FlowWriter(self.flow_file)
        self.connected = True

        addon_print("Connection established")

    def handle_disconnected(self):
        self.connected = False
        self.flow_file.close()

        addon_print("Connection closed")

    def __init__(self):
        self.flow_file: typing.BinaryIO = None
        self.flow_writer: io.FlowWriter = None

        self.connected = False
        self.stop_server = None
        self.stop_server_future = None

        threading.Thread(target=self.server_thread).start()

    def load(self, loader):
        loader.add_option(
            name = "save_res_body",
            typespec = bool,
            default = False,
            help = "If true, the plugin saves the response body to the flow file"
        )

    def request(self, flow: http.HTTPFlow):
        if not self.connected:
            return

        is_web_request = web_request_metadata_header in flow.request.headers
        if not is_web_request:
            return

        flow.comment = b64decode(flow.request.headers.pop(web_request_metadata_header)).decode('utf-8')
        flow.marked = json.loads(flow.comment)['mark']

    def response(self, flow: http.HTTPFlow):
        if not self.connected:
            return

        save = flow.copy()
        if not ctx.options.save_res_body:
            save.response.set_content(None)

        self.flow_writer.add(save)

        return

    def done(self):
        self.stop_server()


addons = [
    WebSocketAdapter()
]
