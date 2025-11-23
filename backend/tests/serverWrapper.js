const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const app = require('../src/app');

const testApp = express();

testApp.use('/api', app);

const server = http.createServer(testApp);

async function clearDatabase() {
  try {
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await clearDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

module.exports = server;
