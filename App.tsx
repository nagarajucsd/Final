
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import LoginPage from './components/LoginPage';
// FIX: Corrected imports from the now-fixed types.ts file.
import { User, UserRole, AttendanceRecord, AttendanceStatus, LeaveRequest, Employee, Department, PayrollRecord, LeaveBalance, LeaveStatus, LeaveType, Notification, Task } from './types';
import { ToastProvider, useToast } from './hooks/useToast';
import { mockAttendance, mockLeaveRequests, mockUserWeeklyProgress, mockEmployees, mockDepartments, mockPayroll, initialLeaveBalances, mockUsers, mockNotifications } from './data/mockData';

// Page Components
import DashboardPage from './components/pages/DashboardPage';
import EmployeesPage from './components/pages/EmployeesPage';
import DepartmentsPage from './components/pages/DepartmentsPage';
import AttendancePage from './components/pages/AttendancePage';
import LeavePage from './components/pages/LeavePage';
import LeaveManagementPage from './components/pages/LeaveManagementPage';
import PayrollPage from './components/pages/PayrollPage';
import ReportsPage from './components/pages/ReportsPage';
import ProfilePage from './components/pages/ProfilePage';
import TasksPage from './components/pages/TasksPage';
import MFASetupPage from './components/mfa/MFASetupPage';
import MFAVerificationPage from './components/mfa/MFAVerificationPage';
import MfaRecoveryPage from './components/mfa/MfaRecoveryPage';
import EmailVerificationPage from './components/mfa/EmailVerificationPage';

type AuthState = 'loggedOut' | 'needsMfaSetup' | 'needsMfaVerification' | 'mfaRecovery' | 'emailVerification' | 'authenticated';

const FORTY_HOURS_MS = 40 * 60 * 60 * 1000;

// Helper to get a consistent weekly ID using Monday as the start of the week.
const getWeekIdentifier = (d: Date): string => {
    const date = new Date(d);
    const day = date.getDay(); // Sunday - 0, Monday - 1, etc.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday to go to previous Monday
    date.setDate(diff);
    return date.toISOString().split('T')[0];
};

