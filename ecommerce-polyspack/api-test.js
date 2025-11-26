// API Test Script for Order Endpoints
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

// Test helper function
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Register a test user
    console.log('📝 Test 1: Register User');
    const registerRes = await makeRequest('POST', '/auth/register', {
      name: 'Test User',
      email: `testuser${Date.now()}@test.com`,
      password: 'TestPassword123!',
      phone: '+254712345678',
    });
    console.log(`Status: ${registerRes.status}`);
    console.log(`Body:`, registerRes.body);
    const userId = registerRes.body?.data?._id;
    const email = registerRes.body?.data?.email;
    console.log('✅ Registration Complete\n');

    // Test 2: Login to get token
    console.log('📝 Test 2: Login User');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email,
      password: 'TestPassword123!',
    });
    console.log(`Status: ${loginRes.status}`);
    console.log(`Body:`, loginRes.body);
    const token = loginRes.body?.data?.token;
    console.log('✅ Login Complete\n');

    if (!token) {
      console.error('❌ Failed to get token');
      return;
    }

    const authHeaders = { Authorization: `Bearer ${token}` };

    // Test 3: Create a test product (requires admin)
    console.log('📝 Test 3: Create Product (Admin Required)');
    const productRes = await makeRequest('POST', '/products', {
      name: 'Test Fertilizer',
      description: 'Premium test fertilizer',
      price: 500,
      discountedPrice: 450,
      category: 'Fertilizers',
      stock: 100,
      images: ['https://via.placeholder.com/500'],
    }, authHeaders);
    console.log(`Status: ${productRes.status}`);
    console.log(`Body:`, productRes.body);
    const productId = productRes.body?.data?._id;
    console.log('✅ Product Creation Attempted\n');

    // Test 4: Get products
    console.log('📝 Test 4: Get Products');
    const productsRes = await makeRequest('GET', '/products');
    console.log(`Status: ${productsRes.status}`);
    console.log(`Body:`, JSON.stringify(productsRes.body, null, 2).slice(0, 500) + '...');
    const testProduct = productsRes.body?.data?.[0];
    const testProductId = testProduct?._id || productId;
    console.log('✅ Get Products Complete\n');

    // Test 5: Create an order
    console.log('📝 Test 5: Create Order');
    const orderRes = await makeRequest('POST', '/orders', {
      items: [
        {
          productId: testProductId,
          qty: 2,
        },
      ],
      delivery: {
        type: 'delivery',
        address: {
          street: '123 Main St',
          city: 'Nairobi',
          county: 'Nairobi County',
          town: 'Nairobi',
          country: 'Kenya',
        },
      },
    }, authHeaders);
    console.log(`Status: ${orderRes.status}`);
    console.log(`Body:`, orderRes.body);
    const orderId = orderRes.body?.data?._id;
    console.log('✅ Order Creation Complete\n');

    if (orderId) {
      // Test 6: Get user's orders
      console.log('📝 Test 6: Get My Orders');
      const myOrdersRes = await makeRequest('GET', '/orders/me', null, authHeaders);
      console.log(`Status: ${myOrdersRes.status}`);
      console.log(`Body:`, myOrdersRes.body);
      console.log('✅ Get My Orders Complete\n');

      // Test 7: Get single order
      console.log('📝 Test 7: Get Single Order');
      const singleOrderRes = await makeRequest('GET', `/orders/${orderId}`, null, authHeaders);
      console.log(`Status: ${singleOrderRes.status}`);
      console.log(`Body:`, singleOrderRes.body);
      console.log('✅ Get Single Order Complete\n');
    }

    console.log('🎉 All Tests Completed!');
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runTests();
