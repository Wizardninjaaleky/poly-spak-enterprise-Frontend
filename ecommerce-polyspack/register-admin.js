import axios from 'axios';

const API_BASE_URL = 'https://poly-spak-enterprise-backend-2.onrender.com/api';

async function registerAdmin() {
  try {
    console.log('Registering admin user...');

    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Polyspack Admin',
      email: 'polyspackenterprise@gmail.com',
      phone: '+254742312306',
      password: 'Thamanda@2025',
      role: 'admin'
    });

    console.log('✅ Admin user registered successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
      console.log('ℹ️ Admin user already exists');
    } else {
      console.error('❌ Error registering admin user:', error.response?.data || error.message);
    }
  }
}

registerAdmin();
