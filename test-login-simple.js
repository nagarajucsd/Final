import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
  console.log('Testing login with different credentials...\n');
  
  const credentials = [
    { email: 'admin@hrms.com', password: 'admin123' },
    { email: 'admin@hrms.com', password: 'password' },
    { email: 'admin@hrms.com', password: 'Admin@123' },
    { email: 'hr@hrms.com', password: 'hr123' },
    { email: 'manager@hrms.com', password: 'manager123' },
    { email: 'employee@hrms.com', password: 'employee123' }
  ];
  
  for (const cred of credentials) {
    try {
      console.log(`Trying: ${cred.email} / ${cred.password}`);
      const response = await axios.post(`${API_URL}/auth/login`, cred);
      console.log(`✅ SUCCESS! Token: ${response.data.token.substring(0, 20)}...`);
      console.log(`   User: ${response.data.user.name} (${response.data.user.role})\n`);
      return;
    } catch (error) {
      console.log(`❌ Failed: ${error.response?.data?.message || error.message}\n`);
    }
  }
  
  console.log('All login attempts failed. Database may need to be seeded.');
}

testLogin();
