const { createReadStream, existsSync, statSync } = require('node:fs');
const { createServer } = require('node:http');
const { extname, join, normalize, resolve } = require('node:path');

const root = process.cwd();
const port = Number(process.argv[2] || 5501);

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8'
};

function resolveRequestPath(url) {
    const requestedPath = decodeURIComponent(new URL(url, 'http://127.0.0.1').pathname);
    const normalizedPath = normalize(requestedPath).replace(/^([/\\])+/, '');
    const absolutePath = resolve(root, normalizedPath);

    if (!absolutePath.startsWith(root)) {
        return null;
    }

    if (existsSync(absolutePath) && statSync(absolutePath).isDirectory()) {
        return join(absolutePath, 'index.html');
    }

    return absolutePath;
}

createServer((request, response) => {
    const filePath = resolveRequestPath(request.url || '/');

    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
    }

    response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream'
    });
    createReadStream(filePath).pipe(response);
}).listen(port, '127.0.0.1', () => {
    console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});
