import axios from 'axios';

const API_BASE_URL = 'https://poly-spak-enterprise-backend-2.onrender.com/api';

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'polyspackenterprise@gmail.com',
      password: 'Thamanda@2025'
    });

    console.log('✅ Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);

  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

testAdminLogin();
