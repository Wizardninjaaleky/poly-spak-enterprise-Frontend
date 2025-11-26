const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing Order APIs\n');

  try {
    // 1. Get products first
    console.log('1️⃣ GET /api/products');
    let res = await request('GET', '/products');
    console.log(`   Status: ${res.status}`);
    if (res.data?.data?.length === 0) {
      console.log('   ❌ No products found. Need to create test product first.\n');
    } else {
      console.log(`   ✅ Found ${res.data?.count || 0} products\n`);
    }

    // 2. Register user
    const email = `testuser${Date.now()}@test.com`;
    console.log(`2️⃣ POST /api/auth/register`);
    res = await request('POST', '/auth/register', {
      name: 'Test User',
      email,
      password: 'Test@12345',
      phone: '+254712345678',
    });
    console.log(`   Status: ${res.status}`);
    if (res.status === 201) {
      console.log(`   ✅ User registered: ${email}\n`);
    } else {
      console.log(`   Response:`, res.data, '\n');
    }

    // 3. Login
    console.log(`3️⃣ POST /api/auth/login`);
    res = await request('POST', '/auth/login', { email, password: 'Test@12345' });
    console.log(`   Status: ${res.status}`);
    const token = res.data?.token;
    if (token) {
      console.log(`   ✅ Login successful, token obtained\n`);
    } else {
      console.log(`   Response:`, res.data, '\n');
    }

    if (!token) {
      console.log('❌ Cannot continue without token');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    // 4. Create test product (might fail if user is not admin, that's ok)
    console.log(`4️⃣ POST /api/products (Create Test Product)`);
    res = await request('POST', '/products', {
      name: 'Test Fertilizer',
      description: 'Premium NPK Fertilizer',
      price: 500,
      discountedPrice: 450,
      category: 'Fertilizers',
      stock: 100,
      images: ['https://via.placeholder.com/500'],
    });
    console.log(`   Status: ${res.status}`);
    let productId = res.data?.data?._id;
    console.log(`   Response:`, JSON.stringify(res.data).slice(0, 100), '\n');

    // Get first product if creation failed
    if (!productId) {
      console.log(`5️⃣ GET /api/products (Get First Product)`);
      res = await request('GET', '/products');
      productId = res.data?.data?.[0]?._id;
      if (productId) {
        console.log(`   ✅ Using existing product: ${productId}\n`);
      } else {
        console.log('   ❌ No products available');
        return;
      }
    } else {
      console.log(`   ✅ Product created: ${productId}\n`);
    }

    // 6. Create order
    console.log(`6️⃣ POST /api/orders (Create Order)`);
    const orderBody = {
      items: [{ productId, qty: 2 }],
      delivery: {
        type: 'delivery',
        address: {
          street: '123 Main St',
          city: 'Nairobi',
          county: 'Nairobi County',
          country: 'Kenya',
        },
      },
    };
    res = await request('POST', '/orders', orderBody);
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, JSON.stringify(res.data).slice(0, 150));
    const orderId = res.data?.data?._id;
    if (orderId) {
      console.log(`   ✅ Order created: ${orderId}\n`);
    } else {
      console.log(`   ⚠️  Order creation response:`, res.data, '\n');
    }

    // 7. Get my orders
    console.log(`7️⃣ GET /api/orders/me (My Orders)`);
    res = await request('GET', '/orders/me', null);
    console.log(`   Status: ${res.status}`);
    console.log(`   Count: ${res.data?.count || 0}`);
    if (res.data?.count > 0) {
      console.log(`   ✅ Retrieved ${res.data.count} order(s)\n`);
    } else {
      console.log(`   ⚠️  No orders found\n`);
    }

    // 8. Get single order
    if (orderId) {
      console.log(`8️⃣ GET /api/orders/${orderId} (Get Order Details)`);
      res = await request('GET', `/orders/${orderId}`, null);
      console.log(`   Status: ${res.status}`);
      if (res.status === 200) {
        console.log(`   ✅ Order details retrieved`);
        console.log(`   Total: ${res.data?.data?.totalAmount}, Status: ${res.data?.data?.status}\n`);
      } else {
        console.log(`   Response:`, res.data, '\n');
      }
    }

    console.log('🎉 API Validation Complete!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();
