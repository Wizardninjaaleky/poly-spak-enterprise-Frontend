require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../src/app.js');
const mongoose = require('mongoose');

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);

  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test Admin', email: 'testadmin@example.com', password: 'Admin123!', role: 'admin' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Admin API Endpoints', () => {
  let productId;

  it('creates a product', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Plastic Pellet', description: 'High-quality pellets', category: 'Raw Material', price: 1000, quantity: 500 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    productId = res.body._id;
  });

  it('gets products list', async () => {
    const res = await request(app)
      .get('/api/admin/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('updates product', async () => {
    const res = await request(app)
      .put(`/api/admin/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 1100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(1100);
  });

  it('deletes product', async () => {
    const res = await request(app)
      .delete(`/api/admin/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('gets users list', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'Admin123!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'WrongPassword' });
    expect(res.statusCode).toBe(401);
  });
});
