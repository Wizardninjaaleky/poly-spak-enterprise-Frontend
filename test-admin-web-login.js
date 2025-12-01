import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api/auth-v2';

const adminAccounts = [
  {
    name: 'Admin 1 - Jane Mumbi',
    email: 'janekamunge4@gmail.com',
    password: 'Jane2024!Admin'
  },
  {
    name: 'Admin 2 - Gerald Gitau',
    email: 'polyspackenterprise@gmail.com',
    password: 'Gerald2024!Admin'
  }
];

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║       ADMIN LOGIN CREDENTIALS & TEST                       ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📋 ADMIN LOGIN DETAILS FOR WEB INTERFACE:\n');
console.log('─────────────────────────────────────────────────────────────');

adminAccounts.forEach((admin, index) => {
  console.log(`\n${index + 1}. ${admin.name}`);
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: ${admin.password}`);
  console.log(`   URL:      http://localhost:3000/admin`);
});

console.log('\n─────────────────────────────────────────────────────────────\n');

async function testAdminLogin() {
  console.log('🧪 TESTING ADMIN LOGIN VIA API:\n');

  for (const admin of adminAccounts) {
    console.log(`\n▶ Testing: ${admin.name}`);
    console.log(`  Email: ${admin.email}`);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: admin.email,
          password: admin.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('  ✅ LOGIN SUCCESSFUL!');
        console.log(`  👤 User: ${data.user.name || 'N/A'}`);
        console.log(`  📧 Email: ${data.user.email}`);
        console.log(`  🔑 Role: ${data.user.role}`);
        console.log(`  🎫 Token: ${data.token.substring(0, 40)}...`);
        
        // Test token validation
        const meResponse = await fetch(`${API_BASE}/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        if (meResponse.ok) {
          console.log('  ✅ Token validation successful!');
        } else {
          console.log('  ⚠️  Token validation failed');
        }
      } else {
        console.log('  ❌ LOGIN FAILED');
        console.log(`  Error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log('  ❌ REQUEST FAILED');
      console.log(`  Error: ${error.message}`);
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    TEST COMPLETE                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('📝 INSTRUCTIONS FOR WEB LOGIN:');
  console.log('1. Open browser to: http://localhost:3000/admin');
  console.log('2. Enter one of the email addresses above');
  console.log('3. Enter the corresponding password');
  console.log('4. Click "Sign In" or press Enter\n');
}

testAdminLogin();
