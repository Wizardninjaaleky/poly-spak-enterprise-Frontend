const http = require('http');
const mongoose = require('mongoose');

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
    // Ensure a category exists in DB and get its id
    const Category = require('./src/models/Category');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    await mongoose.connect(mongoUri);
    let cat = await Category.findOne({ name: 'Seedling Bags' });
    if (!cat) {
      cat = await Category.create({ name: 'Seedling Bags', slug: 'seedling-bags', description: 'Seedling Bags category' });
      console.log('Created category', cat._id.toString());
    }
    const categoryId = cat._id.toString();

    console.log('Login admin...');
    const login = await req('POST', '/auth/login', { email: 'janekamunge4@gmail.com', password: 'Jane@2025' });
    console.log('Login status', login.status);
    console.log('Login body', login.body);
    const token = login.body?.token;
    console.log('Token length', token?.length);

    console.log('Creating product with token...');
    const create = await req('POST', '/products', {
      title: 'Quick Seed Fertilizer',
      description: 'Quick test',
      price: 1000,
      salePrice: 900,
      category: categoryId,
      stockQty: 10,
      images: [],
    }, token);
    console.log('Create status', create.status);
    console.log('Create body', create.body);
    await mongoose.connection.close();
  } catch (e) {
    console.error(e.message);
  }
})();