const formatMillisecondsToHHMMSS = (ms: number) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<string>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>('loggedOut');
  
  // Centralized State - Keep users as mock for login, but departments will load from API
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayroll);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(initialLeaveBalances);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [todayAttendanceRecord, setTodayAttendanceRecord] = useState<AttendanceRecord | null>(null);
  
  // New state for weekly timer
  const [weeklyAccumulatedMs, setWeeklyAccumulatedMs] = useState(0);
  const [isWeeklyTimerActive, setIsWeeklyTimerActive] = useState(true);

  const { addToast } = useToast();

  // Load data from API when authenticated
  useEffect(() => {
    const loadDataFromAPI = async () => {
      if (authState !== 'authenticated') return;

      try {
        console.log('🔄 Loading data from API...');
        const { employeeService } = await import('./services/employeeService');
        const { departmentService } = await import('./services/departmentService');
        const { leaveService } = await import('./services/leaveService');
        const { attendanceService } = await import('./services/attendanceService');
        const { taskService } = await import('./services/taskService');

        // Load all data in parallel
        const [employeesData, departmentsData, leavesData, attendanceData, tasksData] = await Promise.all([
          employeeService.getAllEmployees().catch(() => employees),
          departmentService.getAllDepartments().catch(() => departments),
          leaveService.getAllLeaveRequests().catch(() => leaveRequests),
          attendanceService.getAllAttendance().catch(() => attendanceRecords),
          taskService.getAllTasks().catch(() => [])
        ]);

        console.log('✅ Data loaded:', {
          employees: employeesData.length,
          departments: departmentsData.length,
          leaves: leavesData.length,
          attendance: attendanceData.length,
          tasks: tasksData.length
        });

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setLeaveRequests(leavesData);
        setAttendanceRecords(attendanceData);
        setTasks(tasksData);
      } catch (error) {
        console.error('❌ Failed to load data from API:', error);
      }
    };

    loadDataFromAPI();
  }, [authState]);

  // Auto-refresh data every 5 seconds when authenticated
  useEffect(() => {
    if (authState !== 'authenticated') return;

    const refreshInterval = setInterval(async () => {
      try {
        console.log('🔄 Auto-refreshing data...');
        const { employeeService } = await import('./services/employeeService');
        const { departmentService } = await import('./services/departmentService');
        const { leaveService } = await import('./services/leaveService');
        const { attendanceService } = await import('./services/attendanceService');
        const { taskService } = await import('./services/taskService');

        const [employeesData, departmentsData, leavesData, attendanceData, tasksData] = await Promise.all([
          employeeService.getAllEmployees().catch(() => employees),
          departmentService.getAllDepartments().catch(() => departments),
          leaveService.getAllLeaveRequests().catch(() => leaveRequests),
          attendanceService.getAllAttendance().catch(() => attendanceRecords),
          taskService.getAllTasks().catch(() => tasks)
        ]);

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setLeaveRequests(leavesData);
        setAttendanceRecords(attendanceData);
        setTasks(tasksData);
        console.log('✅ Auto-refresh complete:', {
          employees: employeesData.length,
          departments: departmentsData.length,
          leaves: leavesData.length,
          attendance: attendanceData.length,
          tasks: tasksData.length
        });
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
      }
    }, 5000); // Refresh every 5 seconds for real-time updates

    return () => clearInterval(refreshInterval);
  }, [authState]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const handleApplyLeave = useCallback(async (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'days' | 'employeeId' | 'employeeName'>) => {
    if (!currentUser) return;

    try {
      const startDate = new Date(newRequest.startDate);
      const endDate = new Date(newRequest.endDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24) + 1;

      // Create leave request via API
      const { leaveService } = await import('./services/leaveService');
      const createdRequest = await leaveService.createLeaveRequest({
        ...newRequest,
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        days: dayDiff,
      });

      // Update local state
      setLeaveRequests(prev => [createdRequest, ...prev]);

      setLeaveBalances(prev => prev.map(empBalance => {
          if (empBalance.employeeId === currentUser.id) {
              const newBalances = empBalance.balances.map(balance => {
                  if (balance.type === newRequest.leaveType) {
                      return { ...balance, pending: balance.pending + dayDiff };
                  }
                  return balance;
              });
              return { ...empBalance, balances: newBalances };
          }
          return empBalance;
      }));

      addToast({ type: 'success', message: 'Leave request submitted successfully!' });
      addNotification({ title: 'New Leave Request', message: `${currentUser.name} requested ${dayDiff} day(s) of ${newRequest.leaveType} leave.`, link: 'Leave Requests' });
    } catch (error: any) {
      console.error('❌ Failed to submit leave request:', error);
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to submit leave request' });
    }
  }, [currentUser, addToast, addNotification]);

  const handleLeaveAction = useCallback(async (requestId: string, newStatus: LeaveStatus.Approved | LeaveStatus.Rejected, employeeId: string, leaveType: LeaveType, days: number) => {
    try {
      // Update leave request status via API
      const { leaveService } = await import('./services/leaveService');
      const updatedRequest = await leaveService.updateLeaveRequestStatus(requestId, newStatus);

      // Update local state
      setLeaveRequests(prev => prev.map(req => req.id === requestId ? updatedRequest : req));

      setLeaveBalances(prev => prev.map(empBalance => {
          if (empBalance.employeeId === employeeId) {
              const newBalances = empBalance.balances.map(balance => {
                  if (balance.type === leaveType) {
                      const updatedBalance = { ...balance, pending: balance.pending - days };
                      if (newStatus === LeaveStatus.Approved) {
                          updatedBalance.used += days;
                      }
                      return updatedBalance;
                  }
                  return balance;
              });
              return { ...empBalance, balances: newBalances };
          }
          return empBalance;
      }));
      
      const employee = employees.find(e => e.id === employeeId);
      if (employee) {
          addNotification({ title: 'Leave Request Update', message: `Leave request for ${employee.name} has been ${newStatus}.`, link: 'My Leaves' });
      }
      addToast({ type: 'success', message: `Leave request has been ${newStatus.toLowerCase()}.` });
    } catch (error: any) {
      console.error('❌ Failed to update leave request:', error);
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to update leave request' });
    }
  }, [addToast, addNotification, employees]);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    if (user.isMfaSetup) {
      setAuthState('needsMfaVerification');
    } else {
      setAuthState('needsMfaSetup');
    }
  }, []);

  const handleMfaComplete = useCallback((isSetup: boolean) => {
    if (!currentUser) return;

    let userToAuthenticate = currentUser;

    // If this was the initial setup, persist the `isMfaSetup` flag.
    if (isSetup) {
      const updatedUser = { ...currentUser, isMfaSetup: true };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      userToAuthenticate = updatedUser; // Use the updated user for the session logic
    }

    // --- Common logic for post-MFA authentication ---

    setAuthState('authenticated');
    setActivePage('Dashboard');

    // --- Initialize Weekly Timer (Load from backend) ---
    const loadWeeklyProgress = async () => {
      try {
        const { attendanceService } = await import('./services/attendanceService');
        const weeklyData = await attendanceService.getWeeklyHours(userToAuthenticate.id);
        
        // Convert minutes to milliseconds
        const accumulatedMs = weeklyData.totalMinutes * 60 * 1000;
        setWeeklyAccumulatedMs(accumulatedMs);

        // Check if the user has already completed their 40 hours for the week
        if (accumulatedMs >= FORTY_HOURS_MS) {
          setIsWeeklyTimerActive(false);
        } else {
          setIsWeeklyTimerActive(true);
        }
      } catch (error) {
        console.error('Failed to load weekly progress:', error);
        setWeeklyAccumulatedMs(0);
        setIsWeeklyTimerActive(true);
      }
    };

    loadWeeklyProgress();

    // --- Check Today's Attendance (No Auto Clock-In) ---
    const todayStr = new Date().toISOString().split('T')[0];
    const userRecordForToday = attendanceRecords.find(rec => rec.employeeId === userToAuthenticate.id && rec.date === todayStr);
    
    if (userRecordForToday) {
      setTodayAttendanceRecord(userRecordForToday);
    } else {
      setTodayAttendanceRecord(null);
    }
  }, [currentUser, attendanceRecords, setUsers]);


  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setTodayAttendanceRecord(null);
    setAuthState('loggedOut');
  }, []);

  const handleClockIn = useCallback(async () => {
    if (!currentUser) return;

    try {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const clockInTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      // Call backend API to create attendance with timestamp
      const api = (await import('./services/api')).default;
      const response = await api.post('/attendance', {
        employeeId: currentUser.id,
        date: todayStr,
        status: 'Present',
        clockIn: clockInTimeStr
      });

      const newRecord = response.data;
      
      // Normalize the response
      if (newRecord._id && !newRecord.id) {
        newRecord.id = newRecord._id.toString();
      }
      if (newRecord.employeeId && typeof newRecord.employeeId === 'object') {
        newRecord.employeeId = newRecord.employeeId._id || newRecord.employeeId.id || currentUser.id;
      }

      setTodayAttendanceRecord(newRecord);
      setAttendanceRecords(prev => [...prev, newRecord]);
      
      addToast({ type: 'success', message: 'Clocked in successfully!' });
    } catch (error: any) {
      console.error('❌ Clock in error:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        addToast({ type: 'error', message: 'You have already clocked in today' });
      } else {
        addToast({ type: 'error', message: 'Failed to clock in. Please try again.' });
      }
    }
  }, [currentUser, addToast]);

  const handleClockOut = useCallback(async () => {
    if (currentUser && todayAttendanceRecord && todayAttendanceRecord.clockIn && !todayAttendanceRecord.clockOut) {
        try {
            const now = new Date();
            const clockOutTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            // Calculate work duration from timestamp if available, otherwise from clock-in string
            let sessionDurationMs = 0;
            if (todayAttendanceRecord.clockInTimestamp) {
                const clockInTime = new Date(todayAttendanceRecord.clockInTimestamp).getTime();
                sessionDurationMs = now.getTime() - clockInTime;
            } else {
                // Fallback to parsing clock-in string
                const [time, modifier] = todayAttendanceRecord.clockIn.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (modifier === 'PM' && hours < 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;
                
                const [year, month, day] = todayAttendanceRecord.date.split('-').map(Number);
                const clockInDate = new Date(year, month - 1, day, hours, minutes);
                sessionDurationMs = now.getTime() - clockInDate.getTime();
            }
            
            const workMinutes = Math.floor(sessionDurationMs / 60000);
            const sessionWorkHoursStr = formatMillisecondsToHHMMSS(sessionDurationMs);
            
            // Call backend API to clock out
            const api = (await import('./services/api')).default;
            await api.post('/attendance/clock-out', {
                employeeId: currentUser.id,
                clockOut: clockOutTimeStr,
                workHours: sessionWorkHoursStr,
                workMinutes
            });

            // Reload weekly hours from backend
            const { attendanceService } = await import('./services/attendanceService');
            const weeklyData = await attendanceService.getWeeklyHours(currentUser.id);
            const newAccumulatedMs = weeklyData.totalMinutes * 60 * 1000;
            
            const updatedRecord = {
                ...todayAttendanceRecord,
                clockOut: clockOutTimeStr,
                workHours: sessionWorkHoursStr,
                workMinutes
            };

            setTodayAttendanceRecord(updatedRecord);
            setAttendanceRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
            setWeeklyAccumulatedMs(newAccumulatedMs);

            if (newAccumulatedMs >= FORTY_HOURS_MS) {
                setIsWeeklyTimerActive(false);
                addToast({ type: 'success', message: 'You have completed 40 hours for the week!' });
            }
            addToast({ type: 'success', message: 'You have successfully clocked out.' });
        } catch (error) {
            console.error('❌ Clock out error:', error);
            addToast({ type: 'error', message: 'Failed to clock out. Please try again.' });
        }
    }
  }, [currentUser, todayAttendanceRecord, addToast, weeklyAccumulatedMs, isWeeklyTimerActive]);
  
  const handleAddNewUser = useCallback((newEmployee: Employee) => {
    const newUser: User = {
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: UserRole.Employee, // New employees are always 'Employee' role
        avatarUrl: newEmployee.avatarUrl,
        isMfaSetup: false,
        mfaSecret: `SECRET_${Date.now()}`.split('').map(c => c.charCodeAt(0).toString(16)).join('').toUpperCase(), // Generate a mock secret
        password: 'password'
    };
    setUsers(prev => [...prev, newUser]);
  }, []);
  
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const renderContent = () => {
    if (!currentUser || authState !== 'authenticated') return null;

    const userLeaveBalance = leaveBalances.find(b => b.employeeId === currentUser.id)?.balances || [];

    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage user={currentUser} employees={employees} departments={departments} attendanceRecords={attendanceRecords} leaveRequests={leaveRequests} todayAttendanceRecord={todayAttendanceRecord} onClockIn={handleClockIn} onClockOut={handleClockOut} weeklyAccumulatedMs={weeklyAccumulatedMs} isWeeklyTimerActive={isWeeklyTimerActive} leaveBalances={userLeaveBalance} />;
      case 'Employees':
        return <EmployeesPage employees={employees} setEmployees={setEmployees} departments={departments} setLeaveBalances={setLeaveBalances} onAddNewUser={handleAddNewUser} />;
      case 'Departments':
        return <DepartmentsPage departments={departments} setDepartments={setDepartments} employees={employees} />;
      case 'Attendance':
        return <AttendancePage user={currentUser} records={attendanceRecords} setRecords={setAttendanceRecords} employees={employees} departments={departments} />;
      case 'My Leaves':
        return <LeavePage user={currentUser} leaveRequests={leaveRequests} onApplyLeave={handleApplyLeave} leaveBalances={userLeaveBalance} />;
      case 'Leave Requests':
        return <LeaveManagementPage leaveRequests={leaveRequests} onLeaveAction={handleLeaveAction} />;
      case 'Payroll':
        return <PayrollPage user={currentUser} payrollRecords={payrollRecords} setPayrollRecords={setPayrollRecords} employees={employees} departments={departments} attendanceRecords={attendanceRecords} />;
      case 'Reports':
        return <ReportsPage employees={employees} departments={departments} attendanceRecords={attendanceRecords} leaveRequests={leaveRequests} payrollRecords={payrollRecords} />;
      case 'Tasks':
        return <TasksPage user={currentUser} tasks={tasks} setTasks={setTasks} employees={employees} departments={departments} />;
      case 'Profile':
        return <ProfilePage user={currentUser} onUpdateUser={(updatedUser) => setCurrentUser(u => ({...u, ...updatedUser} as User))} />;
      default:
        return <DashboardPage user={currentUser} employees={employees} departments={departments} attendanceRecords={attendanceRecords} leaveRequests={leaveRequests} todayAttendanceRecord={todayAttendanceRecord} onClockIn={handleClockIn} onClockOut={handleClockOut} weeklyAccumulatedMs={weeklyAccumulatedMs} isWeeklyTimerActive={isWeeklyTimerActive} leaveBalances={userLeaveBalance} />;
    }
  };

  if (authState === 'loggedOut') {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }
  if (authState === 'needsMfaSetup' && currentUser) {
    return <MFASetupPage user={currentUser} onComplete={() => handleMfaComplete(true)} />;
  }
  if (authState === 'needsMfaVerification' && currentUser) {
    return (
      <MFAVerificationPage 
        user={currentUser} 
        onComplete={() => handleMfaComplete(false)}
        onMfaRecovery={() => setAuthState('mfaRecovery')}
        onEmailVerification={() => setAuthState('emailVerification')}
      />
    );
  }
  if (authState === 'mfaRecovery') {
    return <MfaRecoveryPage onBack={() => setAuthState('loggedOut')} />;
  }
  if (authState === 'emailVerification' && currentUser) {
    return (
      <EmailVerificationPage 
        userEmail={currentUser.email}
        onComplete={() => handleMfaComplete(false)}
        onBack={() => setAuthState('needsMfaVerification')}
      />
    );
  }

  return (
      <div className="bg-background text-foreground font-sans flex h-screen overflow-hidden">
        <Sidebar 
          currentUserRole={currentUser!.role} 
          activePage={activePage} 
          setActivePage={setActivePage}
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar 
            user={currentUser!}
            onLogout={handleLogout}
            onToggleSidebar={toggleSidebar}
            setActivePage={setActivePage}
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <main className="flex-1 overflow-y-auto p-6 lg:p-12">
            {renderContent()}
          </main>
        </div>
      </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;
