# Polyspack Backend Testing and Setup Fix

This document provides a comprehensive fix and setup for reliable Jest backend testing with MongoDB and Express server for the Polyspack ecommerce backend.

---

## 1) Docker Compose for Local MongoDB Test DB

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:6.0
    container_name: polyspack-mongo-test
    ports:
      - '27017:27017'
    volumes:
      - mongo_data_test:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example

volumes:
  mongo_data_test:
```

Launch test DB with:

```
docker-compose up -d
```

---

## 2) .env.test Example

Place in `backend/.env.test` (do **NOT** commit if containing real creds):

```
NODE_ENV=test
MONGODB_URI=mongodb://root:example@localhost:27017/polyspack_test?authSource=admin
JWT_SECRET=test_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## 3) Jest Config (backend/jest.config.js)

```js
module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  coverageDirectory: './coverage',
};
```

---

## 4) Jest Setup (backend/jest.setup.js)

```js
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath });

const events = require('events');
events.EventEmitter.defaultMaxListeners = 50;
```

---

## 5) Backend Express App (backend/src/app.js)

```js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ success: true }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

export default app;
```

---

## 6) Backend Server Startup (backend/server.js)

```js
import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
```

---

## 7) MongoDB DB Connector (backend/src/config/db.js)

```js
import mongoose from 'mongoose';

const connectDB = async (uri) => {
  const mongoURI = uri || process.env.MONGODB_URI;
  if (!mongoURI) throw new Error('MONGODB_URI not provided');
  await mongoose.connect(mongoURI, { dbName: 'polyspack' });
  console.log('MongoDB connected');
};

export default connectDB;
```

---

## 8) Test DB Setup/Teardown Helpers (backend/scripts/setupTestDB.js)

```js
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath });

export const setupTestDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('.env.test MONGODB_URI not set');
  await connectDB(uri);
};

export const teardownTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};
```

---

## 9) Test Server Wrapper (backend/tests/serverWrapper.js)

```js
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
```

---

## 10) Sample Test File Usage in `backend/tests/ordersPaymentsApi.test.js`

```js
import request from 'supertest';
import { startServer, stopServer } from './serverWrapper.js';
import { setupTestDB, teardownTestDB } from '../scripts/setupTestDB.js';

let server;

beforeAll(async () => {
  await setupTestDB();
  server = await startServer();
});

afterAll(async () => {
  await teardownTestDB();
  await stopServer();
});

test('creates order', async () => {
  const res = await request(server)
    .post('/api/admin/orders')
    .set('Authorization', `Bearer your_token`)
    .send({ /* your order payload */ });
  expect(res.statusCode).toBe(201);
});
```

---

## Important Notes

- Use `docker-compose up -d` to start a local MongoDB test instance.
- Point your `.env.test` or `MONGODB_URI` env var to this DB with credentials.
- Tests programmatically start and stop Express server instances avoid `app.address` errors.
- JWT secret should be set for auth token signing in `.env.test`.
- Do not commit credentials or `.env.test` to source control.
- Adapt tests to seed admin user accounts properly before running admin routes.

---

If you want, I can help generate the actual files and scripts for you to replace current ones or further assist with Docker Compose integration and frontend test suites.
