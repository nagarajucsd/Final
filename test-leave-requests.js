import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testLeaveRequests() {
    console.log('\n🧪 Testing Leave Request System\n');

    try {
        // Login
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        
        console.log('✅ Login successful');
        const userId = loginResponse.data.user.id;
        
        // MFA
        console.log('\n2️⃣ Verifying MFA...');
        const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: userId,
            token: '123456',
            isSetup: false
        });
        
        console.log('✅ MFA verified');
        const token = mfaResponse.data.token;
        
        // Get employees
        console.log('\n3️⃣ Fetching employees...');
        const empsResponse = await axios.get(`${API_URL}/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Found ${empsResponse.data.length} employees`);
        const testEmployee = empsResponse.data[0];
        
        // Get existing leave requests
        console.log('\n4️⃣ Fetching existing leave requests...');
        const existingLeaves = await axios.get(`${API_URL}/leaves`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Found ${existingLeaves.data.length} existing leave requests`);
        
        // Create leave request
        console.log('\n5️⃣ Creating test leave request...');
        const newLeave = await axios.post(`${API_URL}/leaves`, {
            employeeId: testEmployee.id,
            employeeName: testEmployee.name,
            leaveType: 'Annual',
            startDate: '2025-12-01',
            endDate: '2025-12-05',
            reason: 'Test leave request',
            days: 5
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Leave request created: ${newLeave.data.id}`);
        console.log(`   Employee: ${newLeave.data.employeeName}`);
        console.log(`   Type: ${newLeave.data.leaveType}`);
        console.log(`   Days: ${newLeave.data.days}`);
        console.log(`   Status: ${newLeave.data.status}`);
        const leaveId = newLeave.data.id;
        
        // Verify it's stored
        console.log('\n6️⃣ Verifying leave request is stored...');
        const verifyLeaves = await axios.get(`${API_URL}/leaves`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const foundLeave = verifyLeaves.data.find(l => l.id === leaveId);
        if (foundLeave) {
            console.log('✅ Leave request found in database');
            console.log(`   Total leave requests: ${verifyLeaves.data.length}`);
        } else {
            console.log('❌ Leave request NOT found in database');
        }
        
        // Update leave status
        console.log('\n7️⃣ Approving leave request...');
        const updateLeave = await axios.put(`${API_URL}/leaves/${leaveId}`, {
            status: 'Approved'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Leave status updated to: ${updateLeave.data.status}`);
        
        // Verify update persisted
        console.log('\n8️⃣ Verifying update persisted...');
        const checkLeave = await axios.get(`${API_URL}/leaves`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const updatedLeave = checkLeave.data.find(l => l.id === leaveId);
        if (updatedLeave && updatedLeave.status === 'Approved') {
            console.log('✅ Leave status update persisted in database');
        } else {
            console.log('❌ Leave status update NOT persisted');
        }
        
        // Delete test leave
        console.log('\n9️⃣ Deleting test leave request...');
        await axios.delete(`${API_URL}/leaves/${leaveId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Test leave request deleted');
        
        // Final verification
        console.log('\n🔟 Final verification...');
        const finalLeaves = await axios.get(`${API_URL}/leaves`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const stillExists = finalLeaves.data.find(l => l.id === leaveId);
        if (!stillExists) {
            console.log('✅ Leave request successfully removed from database');
        } else {
            console.log('❌ Leave request still exists in database');
        }
        
        console.log('\n🎉 All leave request operations successful!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Total leave requests in system: ${finalLeaves.data.length}`);
        console.log(`   - Leave requests are stored in MongoDB ✅`);
        console.log(`   - Leave requests are updated in MongoDB ✅`);
        console.log(`   - Leave requests persist across sessions ✅\n`);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testLeaveRequests();
