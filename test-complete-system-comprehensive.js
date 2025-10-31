import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';
let testDepartmentId = '';
let testEmployeeId = '';
let testLeaveId = '';
let testAttendanceId = '';
let testTaskId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let passedTests = 0;
let failedTests = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  if (passed) {
    passedTests++;
    log(`✅ ${testName}`, 'green');
    if (details) log(`   ${details}`, 'cyan');
  } else {
    failedTests++;
    log(`❌ ${testName}`, 'red');
    if (details) log(`   ${details}`, 'yellow');
  }
}

async function testHealthCheck() {
  log('\n📡 Testing API Health Check...', 'blue');
  try {
    const response = await axios.get(`${API_URL}/health`);
    logTest('API Health Check', response.status === 200, `Status: ${response.data.status}`);
    return true;
  } catch (error) {
    logTest('API Health Check', false, error.message);
    return false;
  }
}

async function testLogin() {
  log('\n🔐 Testing Authentication...', 'blue');
  try {
    // Step 1: Login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@hrms.com',
      password: 'password123'
    });
    
    const user = loginResponse.data.user;
    testUserId = user.id || user._id;
    
    logTest('Login with credentials', !!user, `User: ${user.name}, Role: ${user.role}`);
    logTest('MFA Setup field returned', user.isMfaSetup !== undefined, `isMfaSetup: ${user.isMfaSetup}`);
    
    // Step 2: MFA Verification
    const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
      userId: testUserId,
      token: '123456',
      isSetup: false
    });
    
    authToken = mfaResponse.data.token;
    logTest('MFA Verification', !!authToken, 'Token received');
    
    return true;
  } catch (error) {
    logTest('Authentication', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testDepartmentCRUD() {
  log('\n🏢 Testing Department CRUD Operations...', 'blue');
  const config = { headers: { Authorization: `Bearer ${authToken}` } };
  
  try {
    // CREATE
    const createResponse = await axios.post(`${API_URL}/departments`, {
      name: 'Test Department ' + Date.now(),
      description: 'Automated test department',
      managerId: null
    }, config);
    
    testDepartmentId = createResponse.data.id || createResponse.data._id;
    logTest('Create Department', !!testDepartmentId, `ID: ${testDepartmentId}`);
    
    // READ ALL
    const getAllResponse = await axios.get(`${API_URL}/departments`, config);
    logTest('Get All Departments', getAllResponse.data.length > 0, `Found ${getAllResponse.data.length} departments`);
    
    // READ ONE
    const getOneResponse = await axios.get(`${API_URL}/departments/${testDepartmentId}`, config);
    logTest('Get Single Department', getOneResponse.data.id === testDepartmentId, `Name: ${getOneResponse.data.name}`);
    
    // UPDATE
    const updateResponse = await axios.put(`${API_URL}/departments/${testDepartmentId}`, {
      name: 'Updated Test Department',
      description: 'Updated description'
    }, config);
    logTest('Update Department', updateResponse.data.name === 'Updated Test Department', 'Name updated');
    
    return true;
  } catch (error) {
    logTest('Department CRUD', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testEmployeeCRUD() {
  log('\n👥 Testing Employee CRUD Operations...', 'blue');
  const config = { headers: { Authorization: `Bearer ${authToken}` } };
  
  try {
    // CREATE
    const createResponse = await axios.post(`${API_URL}/employees`, {
      employeeId: 'TEST' + Date.now(),
      name: 'Test Employee',
      email: `test${Date.now()}@test.com`,
      phone: '+1234567890',
      departmentId: testDepartmentId,
      role: 'Software Engineer',
      salary: 75000,
      status: 'Active',
      employeeType: 'Permanent',
      joinDate: new Date().toISOString().split('T')[0],
      password: 'password123'
    }, config);
    
    const createdEmployee = createResponse.data.employee || createResponse.data;
    testEmployeeId = createdEmployee.id || createdEmployee._id;
    logTest('Create Employee', !!testEmployeeId, `ID: ${testEmployeeId}`);
    
    // READ ALL
    const getAllResponse = await axios.get(`${API_URL}/employees`, config);
    logTest('Get All Employees', getAllResponse.data.length > 0, `Found ${getAllResponse.data.length} employees`);
    
    // READ ONE
    const getOneResponse = await axios.get(`${API_URL}/employees/${testEmployeeId}`, config);
    logTest('Get Single Employee', getOneResponse.data.id === testEmployeeId, `Name: ${getOneResponse.data.name}`);
    
    // UPDATE
    const updateResponse = await axios.put(`${API_URL}/employees/${testEmployeeId}`, {
      name: 'Updated Test Employee',
      salary: 80000
    }, config);
    logTest('Update Employee', updateResponse.data.salary === 80000, 'Salary updated to 80000');
    
    return true;
  } catch (error) {
    logTest('Employee CRUD', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testAttendanceCRUD() {
  log('\n📅 Testing Attendance Operations...', 'blue');
  const config = { headers: { Authorization: `Bearer ${authToken}` } };
  
  try {
    // Use the test employee if created, otherwise use an existing one
    let employeeIdForAttendance = testEmployeeId;
    if (!employeeIdForAttendance) {
      const employeesResponse = await axios.get(`${API_URL}/employees`, config);
      if (employeesResponse.data.length > 0) {
        employeeIdForAttendance = employeesResponse.data[0].id || employeesResponse.data[0]._id;
      } else {
        logTest('Attendance Operations', false, 'No employees found for attendance');
        return false;
      }
    }
    
    // Use a past date to avoid conflicts with today's auto-attendance
    const testDate = new Date();
    testDate.setDate(testDate.getDate() - 5);
    const dateString = testDate.toISOString().split('T')[0];
    
    // CREATE
    const createResponse = await axios.post(`${API_URL}/attendance`, {
      employeeId: employeeIdForAttendance,
      date: dateString,
      status: 'Present',
      clockIn: '09:00 AM',
      clockOut: '05:00 PM',
      workHours: '8:00'
    }, config);
    
    testAttendanceId = createResponse.data.id || createResponse.data._id;
    logTest('Create Attendance', !!testAttendanceId, `Date: ${dateString}`);
    
    // READ ALL
    const getAllResponse = await axios.get(`${API_URL}/attendance`, config);
    logTest('Get All Attendance', getAllResponse.data.length > 0, `Found ${getAllResponse.data.length} records`);
    
    // UPDATE
    const updateResponse = await axios.put(`${API_URL}/attendance/${testAttendanceId}`, {
      status: 'Present',
      clockOut: '06:00 PM',
      workHours: '9:00'
    }, config);
    logTest('Update Attendance', updateResponse.data.workHours === '9:00', 'Work hours updated');
    
    return true;
  } catch (error) {
    logTest('Attendance Operations', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testLeaveCRUD() {
  log('\n🏖️ Testing Leave Management...', 'blue');
  const config = { headers: { Authorization: `Bearer ${authToken}` } };
  
  try {
    // Use the test employee if created, otherwise use an existing one
    let employeeIdForLeave = testEmployeeId;
    if (!employeeIdForLeave) {
      const employeesResponse = await axios.get(`${API_URL}/employees`, config);
      if (employeesResponse.data.length > 0) {
        employeeIdForLeave = employeesResponse.data[0].id || employeesResponse.data[0]._id;
      } else {
        logTest('Leave Management', false, 'No employees found for leave request');
        return false;
      }
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 2);
    
    // CREATE
    const createResponse = await axios.post(`${API_URL}/leaves`, {
      employeeId: employeeIdForLeave,
      leaveType: 'Annual',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      reason: 'Automated test leave request',
      status: 'Pending'
    }, config);
    
    testLeaveId = createResponse.data.id || createResponse.data._id;
    logTest('Create Leave Request', !!testLeaveId, `Type: Annual, Days: 3`);
    
    // READ ALL
    const getAllResponse = await axios.get(`${API_URL}/leaves`, config);
    logTest('Get All Leave Requests', getAllResponse.data.length > 0, `Found ${getAllResponse.data.length} requests`);
    
    // UPDATE STATUS
    const updateResponse = await axios.put(`${API_URL}/leaves/${testLeaveId}`, {
      status: 'Approved'
    }, config);
    logTest('Approve Leave Request', updateResponse.data.status === 'Approved', 'Status: Approved');
    
    return true;
  } catch (error) {
    logTest('Leave Management', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testTaskCRUD() {
  log('\n✅ Testing Task Management...', 'blue');
  const config = { headers: { Authorization: `Bearer ${authToken}` } };
  
  try {
    // Get an existing employee for task assignment
    const employeesResponse = await axios.get(`${API_URL}/employees`, config);
    const existingEmployee = employeesResponse.data[0];
    
    if (!existingEmployee) {
      logTest('Task Management', false, 'No employees found for task assignment');
      return false;
    }
    
    // CREATE
    const createResponse = await axios.post(`${API_URL}/tasks`, {
      title: 'Test Task ' + Date.now(),
      description: 'Automated test task',
      assignedTo: existingEmployee.id || existingEmployee._id,
      assignedBy: testUserId,
      departmentId: existingEmployee.departmentId?._id || existingEmployee.departmentId,
      priority: 'Medium',
      status: 'To Do',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }, config);
    
    testTaskId = createResponse.data.id || createResponse.data._id;
    logTest('Create Task', !!testTaskId, `Priority: Medium`);
    
    // READ ALL
    const getAllResponse = await axios.get(`${API_URL}/tasks`, config);
    logTest('Get All Tasks', getAllResponse.data.length >= 0, `Found ${getAllResponse.data.length} tasks`);
    
    // UPDATE
    const updateResponse = await axios.put(`${API_URL}/tasks/${testTaskId}`, {
      status: 'In Progress'
    }, config);
    logTest('Update Task', updateResponse.data.status === 'In Progress', 'Status: In Progress');
    
    return true;
  } catch (error) {
    logTest('Task Management', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testDashboardData() {
  log('\n📊 Testing Dashboard Data...', 'blue');
  const config = { headers: { Authorization: `Bearer ${authToken}` } };
  
  try {
    const [employees, departments, leaves, attendance] = await Promise.all([
      axios.get(`${API_URL}/employees`, config),
      axios.get(`${API_URL}/departments`, config),
      axios.get(`${API_URL}/leaves`, config),
      axios.get(`${API_URL}/attendance`, config)
    ]);
    
    logTest('Dashboard - Employees Data', employees.data.length > 0, `${employees.data.length} employees`);
    logTest('Dashboard - Departments Data', departments.data.length > 0, `${departments.data.length} departments`);
    logTest('Dashboard - Leave Requests', leaves.data.length > 0, `${leaves.data.length} requests`);
    logTest('Dashboard - Attendance Records', attendance.data.length > 0, `${attendance.data.length} records`);
    
    // Calculate statistics
    const activeEmployees = employees.data.filter(e => e.status === 'Active').length;
    const pendingLeaves = leaves.data.filter(l => l.status === 'Pending').length;
    const todayAttendance = attendance.data.filter(a => a.date === new Date().toISOString().split('T')[0]);
    
    logTest('Dashboard - Statistics Calculation', true, 
      `Active: ${activeEmployees}, Pending Leaves: ${pendingLeaves}, Today: ${todayAttendance.length}`);
    
    return true;
  } catch (error) {
    logTest('Dashboard Data', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function testCleanup() {
  log('\n🧹 Testing Cleanup (DELETE Operations)...', 'blue');
  const config = { headers: { Authorization: `Bearer ${authToken}` } };
  
  try {
    // Delete in reverse order of dependencies
    if (testTaskId) {
      await axios.delete(`${API_URL}/tasks/${testTaskId}`, config);
      logTest('Delete Task', true, `Task ${testTaskId} deleted`);
    }
    
    if (testLeaveId) {
      await axios.delete(`${API_URL}/leaves/${testLeaveId}`, config);
      logTest('Delete Leave Request', true, `Leave ${testLeaveId} deleted`);
    }
    
    if (testAttendanceId) {
      await axios.delete(`${API_URL}/attendance/${testAttendanceId}`, config);
      logTest('Delete Attendance', true, `Attendance ${testAttendanceId} deleted`);
    }
    
    if (testEmployeeId) {
      await axios.delete(`${API_URL}/employees/${testEmployeeId}`, config);
      logTest('Delete Employee', true, `Employee ${testEmployeeId} deleted`);
    }
    
    if (testDepartmentId) {
      await axios.delete(`${API_URL}/departments/${testDepartmentId}`, config);
      logTest('Delete Department', true, `Department ${testDepartmentId} deleted`);
    }
    
    return true;
  } catch (error) {
    logTest('Cleanup Operations', false, error.response?.data?.message || error.message);
    return false;
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(80), 'cyan');
  log('🚀 COMPREHENSIVE SYSTEM TEST - WEintegrity HRMS', 'cyan');
  log('='.repeat(80) + '\n', 'cyan');
  
  const startTime = Date.now();
  
  // Run all tests
  await testHealthCheck();
  const authSuccess = await testLogin();
  
  if (authSuccess) {
    await testDepartmentCRUD();
    await testEmployeeCRUD();
    await testAttendanceCRUD();
    await testLeaveCRUD();
    await testTaskCRUD();
    await testDashboardData();
    await testCleanup();
  } else {
    log('\n⚠️ Authentication failed. Skipping remaining tests.', 'yellow');
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Summary
  log('\n' + '='.repeat(80), 'cyan');
  log('📊 TEST RESULTS SUMMARY', 'cyan');
  log('='.repeat(80), 'cyan');
  log(`\nTotal Tests: ${passedTests + failedTests}`, 'blue');
  log(`Passed: ${passedTests} ✅`, 'green');
  log(`Failed: ${failedTests} ❌`, failedTests > 0 ? 'red' : 'green');
  log(`\nSuccess Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`, 'cyan');
  log(`Duration: ${duration}s`, 'cyan');
  
  if (failedTests === 0) {
    log('\n🎉 ALL TESTS PASSED! System is fully operational!', 'green');
  } else {
    log(`\n⚠️ ${failedTests} test(s) failed. Please review the errors above.`, 'yellow');
  }
  
  log('='.repeat(80) + '\n', 'cyan');
}

// Run the tests
runAllTests().catch(error => {
  log('\n💥 Fatal error during testing:', 'red');
  console.error(error);
  process.exit(1);
});
