require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const { startServer, stopServer } = require('./serverWrapper.js');
const mongoose = require('mongoose');

let token;
let orderId;
let paymentId;
let server;

beforeAll(async () => {
  jest.setTimeout(30000);
  server = await startServer();
  await mongoose.connect('mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/polyspack-ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const res = await request(server)
    .post('/api/auth/register')
    .send({ name: 'Test Admin', email: 'orderpaymentadmin@example.com', password: 'Admin123!', role: 'admin' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await stopServer();
}, 30000);

describe('Orders and Payments API', () => {
  it('creates an order', async () => {
    const res = await request(server)
      .post('/api/admin/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user: null,
        products: [],
        total: 1000,
        status: 'pending',
        shippingAddress: { street: '123 Test St', city: 'Nairobi', zip: '00100' },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    orderId = res.body._id;
  });

  it('gets orders list', async () => {
    const res = await request(server)
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('updates order status', async () => {
    const res = await request(server)
      .patch(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'shipped' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('shipped');
  });

  it('creates a payment', async () => {
    const res = await request(server)
      .post('/api/admin/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId,
        userId: null,
        amount: 1000,
        phoneNumber: '0712345678',
        mpesaCode: 'MPESA12345',
        paymentStatus: 'Pending',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    paymentId = res.body._id;
  });

  it('gets payments list', async () => {
    const res = await request(server)
      .get('/api/admin/payments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('updates payment status', async () => {
    const res = await request(server)
      .patch(`/api/admin/payments/${paymentId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ paymentStatus: 'Confirmed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.paymentStatus).toBe('Confirmed');
  });
});
