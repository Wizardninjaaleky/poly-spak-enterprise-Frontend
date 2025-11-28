import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { startServer, stopServer } from './serverWrapper.js';
import User from '../src/models/User.js';

jest.setTimeout(30000);

let server;
let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, { dbName: 'polyspack_test' });
  server = await startServer();

  // Clean previous test user
  await User.deleteMany({ email: 'minimalt@test.com' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Test1234!', salt);

  const user = new User({
    name: 'Minimal Test Admin',
    email: 'minimalt@test.com',
    passwordHash: hashedPassword,
    role: 'admin'
  });
  await user.save();

  const loginRes = await request(server)
    .post('/api/auth/login')
    .send({ email: 'minimalt@test.com', password: 'Test1234!' });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await stopServer();
});

describe('Minimal Admin Products API', () => {
  it('GET /api/products - returns 200 OK', async () => {
    const res = await request(server)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
