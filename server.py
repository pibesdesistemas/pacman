#!/usr/bin/env python3
"""
Servidor HTTP ligero sin dependencias para alojar jsPacman localmente
con las cabeceras de seguridad requeridas por X (Twitter) Player Cards.
Uso: python3 server.py [puerto]
"""
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 3000))


class PlayerCardRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Cabeceras HTTP requeridas en la sección 6 de la documentación técnica
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("X-Frame-Options", "ALLOWALL")
        self.send_header(
            "Content-Security-Policy",
            "frame-ancestors 'self' https://twitter.com https://x.com http://localhost:* http://127.0.0.1:*;",
        )
        super().end_headers()


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = HTTPServer(("0.0.0.0", PORT), PlayerCardRequestHandler)
    print(f"\n🕹️  jsPacman (X Player Card Ready) corriendo en:")
    print(f"   • Vista directa / Metadatos: http://localhost:{PORT}/index.html")
    print(f"   • Iframe Player (480x480):   http://localhost:{PORT}/play.html")
    print(f"   • Simulador Feed de X:       http://localhost:{PORT}/card-preview.html\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")

