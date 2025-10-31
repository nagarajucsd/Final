import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testTasks() {
    console.log('\n🧪 Testing Task Management System\n');

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
        
        // Get tasks
        console.log('\n3️⃣ Fetching tasks...');
        const tasksResponse = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Found ${tasksResponse.data.length} tasks`);
        
        // Get departments
        console.log('\n4️⃣ Fetching departments...');
        const deptsResponse = await axios.get(`${API_URL}/departments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Found ${deptsResponse.data.length} departments`);
        const testDeptId = deptsResponse.data[0].id;
        
        // Get employees
        console.log('\n5️⃣ Fetching employees...');
        const empsResponse = await axios.get(`${API_URL}/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Found ${empsResponse.data.length} employees`);
        const testEmployeeId = empsResponse.data[0].id;
        
        // Create task
        console.log('\n6️⃣ Creating test task...');
        const newTask = await axios.post(`${API_URL}/tasks`, {
            title: 'Test Task',
            description: 'This is a test task',
            priority: 'High',
            assignedTo: testEmployeeId,
            departmentId: testDeptId,
            dueDate: '2025-12-31'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Task created: ${newTask.data.id}`);
        const taskId = newTask.data.id;
        
        // Update task
        console.log('\n7️⃣ Updating task status...');
        const updateTask = await axios.put(`${API_URL}/tasks/${taskId}`, {
            status: 'In Progress'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Task status updated to: ${updateTask.data.status}`);
        
        // Delete task
        console.log('\n8️⃣ Deleting test task...');
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Task deleted');
        
        console.log('\n🎉 All task operations successful!\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testTasks();
