// Adding missing closing brace for TypeScript error fix
import bcrypt from 'bcryptjs';

jest.setTimeout(30000);

require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
import app from '../src/app.js';
import http from 'http';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

let server;
let token;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();

  await mongoose.connect(process.env.MONGO_URI_TEST);

  // Remove any existing test user to avoid duplicates
  await User.deleteMany({ email: 'testadmin@example.com' });

  // Hash password before creating user to satisfy model validation
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  // Create an admin user directly with specific role and hashed password
  const user = new User({ name: 'Test Admin', email: 'testadmin@example.com', passwordHash: hashedPassword, role: 'admin' });
  await user.save();

  // Test route accessibility without auth (should get 401 or 200)
  const healthCheck = await request(server).get('/api/admin/products');
  console.log('Test server admin products route (no auth) status:', healthCheck.statusCode);

  // Login to obtain token for authorization
  const res = await request(server)
    .post('/api/auth/login')
    .send({ email: 'testadmin@example.com', password: 'Admin123!' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await new Promise(resolve => server.close(resolve));
});

describe('Admin API Endpoints', () => {
  let productId;

  it('creates a product', async () => {
    const res = await request(server)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Plastic Pellet', description: 'High-quality pellets', category: 'Raw Material', price: 1000, quantity: 500 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    productId = res.body._id;
  });

  it('gets products list', async () => {
    const res = await request(server)
      .get('/api/admin/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('updates product', async () => {
    const res = await request(server)
      .put(`/api/admin/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 1100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(1100);
  });

  it('deletes product', async () => {
    const res = await request(server)
      .delete(`/api/admin/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('gets users list', async () => {
    const res = await request(server)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
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
