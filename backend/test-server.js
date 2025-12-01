import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Test server works!' }));
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep process running
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
