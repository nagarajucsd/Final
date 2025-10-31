import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
  console.log('\n🔐 Testing Login Flow...\n');
  
  try {
    // Test 1: Login with admin credentials
    console.log('1️⃣ Testing login with admin@hrms.com...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@hrms.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.data.user) {
      const user = loginResponse.data.user;
      console.log('\n📋 User Details:');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   MFA Enabled: ${user.mfaEnabled}`);
      console.log(`   Account Locked: ${user.accountLocked || false}`);
      
      if (user.mfaEnabled) {
        console.log('\n2️⃣ MFA is enabled, testing verification...');
        console.log('   Use code: 123456 (demo mode)');
        
        try {
          const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: user._id || user.id,
            token: '123456',
            isSetup: false
          });
          
          console.log('✅ MFA verification successful!');
          console.log('   Token received:', mfaResponse.data.token ? 'Yes' : 'No');
        } catch (mfaError) {
          console.log('❌ MFA verification failed:', mfaError.response?.data?.message || mfaError.message);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
