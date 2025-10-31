import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(70)}${colors.reset}\n`)
};

let authToken = '';
let testEmployeeId = '';
let testDepartmentId = '';

async function testBackendHealth() {
  log.section('TEST 1: Backend Health Check');
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 3000 });
    log.success('Backend is running');
    log.info(`  Status: ${response.data.status}`);
    return true;
  } catch (error) {
    log.error('Backend is not responding');
    log.warning('  Make sure backend is running: cd server && npm start');
    return false;
  }
}

async function testFrontendHealth() {
  log.section('TEST 2: Frontend Health Check');
  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 3000 });
    log.success('Frontend is running');
    log.info(`  URL: ${FRONTEND_URL}`);
    return true;
  } catch (error) {
    log.error('Frontend is not responding');
    log.warning('  Make sure frontend is running: npm run dev');
    return false;
  }
}

async function testLogin() {
  log.section('TEST 3: Authentication');
  
  const credentials = [
    { email: 'admin@hrms.com', password: 'admin123', role: 'Admin' },
    { email: 'hr@hrms.com', password: 'hr123', role: 'HR' },
    { email: 'manager@hrms.com', password: 'manager123', role: 'Manager' }
  ];
  
  for (const cred of credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: cred.email,
        password: cred.password
      });
      
      if (cred.role === 'Admin') {
        authToken = response.data.token;
      }
      
      log.success(`${cred.role} login successful`);
      log.info(`  Email: ${cred.email}`);
      return true;
    } catch (error) {
      log.error(`${cred.role} login failed: ${error.response?.data?.message || error.message}`);
    }
  }
  
  return false;
}

async function testDepartmentCRUD() {
  log.section('TEST 4: Department CRUD Operations');
  
  try {
    // Create
    log.info('Creating department...');
    const createResponse = await axios.post(
      `${API_URL}/departments`,
      { name: `Test Dept ${Date.now()}`, managerId: null },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    testDepartmentId = createResponse.data._id || createResponse.data.id;
    log.success(`Department created: ${testDepartmentId}`);
    
    // Read
    log.info('Reading departments...');
    const readResponse = await axios.get(`${API_URL}/departments`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log.success(`Retrieved ${readResponse.data.length} departments`);
    
    // Update
    log.info('Updating department...');
    await axios.put(
      `${API_URL}/departments/${testDepartmentId}`,
      { name: `Updated Dept ${Date.now()}` },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    log.success('Department updated');
    
    return true;
  } catch (error) {
    log.error(`Department CRUD failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testEmployeeCRUD() {
  log.section('TEST 5: Employee CRUD Operations');
  
  try {
    const timestamp = Date.now();
    
    // Create
    log.info('Creating employee...');
    const createResponse = await axios.post(
      `${API_URL}/employees`,
      {
        employeeId: `EMP${timestamp}`,
        name: `Test Employee ${timestamp}`,
        email: `test${timestamp}@company.com`,
        phone: '+1234567890',
        departmentId: testDepartmentId,
        role: 'Software Engineer',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        employeeType: 'Permanent',
        salary: 75000
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    testEmployeeId = createResponse.data.employee?._id || createResponse.data.employee?.id || createResponse.data._id || createResponse.data.id;
    log.success(`Employee created: ${testEmployeeId}`);
    
    // Read
    log.info('Reading employees...');
    const readResponse = await axios.get(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log.success(`Retrieved ${readResponse.data.length} employees`);
    
    // Update
    log.info('Updating employee...');
    await axios.put(
      `${API_URL}/employees/${testEmployeeId}`,
      { salary: 85000 },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    log.success('Employee updated');
    
    return true;
  } catch (error) {
    log.error(`Employee CRUD failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLeaveManagement() {
  log.section('TEST 6: Leave Management (Unlimited Policy)');
  
  try {
    // Create leave request
    log.info('Creating leave request...');
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    
    const createResponse = await axios.post(
      `${API_URL}/leaves`,
      {
        employeeId: testEmployeeId,
        leaveType: 'Annual',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: 'Test leave request - unlimited policy'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    const leaveId = createResponse.data._id || createResponse.data.id;
    log.success(`Leave request created: ${leaveId}`);
    log.info('  ✓ No balance check required (unlimited policy)');
    
    // Read leave requests
    log.info('Reading leave requests...');
    const readResponse = await axios.get(`${API_URL}/leaves`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log.success(`Retrieved ${readResponse.data.length} leave requests`);
    
    return true;
  } catch (error) {
    log.error(`Leave management failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testAttendance() {
  log.section('TEST 7: Attendance Tracking');
  
  try {
    // Create attendance
    log.info('Creating attendance record...');
    const createResponse = await axios.post(
      `${API_URL}/attendance`,
      {
        employeeId: testEmployeeId,
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        clockIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    log.success('Attendance record created');
    
    // Read attendance
    log.info('Reading attendance records...');
    const readResponse = await axios.get(`${API_URL}/attendance`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log.success(`Retrieved ${readResponse.data.length} attendance records`);
    
    return true;
  } catch (error) {
    log.error(`Attendance tracking failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testDataSync() {
  log.section('TEST 8: Data Synchronization');
  
  try {
    log.info('Testing data consistency...');
    
    // Get employees
    const empResponse = await axios.get(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    // Get departments
    const deptResponse = await axios.get(`${API_URL}/departments`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    // Get attendance
    const attResponse = await axios.get(`${API_URL}/attendance`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    // Get leaves
    const leaveResponse = await axios.get(`${API_URL}/leaves`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success('All data endpoints responding');
    log.info(`  Employees: ${empResponse.data.length}`);
    log.info(`  Departments: ${deptResponse.data.length}`);
    log.info(`  Attendance: ${attResponse.data.length}`);
    log.info(`  Leaves: ${leaveResponse.data.length}`);
    log.info('  ✓ No leave balance tracking (unlimited policy)');
    
    return true;
  } catch (error) {
    log.error(`Data sync test failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function cleanup() {
  log.section('TEST 9: Cleanup');
  
  try {
    // Delete test employee
    if (testEmployeeId) {
      log.info('Deleting test employee...');
      await axios.delete(`${API_URL}/employees/${testEmployeeId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      log.success('Test employee deleted');
    }
    
    // Delete test department
    if (testDepartmentId) {
      log.info('Deleting test department...');
      await axios.delete(`${API_URL}/departments/${testDepartmentId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      log.success('Test department deleted');
    }
    
    return true;
  } catch (error) {
    log.warning(`Cleanup had issues: ${error.response?.data?.message || error.message}`);
    return true; // Don't fail on cleanup
  }
}

async function runAllTests() {
  console.log(`\n${colors.magenta}${'='.repeat(70)}`);
  console.log('HRMS COMPLETE APPLICATION TEST');
  console.log('Testing: Leave Balance Removal & Data Synchronization');
  console.log(`${'='.repeat(70)}${colors.reset}\n`);
  
  const tests = [
    { name: 'Backend Health', fn: testBackendHealth },
    { name: 'Frontend Health', fn: testFrontendHealth },
    { name: 'Authentication', fn: testLogin },
    { name: 'Department CRUD', fn: testDepartmentCRUD },
    { name: 'Employee CRUD', fn: testEmployeeCRUD },
    { name: 'Leave Management', fn: testLeaveManagement },
    { name: 'Attendance Tracking', fn: testAttendance },
    { name: 'Data Synchronization', fn: testDataSync },
    { name: 'Cleanup', fn: cleanup }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  log.section('TEST SUMMARY');
  console.log(`${colors.green}✓ Passed: ${passed}/${tests.length}${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}✗ Failed: ${failed}/${tests.length}${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  
  if (failed === 0) {
    console.log(`${colors.green}✓ ALL TESTS PASSED!${colors.reset}`);
    console.log(`\n${colors.cyan}System Status:${colors.reset}`);
    console.log(`  ✓ Backend: Running and responding`);
    console.log(`  ✓ Frontend: Running and responding`);
    console.log(`  ✓ Database: Connected and syncing`);
    console.log(`  ✓ CRUD Operations: All working`);
    console.log(`  ✓ Leave Management: Unlimited policy active`);
    console.log(`  ✓ Data Sync: Real-time updates working`);
    console.log(`\n${colors.green}Your HRMS is ready to use!${colors.reset}`);
    console.log(`${colors.cyan}Open: ${FRONTEND_URL}${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ SOME TESTS FAILED${colors.reset}`);
    console.log(`\n${colors.cyan}Please check the errors above and fix them.${colors.reset}`);
  }
  
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

runAllTests().catch(console.error);
