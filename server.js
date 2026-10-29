import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html' : 'text/html; charset=utf-8',
    '.js'   : 'application/javascript; charset=utf-8',
    '.css'  : 'text/css; charset=utf-8',
    '.json' : 'application/json; charset=utf-8',
    '.png'  : 'image/png',
    '.ico'  : 'image/x-icon',
    '.svg'  : 'image/svg+xml',
    '.woff' : 'font/woff',
    '.woff2': 'font/woff2',
    '.mp3'  : 'audio/mpeg',
    '.xml'  : 'application/xml',
    '.webmanifest' : 'application/manifest+json'
};

const server = http.createServer((req, res) => {
    // Cabeceras HTTP requeridas para X (Twitter) Player Cards
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://twitter.com https://x.com http://localhost:* http://127.0.0.1:*;");

    const cleanUrl = (req.url || '/').split('?')[0];
    const relPath = cleanUrl === '/' ? '/index.html' : cleanUrl;
    const filePath = path.join(__dirname, path.normalize(relPath));

    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n🕹️  jsPacman (X Player Card Ready) corriendo en:`);
    console.log(`   • Vista directa / Metadatos: http://localhost:${PORT}/index.html`);
    console.log(`   • Iframe Player (480x480):   http://localhost:${PORT}/play.html`);
    console.log(`   • Simulador Feed de X:       http://localhost:${PORT}/card-preview.html\n`);
});

