# Local preview of the website in docs/, the way GitHub Pages serves it:
# an address like /privacy-policy opens privacy-policy.html, and unknown addresses show 404.html.
# Run from the website folder:  python tools/serve.py   then open http://localhost:8765

import http.server
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) and os.path.exists(path + ".html"):
            self.path = self.path.split("?")[0] + ".html"
        elif not os.path.exists(path):
            self.path = "/404.html"
        return super().send_head()

    # The preview never keeps old files, so a change shows at once (GitHub Pages keeps them 10 minutes).
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
