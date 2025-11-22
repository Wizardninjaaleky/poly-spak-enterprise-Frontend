const http = require('http');
const express = require('express');
const app = require('../src/app');
const securityMiddleware = require('../src/middleware/security');

const testApp = express();

// Apply security middleware
securityMiddleware(testApp);

// Use the main app as a sub-app mounted at /api to match route mounting in app.js
testApp.use('/api', app);

const server = http.createServer(testApp);

module.exports = server;
