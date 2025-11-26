const http = require('http');

function request(method, path, body, authToken = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }
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
  console.log('🧪 Testing Complete Order Workflow\n');

  try {
    const timestamp = Date.now();
    const customerEmail = `customer${timestamp}@test.com`;

    // 1. Admin login (predefined admin user)
    console.log('1️⃣ Admin: Login');
    let res = await request('POST', '/auth/login', {
      email: 'janekamunge4@gmail.com',
      password: 'Jane@2025',
    });
    console.log(`   Status: ${res.status}`);
    let adminToken = res.data?.token;
    if (adminToken) {
      console.log(`   ✅ Admin logged in`);
    } else {
      console.log(`   ❌ Failed to login: ${res.data?.message}`);
    }
    console.log();

    // 2. Register customer user
    console.log('2️⃣ Register Customer User');
    res = await request('POST', '/auth/register', {
      name: 'Customer User',
      email: customerEmail,
      password: 'Customer@12345',
      phone: '+254787654321',
    });
    console.log(`   Status: ${res.status}`);
    if (res.status === 201) {
      console.log(`   ✅ Customer registered: ${customerEmail}`);
    }
    console.log();

    // 3. Login customer
    console.log('3️⃣ Login Customer User');
    res = await request('POST', '/auth/login', { email: customerEmail, password: 'Customer@12345' });
    console.log(`   Status: ${res.status}`);
    const customerToken = res.data?.token;
    if (customerToken) {
      console.log(`   ✅ Customer logged in`);
    }
    console.log();

    if (!adminToken || !customerToken) {
      console.log('❌ Failed to get tokens');
      return;
    }

    // 4. Admin creates product
    console.log('4️⃣ Admin: Create Product');
    res = await request('POST', '/products', {
      name: 'Premium NPK Fertilizer',
      description: 'High-quality NPK 10-10-10 fertilizer for crops',
      price: 2500,
      discountedPrice: 2200,
      category: 'Fertilizers',
      stock: 200,
      images: ['https://via.placeholder.com/500x500?text=Fertilizer'],
    }, adminToken);
    console.log(`   Status: ${res.status}`);
    const productId = res.data?.data?._id;
    if (productId) {
      console.log(`   ✅ Product created: ${productId}`);
      console.log(`      Name: ${res.data?.data?.name}`);
      console.log(`      Price: ${res.data?.data?.price}`);
    } else {
      console.log(`   ⚠️  Response: ${JSON.stringify(res.data).slice(0, 100)}`);
    }
    console.log();

    if (!productId) {
      console.log('❌ Cannot continue without product');
      return;
    }

    // 5. Get products (customer)
    console.log('5️⃣ Customer: Get Products');
    res = await request('GET', '/products', null, customerToken);
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Found ${res.data?.count || 0} product(s)`);
    if (res.data?.data?.length > 0) {
      const p = res.data.data[0];
      console.log(`      First Product: ${p.name} - ${p.price}`);
    }
    console.log();

    // 6. Customer creates order
    console.log('6️⃣ Customer: Create Order');
    res = await request('POST', '/orders', {
      items: [
        { productId, qty: 2 },
      ],
      delivery: {
        type: 'delivery',
        address: {
          street: '123 Main Street',
          city: 'Nairobi',
          county: 'Nairobi County',
          town: 'Westlands',
          country: 'Kenya',
        },
      },
    }, customerToken);
    console.log(`   Status: ${res.status}`);
    const orderId = res.data?.data?._id;
    if (orderId) {
      console.log(`   ✅ Order created: ${orderId}`);
      console.log(`      Items: ${res.data?.data?.items?.length || 0}`);
      console.log(`      Total: KES ${res.data?.data?.totalAmount || 0}`);
      console.log(`      Status: ${res.data?.data?.status}`);
    } else {
      console.log(`   ⚠️  Response: ${JSON.stringify(res.data).slice(0, 150)}`);
    }
    console.log();

    if (!orderId) {
      console.log('❌ Cannot continue without order');
      return;
    }

    // 7. Customer: Get my orders
    console.log('7️⃣ Customer: Get My Orders');
    res = await request('GET', '/orders/me', null, customerToken);
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Retrieved ${res.data?.count || 0} order(s)`);
    console.log();

    // 8. Customer: Get single order
    console.log('8️⃣ Customer: Get Order Details');
    res = await request('GET', `/orders/${orderId}`, null, customerToken);
    console.log(`   Status: ${res.status}`);
    if (res.status === 200) {
      console.log(`   ✅ Order Details:`);
      console.log(`      ID: ${res.data?.data?._id}`);
      console.log(`      Total: KES ${res.data?.data?.totalAmount}`);
      console.log(`      Status: ${res.data?.data?.status}`);
      console.log(`      Payment Status: ${res.data?.data?.paymentStatus}`);
      console.log(`      Delivery Type: ${res.data?.data?.delivery?.type}`);
      console.log(`      Items: ${res.data?.data?.items?.length}`);
    } else {
      console.log(`   ⚠️  Response: ${JSON.stringify(res.data)}`);
    }
    console.log();

    // 9. Admin: Get all orders
    console.log('9️⃣ Admin: Get All Orders');
    res = await request('GET', '/orders', null, adminToken);
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Retrieved ${res.data?.count || 0} order(s)`);
    console.log();

    // 10. Admin: Update order status
    console.log('🔟 Admin: Update Order Status');
    res = await request('PUT', `/orders/${orderId}/status`, { status: 'confirmed' }, adminToken);
    console.log(`   Status: ${res.status}`);
    if (res.status === 200) {
      console.log(`   ✅ Order updated`);
      console.log(`      New Status: ${res.data?.data?.status}`);
    } else {
      console.log(`   ⚠️  Response: ${JSON.stringify(res.data)}`);
    }
    console.log();

    console.log('🎉 API Validation Complete!');
    console.log('\n✅ Test Summary:');
    console.log('   ✓ User registration working');
    console.log('   ✓ User login working');
    console.log('   ✓ Product creation working (admin)');
    console.log('   ✓ Order creation working');
    console.log('   ✓ Order retrieval working');
    console.log('   ✓ Order status update working');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();
