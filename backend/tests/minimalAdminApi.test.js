import request from 'supertest';
import http from 'http';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import User from '../src/models/User.js';

jest.setTimeout(30000);

let server;
let token;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();

  // Provide the MONGO_URI_TEST if not set
  if (!process.env.MONGO_URI_TEST) {
    process.env.MONGO_URI_TEST = 'mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/polyspack-ecommerce';
  }

  await mongoose.connect(process.env.MONGO_URI_TEST);

  // Clean previous test user
  await User.deleteMany({ email: 'minimalt@test.com' });

  const hashedPassword = await bcrypt.hash('Test1234!', 10);
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
  await new Promise(resolve => server.close(resolve));
});

describe('Minimal Admin Products API', () => {
  it('GET /api/admin/products - returns 200 or 404', async () => {
    const res = await request(server)
      .get('/api/admin/products')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
