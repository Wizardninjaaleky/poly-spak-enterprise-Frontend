// Adding missing closing brace for TypeScript error fix
import bcrypt from 'bcryptjs';
import request from 'supertest';
import mongoose from 'mongoose';
import { startServer, stopServer } from './serverWrapper.js';
import User from '../src/models/User.js'; // Correct path

jest.setTimeout(30000);

let server;
let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, { dbName: 'polyspack_test' });
  server = await startServer();

  // Remove any existing test user to avoid duplicates
  await User.deleteMany({ email: 'testadmin@example.com' });

  // Hash password before creating user to satisfy model validation
  const hashedPassword = await bcrypt.hash('Admin123!', 12);

  // Create an admin user directly with specific role and hashed password
  const user = new User({ name: 'Test Admin', email: 'testadmin@example.com', passwordHash: hashedPassword, role: 'admin' });
  await user.save();

  // Test route accessibility without auth (should get 401 or 200)

  // Login to obtain token for authorization
  const res = await request(server)
    .post('/api/auth/login')
    .send({ email: 'testadmin@example.com', password: 'Admin123!' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await stopServer();
});

describe('Admin API Endpoints', () => {
  let productId;

  it('creates a product', async () => {
    const res = await request(server)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Plastic Pellet', description: 'High-quality pellets', category: 'Raw Material', price: 1000, quantity: 500 });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    productId = res.body.data._id;
  });

  it('gets products list', async () => {
    const res = await request(server)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('updates product', async () => {
    const res = await request(server)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 1100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(1100);
  });

  it('deletes product', async () => {
    const res = await request(server)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('gets users list', async () => {
    const res = await request(server)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('login with valid credentials', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'Admin123!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects invalid login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'WrongPassword' });
    expect(res.statusCode).toBe(401);
  });
});
