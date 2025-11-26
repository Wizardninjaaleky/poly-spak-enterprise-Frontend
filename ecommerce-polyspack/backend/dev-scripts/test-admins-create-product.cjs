const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    const r = http.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

(async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    await mongoose.connect(mongoUri);
    const Category = require('../src/models/Category');
    let cat = await Category.findOne({ name: 'Seedling Bags' });
    if (!cat) cat = await Category.create({ name: 'Seedling Bags', slug: 'seedling-bags', description: 'Seedling Bags' });
    const categoryId = cat._id.toString();
    console.log('Using categoryId:', categoryId);

    const admins = [
      { email: 'janekamunge4@gmail.com', password: 'Jane@2025' },
      { email: 'polyspackenterprise@gmail.com', password: 'Thamanda@2025' },
    ];

    for (const a of admins) {
      console.log('\n---\nTesting admin:', a.email);
      const login = await req('POST', '/auth/login', { email: a.email, password: a.password });
      console.log('Login status', login.status);
      console.log('Login body', login.body);
      const token = login.body?.token;
      if (!token) {
        console.log('Cannot proceed for', a.email);
        continue;
      }

      const payload = {
        title: `Admin Created Product ${Date.now()}`,
        slug: `admin-product-${Date.now()}`,
        description: 'Created by admin test script',
        category: categoryId,
        price: 1500,
        salePrice: 1400,
        images: ['https://via.placeholder.com/400'],
        stockQty: 20,
      };

      const create = await req('POST', '/products', payload, token);
      console.log('Create status', create.status);
      console.log('Create body', create.body);
    }

    await mongoose.connection.close();
    console.log('\nDone.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
