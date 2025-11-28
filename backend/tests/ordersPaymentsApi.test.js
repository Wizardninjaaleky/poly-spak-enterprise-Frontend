require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
import mongoose from 'mongoose';
import { startServer, stopServer } from './serverWrapper.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';

let token;
let orderId;
let productId;
let server;

beforeAll(async () => {
  jest.setTimeout(30000);
  server = await startServer();
  await mongoose.connect(process.env.MONGO_URI_TEST, { dbName: 'polyspack_test' });

  // Clean up previous test data
  await User.deleteMany({ email: 'orderuser@example.com' });
  await Product.deleteMany({ name: 'Order Test Product' });

  // Create an admin user for testing
  const userRes = await request(server)
    .post('/api/auth/register')
    .send({ name: 'Order Test User', email: 'orderuser@example.com', password: 'Password123!', role: 'admin' });
  token = userRes.body.token;

  // Create a product for testing orders
  const productRes = await request(server)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Order Test Product',
      description: 'A product for testing order creation',
      price: 100,
      stock: 100,
      category: 'Testing'
    });
  productId = productRes.body.data._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await stopServer();
});

describe('Orders and Payments API', () => {
  it('creates an order', async () => {
    const res = await request(server)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ // This payload needs to match the createOrder controller
        items: [{ productId: productId, qty: 1 }],
        delivery: { type: 'delivery', address: { street: '123 Test St', city: 'Test City' } },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.totalAmount).toBe(100);
    orderId = res.body.data._id;
  });

  it('gets orders list', async () => {
    const res = await request(server)
      .get('/api/orders/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('updates order status (as admin - should fail for non-admin)', async () => {
    const res = await request(server)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'shipped' });
    // Expect 403 Forbidden because the test user is not an admin
    expect(res.statusCode).toBe(403);
  });

  it('submits a payment for verification', async () => {
    const res = await request(server)
      .post('/api/payments/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId,
        amount: 100,
        phoneNumber: '0712345678',
        mpesaCode: 'MPESA12345',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Payment submitted successfully');
  });
});
