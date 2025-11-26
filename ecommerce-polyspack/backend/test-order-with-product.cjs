const http = require('http');

function request(method, path, body, token) {
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
    const customerEmail = `orderuser${Date.now()}@test.com`;
    console.log('Register customer...');
    let res = await request('POST','/auth/register',{ name: 'Order User', email: customerEmail, password: 'Order@12345', phone: '+254700000000' });
    console.log('Register status', res.status);

    console.log('Login customer...');
    res = await request('POST','/auth/login',{ email: customerEmail, password: 'Order@12345' });
    console.log('Login status', res.status);
    const token = res.body?.token;
    if (!token) { console.error('No token'); return; }

    // Use existing product id created earlier
    const productId = '692709f19ff41924d4f2c01a';
    console.log('Create order with product:', productId);
    res = await request('POST','/orders', {
      items: [{ productId, qty: 1 }],
      delivery: { type: 'delivery', address: { street: '1 Test St', city: 'Nairobi', county: 'Nairobi', country: 'Kenya' } }
    }, token);
    console.log('Order create status', res.status);
    console.log('Order response', res.body);
  } catch (e) {
    console.error('Error', e.message);
  }
})();
