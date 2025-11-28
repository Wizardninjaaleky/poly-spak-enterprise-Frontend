import app from '../src/app.js';
import http from 'http';

let server;

export function startServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(() => resolve(server));
  });
}

export function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else resolve();
  });
}