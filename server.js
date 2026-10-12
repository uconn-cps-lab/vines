const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function getFileFromGit(branch, relativePath) {
  try {
    const gitPath = relativePath.replace(/\\/g, '/');
    return execSync(`git show ${branch}:"${gitPath}"`, {
      cwd: ROOT,
      maxBuffer: 50 * 1024 * 1024
    });
  } catch (err) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(urlObj.pathname);
  const branchParam = urlObj.searchParams.get('branch');

  // Handle root
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Support /main/... subpath routing
  let targetBranch = branchParam;
  let cleanPath = pathname;
  if (pathname.startsWith('/main/')) {
    targetBranch = 'main';
    cleanPath = pathname.replace('/main/', '/');
  } else if (pathname.startsWith('/uconn/')) {
    targetBranch = 'uconn';
    cleanPath = pathname.replace('/uconn/', '/');
  }
  if (cleanPath === '/') cleanPath = '/index.html';

  const relPath = cleanPath.replace(/^\//, '');
  const ext = path.extname(cleanPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // If branch requested explicitly via query param or route
  if (targetBranch) {
    const content = getFileFromGit(targetBranch, relPath);
    if (content !== null) {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      return res.end(content);
    }
  }

  // Otherwise serve from disk
  const filePath = path.join(ROOT, relPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Access denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    // Handle range requests (for PDF viewing)
    const range = req.headers.range;
    if (range && ext === '.pdf') {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      return file.pipe(res);
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`  VINES Academic Grant Website - Local Deployment`);
  console.log(`=======================================================`);
  console.log(`  Main URL (Active branch): http://localhost:${PORT}`);
  console.log(`  UConn Branded Branch:     http://localhost:${PORT}/?branch=uconn`);
  console.log(`  Collaborative Main Branch:http://localhost:${PORT}/?branch=main`);
  console.log(`=======================================================`);
});
