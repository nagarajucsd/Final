import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAutoAttendance() {
    console.log('\n🧪 Testing Auto-Attendance on Login\n');

    try {
        // Step 1: Login
        console.log('1️⃣ Logging in as admin@hrms.com...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        
        console.log('✅ Login successful');
        const userId = loginResponse.data.user.id;
        
        // Step 2: Verify MFA
        console.log('\n2️⃣ Verifying MFA...');
        const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: userId,
            token: '123456',
            isSetup: false
        });
        
        console.log('✅ MFA verified');
        const token = mfaResponse.data.token;
        
        // Step 3: Wait a moment for attendance to be created
        console.log('\n3️⃣ Waiting for auto-attendance creation...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 4: Check attendance
        console.log('\n4️⃣ Checking attendance records...');
        const attendanceResponse = await axios.get(`${API_URL}/attendance`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const today = new Date().toISOString().split('T')[0];
        console.log(`Today's date: ${today}`);
        console.log(`Total attendance records: ${attendanceResponse.data.length}`);
        
        // Find today's attendance for admin
        const todayAttendance = attendanceResponse.data.filter(a => {
            const attendanceDate = new Date(a.date).toISOString().split('T')[0];
            return attendanceDate === today;
        });
        
        console.log(`\nAttendance records for today (${today}):`);
        todayAttendance.forEach(a => {
            const empEmail = a.employeeId?.email || 'N/A';
            const empName = a.employeeId?.name || 'N/A';
            console.log(`  - ${empName} (${empEmail}): ${a.status}, Clock-in: ${a.clockIn || 'N/A'}`);
        });
        
        const adminAttendance = todayAttendance.find(a => a.employeeId?.email === 'admin@hrms.com');
        
        if (adminAttendance) {
            console.log('\n✅ SUCCESS: Auto-attendance created!');
            console.log(`   Status: ${adminAttendance.status}`);
            console.log(`   Clock-in: ${adminAttendance.clockIn}`);
            console.log(`   Date: ${new Date(adminAttendance.date).toISOString().split('T')[0]}`);
        } else {
            console.log('\n❌ FAILED: No attendance record found for admin@hrms.com today');
            console.log('\n🔍 Checking if employee record exists...');
            
            const employeesResponse = await axios.get(`${API_URL}/employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const adminEmployee = employeesResponse.data.find(e => e.email === 'admin@hrms.com');
            if (adminEmployee) {
                console.log('✅ Employee record exists:', adminEmployee.name);
            } else {
                console.log('❌ No employee record found for admin@hrms.com');
            }
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testAutoAttendance();
