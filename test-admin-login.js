import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

const testAdminLogin = async () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     Admin Login Test                   ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Test 1: Login with janekamunge4@gmail.com
    console.log('=== Testing Admin Login ===');
    console.log('Email: janekamunge4@gmail.com');
    
    const loginResponse = await fetch(`${API_URL}/auth-v2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'janekamunge4@gmail.com',
        password: 'Jane2024!Admin',
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok && loginData.success) {
      console.log('✓ Admin login successful!');
      console.log(`  User: ${loginData.user.firstName} ${loginData.user.lastName}`);
      console.log(`  Email: ${loginData.user.email}`);
      console.log(`  Role: ${loginData.user.role}`);
      console.log(`  Token received: ${loginData.token ? 'Yes' : 'No'}`);
      
      // Test 2: Get user info with token
      console.log('\n=== Testing Token Validation ===');
      const meResponse = await fetch(`${API_URL}/auth-v2/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
        },
      });
      
      const meData = await meResponse.json();
      
      if (meResponse.ok && meData.success) {
        console.log('✓ Token is valid!');
        console.log(`  Verified user: ${meData.user.firstName} ${meData.user.lastName}`);
        console.log(`  Role: ${meData.user.role}`);
      } else {
        console.log('✗ Token validation failed');
        console.log(`  Error: ${meData.message}`);
      }
    } else {
      console.log('✗ Admin login failed');
      console.log(`  Status: ${loginResponse.status}`);
      console.log(`  Message: ${loginData.message}`);
    }

    // Test 3: Try second admin login
    console.log('\n=== Testing Second Admin Login ===');
    console.log('Email: polyspackenterprise@gmail.com');
    
    const admin2Response = await fetch(`${API_URL}/auth-v2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'polyspackenterprise@gmail.com',
        password: 'Gerald2024!Admin',
      }),
    });

    const admin2Data = await admin2Response.json();
    
    if (admin2Response.ok && admin2Data.success) {
      console.log('✓ Second admin login successful!');
      console.log(`  User: ${admin2Data.user.firstName} ${admin2Data.user.lastName}`);
      console.log(`  Email: ${admin2Data.user.email}`);
      console.log(`  Role: ${admin2Data.user.role}`);
    } else {
      console.log('✗ Second admin login failed');
      console.log(`  Message: ${admin2Data.message}`);
    }

    // Test 4: Try wrong password
    console.log('\n=== Testing Wrong Password ===');
    
    const wrongResponse = await fetch(`${API_URL}/auth-v2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'janekamunge4@gmail.com',
        password: 'wrongpassword',
      }),
    });

    const wrongData = await wrongResponse.json();
    
    if (!wrongResponse.ok) {
      console.log('✓ Wrong password correctly rejected');
      console.log(`  Message: ${wrongData.message}`);
    } else {
      console.log('✗ Security issue: Wrong password accepted!');
    }

  } catch (error) {
    console.error('✗ Test error:', error.message);
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║         Tests Complete                 ║');
  console.log('╚════════════════════════════════════════╝\n');
};

testAdminLogin();
