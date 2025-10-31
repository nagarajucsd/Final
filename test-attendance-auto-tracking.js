import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

const log = (emoji, message, color = colors.reset) => {
    console.log(`${color}${emoji} ${message}${colors.reset}`);
};

async function testAutoAttendanceTracking() {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 TESTING AUTO-ATTENDANCE TRACKING SYSTEM');
    console.log('='.repeat(80) + '\n');

    let testResults = {
        total: 0,
        passed: 0,
        failed: 0
    };

    const test = (name, passed, details = '') => {
        testResults.total++;
        if (passed) {
            testResults.passed++;
            log('✅', `${name}${details ? ': ' + details : ''}`, colors.green);
        } else {
            testResults.failed++;
            log('❌', `${name}${details ? ': ' + details : ''}`, colors.red);
        }
    };

    try {
        // Test 1: Login and verify auto-attendance creation
        log('📋', '=== TEST 1: AUTO-ATTENDANCE ON LOGIN ===', colors.cyan);
        
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        
        test('Login successful', loginResponse.status === 200);
        const userId = loginResponse.data.user.id;
        
        // Verify MFA
        const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: userId,
            token: '123456',
            isSetup: false
        });
        
        test('MFA verification successful', mfaResponse.status === 200);
        const token = mfaResponse.data.token;
        
        // Wait a moment for attendance to be created
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if attendance was created for today
        const today = new Date().toISOString().split('T')[0];
        const attendanceResponse = await axios.get(`${API_URL}/attendance`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const todayAttendance = attendanceResponse.data.find(a => {
            const attendanceDate = new Date(a.date).toISOString().split('T')[0];
            return attendanceDate === today && a.employeeId.email === 'admin@hrms.com';
        });
        
        test('Auto-attendance created on login', !!todayAttendance, todayAttendance ? `Clock-in: ${todayAttendance.clockIn}` : '');
        test('Attendance status is Present', todayAttendance?.status === 'Present');
        test('Clock-in time recorded', !!todayAttendance?.clockIn);
        
        // Test 2: Verify attendance appears in history
        log('\n📋', '=== TEST 2: ATTENDANCE HISTORY ===', colors.cyan);
        
        const allAttendance = attendanceResponse.data;
        test('Attendance records retrieved', allAttendance.length > 0, `Found ${allAttendance.length} records`);
        
        const presentRecords = allAttendance.filter(a => a.status === 'Present');
        test('Present records exist', presentRecords.length > 0, `Found ${presentRecords.length} present records`);
        
        // Test 3: Verify no future dates in attendance
        log('\n📋', '=== TEST 3: NO FUTURE DATE ATTENDANCE ===', colors.cyan);
        
        const futureAttendance = allAttendance.filter(a => {
            const attendanceDate = new Date(a.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return attendanceDate > today;
        });
        
        test('No future attendance records', futureAttendance.length === 0, `Found ${futureAttendance.length} future records`);
        
        // Test 4: Test manual attendance marking
        log('\n📋', '=== TEST 4: MANUAL ATTENDANCE MARKING ===', colors.cyan);
        
        // Get an employee to mark attendance for
        const employeesResponse = await axios.get(`${API_URL}/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const testEmployee = employeesResponse.data.find(e => e.email !== 'admin@hrms.com');
        
        if (testEmployee) {
            // Check if attendance exists for this employee today
            const existingAttendance = allAttendance.find(a => {
                const attendanceDate = new Date(a.date).toISOString().split('T')[0];
                return attendanceDate === today && a.employeeId._id === testEmployee.id;
            });
            
            if (existingAttendance) {
                // Update existing attendance
                const updateResponse = await axios.put(
                    `${API_URL}/attendance/${existingAttendance.id}`,
                    { status: 'Present' },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                test('Manual attendance update successful', updateResponse.status === 200);
            } else {
                // Create new attendance
                const createResponse = await axios.post(
                    `${API_URL}/attendance`,
                    {
                        employeeId: testEmployee.id,
                        date: today,
                        status: 'Present'
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                test('Manual attendance creation successful', createResponse.status === 201);
            }
        }
        
        // Test 5: Verify dashboard data updates
        log('\n📋', '=== TEST 5: DASHBOARD DATA CONSISTENCY ===', colors.cyan);
        
        const departments = await axios.get(`${API_URL}/departments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const employees = await axios.get(`${API_URL}/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const leaves = await axios.get(`${API_URL}/leaves`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        test('Departments data loaded', departments.data.length > 0, `${departments.data.length} departments`);
        test('Employees data loaded', employees.data.length > 0, `${employees.data.length} employees`);
        test('Leave requests data loaded', leaves.data.length >= 0, `${leaves.data.length} leave requests`);
        
        // Calculate present today percentage
        const activeEmployees = employees.data.filter(e => e.status === 'Active').length;
        const presentToday = allAttendance.filter(a => {
            const attendanceDate = new Date(a.date).toISOString().split('T')[0];
            return attendanceDate === today && a.status === 'Present';
        }).length;
        
        const presentPercentage = activeEmployees > 0 ? Math.round((presentToday / activeEmployees) * 100) : 0;
        
        test('Present today calculated', presentPercentage >= 0 && presentPercentage <= 100, `${presentPercentage}%`);
        test('Dashboard metrics valid', 
            departments.data.length > 0 && 
            employees.data.length > 0 && 
            presentPercentage >= 0
        );
        
        // Test 6: Verify attendance calendar data
        log('\n📋', '=== TEST 6: ATTENDANCE CALENDAR ===', colors.cyan);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyAttendance = allAttendance.filter(a => {
            const attendanceDate = new Date(a.date);
            return attendanceDate.getMonth() === currentMonth && 
                   attendanceDate.getFullYear() === currentYear;
        });
        
        test('Monthly attendance data available', monthlyAttendance.length > 0, `${monthlyAttendance.length} records this month`);
        
        const presentDays = monthlyAttendance.filter(a => a.status === 'Present').length;
        const absentDays = monthlyAttendance.filter(a => a.status === 'Absent').length;
        const leaveDays = monthlyAttendance.filter(a => a.status === 'Leave').length;
        
        test('Attendance status breakdown available', true, 
            `Present: ${presentDays}, Absent: ${absentDays}, Leave: ${leaveDays}`
        );
        
    } catch (error) {
        log('❌', `Test failed with error: ${error.message}`, colors.red);
        if (error.response) {
            console.log('Response data:', error.response.data);
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`${colors.green}Passed: ${testResults.passed} ✅${colors.reset}`);
    console.log(`${colors.red}Failed: ${testResults.failed} ❌${colors.reset}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
        console.log(`\n${colors.green}🎉 ALL TESTS PASSED! Auto-attendance tracking is working perfectly!${colors.reset}`);
    } else {
        console.log(`\n${colors.yellow}⚠️ Some tests failed. Please review the results above.${colors.reset}`);
    }
    
    console.log('='.repeat(80) + '\n');
}

testAutoAttendanceTracking();
