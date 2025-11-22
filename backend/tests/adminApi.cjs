const request = require('supertest');
const app = require('../src/app.js'); // Assuming app.js exports Express app
const mongoose = require('mongoose');

let token;

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGO_URI_TEST);

  // Create an admin user and get token
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test Admin', email: 'testadmin@example.com', password: 'Admin123!', role: 'admin' });
  token = res.body.token;
});

afterAll(async () => {
  // Clean up database and disconnect
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Admin API Endpoints', () => {
  let productId, userId, paymentId;

  // Product CRUD tests
  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Plastic Pellet', description: 'High-quality pellets', category: 'Raw Material', price: 1000, quantity: 500 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    productId = res.body._id;
  });

  it('should get products list', async () => {
    const res = await request(app)
      .get('/api/admin/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update the product', async () => {
    const res = await request(app)
      .put(`/api/admin/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 1100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(1100);
  });

  it('should delete the product', async () => {
    const res = await request(app)
      .delete(`/api/admin/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  // User Management tests
  it('should get users list', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update user role', async () => {
    // Create a user first
    const newUserRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'User123!' });
    userId = newUserRes.body.user.id;

    const res = await request(app)
      .put(`/api/admin/users/${userId}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'sales' });
    expect(res.statusCode).toBe(200);
  });

  it('should toggle user status', async () => {
    const res = await request(app)
      .put(`/api/admin/users/${userId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });
    expect(res.statusCode).toBe(200);
  });

  // Authentication tests
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'Admin123!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'WrongPassword' });
    expect(res.statusCode).toBe(401);
  });

  // Payments endpoints test placeholder (advanced tests could be added)

});
