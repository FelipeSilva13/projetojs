const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Decode URI to support spaces and special characters in paths
    let decodedUrl;
    try {
        decodedUrl = decodeURIComponent(req.url);
    } catch (e) {
        decodedUrl = req.url;
    }

    // Default to index.html if accessing root or a directory
    let filePath = path.join(__dirname, decodedUrl);
    if (req.url === '/' || req.url === '') {
        filePath = path.join(__dirname, 'index.html');
    } else {
        try {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }
        } catch (e) {
            // Ignore error, fs.readFile below will handle file not found
        }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - Arquivo não encontrado</h1><p>O arquivo solicitado não foi encontrado no projeto.</p>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('<h1>500 - Erro interno do servidor</h1><p>Desculpe, ocorreu um erro interno: ' + error.code + '</p>', 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n==================================================');
    console.log('🚀  PROJETO DO LIVRO INTERATIVO ONLINE!');
    console.log('==================================================');
    console.log('Servidor rodando em: http://localhost:' + PORT);
    console.log('Pressione Ctrl+C para encerrar o servidor.');
    console.log('==================================================\n');
});
