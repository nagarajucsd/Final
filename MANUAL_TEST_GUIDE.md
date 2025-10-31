# 🧪 Manual Testing Guide - HRMS Application

## ✅ System is Running

**Backend:** http://localhost:5000 ✅
**Frontend:** http://localhost:3000 ✅
**Database:** MongoDB Connected ✅

---

## 🎯 Quick Test (5 Minutes)

### Step 1: Open the Application
```
Open your browser and go to: http://localhost:3000
```

### Step 2: Login
Try these accounts (one should work):
```
Account 1: admin@hrms.com / admin123
Account 2: hr@hrms.com / hr123
Account 3: manager@hrms.com / manager123
Account 4: employee@hrms.com / employee123
```

**If login fails:**
- Check backend logs for user emails
- Run: `cd server && node check-users.js`
- Use the emails shown in the output

### Step 3: Test Employee Management (2 min)
```
1. Click "Employees" in sidebar
2. Click "Add New Employee"
3. Fill in the form:
   - Employee ID: TEST001
   - Name: Test User
   - Email: testuser@company.com
   - Phone: +1234567890
   - Department: Select any
   - Role: Developer
   - Salary: 75000
4. Click "Save"
5. ✅ Employee should appear in the list immediately
6. Click "Edit" on the employee
7. Change salary to 85000
8. Click "Save"
9. ✅ Salary should update immediately
10. Try the Grid view toggle
11. ✅ Both views should work
```

### Step 4: Test Leave Management (1 min)
```
1. Click "My Leaves" in sidebar
2. ✅ Notice: No leave balance card (unlimited policy)
3. Click "Apply for Leave"
4. Fill in:
   - Leave Type: Annual
   - Start Date: Today
   - End Date: 3 days from today
   - Reason: Testing unlimited leave policy
5. Click "Submit Request"
6. ✅ Request appears in history immediately
7. ✅ No balance check or warning
```

### Step 5: Test Leave Approval (1 min)
```
1. Logout (if logged in as employee)
2. Login as Admin/HR/Manager
3. Click "Leave Requests" in sidebar
4. Find the test leave request
5. Click "Approve"
6. Confirm
7. ✅ Status changes to "Approved" immediately
```

### Step 6: Test Dashboard (1 min)
```
1. Click "Dashboard" in sidebar
2. ✅ Check Employee Stats card shows:
   - Present This Month
   - Absent This Month
   - On Leave This Month
   - Attendance Rate (NOT leave balance)
3. ✅ All numbers should be accurate
4. ✅ No leave balance information anywhere
```

---

## 🔍 Detailed Testing

### Employee CRUD Operations

#### Create Employee
```
1. Go to Employees page
2. Click "Add New Employee"
3. Fill all required fields
4. Submit
5. ✅ Check: Employee appears in list
6. ✅ Check: Success toast notification
7. ✅ Check: Credentials modal shows
```

#### Read Employees
```
1. Go to Employees page
2. ✅ Check: All employees load
3. Try filters:
   - Filter by department
   - Filter by status
   - Search by name
4. ✅ Check: Filters work correctly
5. Toggle between List and Grid view
6. ✅ Check: Both views display correctly
```

#### Update Employee
```
1. Click "Edit" on any employee
2. Change any field (e.g., salary, role)
3. Submit
4. ✅ Check: Changes appear immediately
5. ✅ Check: Success toast notification
6. Refresh page
7. ✅ Check: Changes persist
```

#### Delete Employee
```
1. Click "Delete" on test employee
2. Confirm deletion
3. ✅ Check: Employee removed from list
4. ✅ Check: Success toast notification
5. Refresh page
6. ✅ Check: Employee still deleted
```

### Department CRUD Operations

#### Create Department
```
1. Go to Departments page
2. Click "Create Department"
3. Enter name: "Test Department"
4. Select manager (optional)
5. Submit
6. ✅ Check: Department card appears
7. ✅ Check: Success toast notification
```

#### Update Department
```
1. Click "Edit" on any department
2. Change name
3. Submit
4. ✅ Check: Name updates immediately
5. ✅ Check: Success toast notification
```

#### Delete Department
```
1. Click "Delete" on test department
2. Confirm
3. ✅ Check: Department removed
4. ✅ Check: Success toast notification
```

### Leave Management (Unlimited Policy)

#### Submit Leave Request
```
1. Go to "My Leaves"
2. ✅ Check: No leave balance card visible
3. ✅ Check: Unlimited policy message shown
4. Click "Apply for Leave"
5. Select dates and type
6. Enter reason
7. Submit
8. ✅ Check: No balance validation
9. ✅ Check: Request appears in history
10. ✅ Check: Status is "Pending"
```

#### Approve/Reject Leave
```
1. Login as Admin/HR/Manager
2. Go to "Leave Requests"
3. Find pending request
4. Click "Approve" or "Reject"
5. Confirm
6. ✅ Check: Status updates immediately
7. ✅ Check: Success toast notification
8. ✅ Check: No balance updates (unlimited policy)
```

### Attendance Tracking

#### Clock In/Out
```
1. Login as Employee
2. ✅ Check: Auto clock-in on login
3. ✅ Check: Timer shows on dashboard
4. Go to "Attendance"
5. ✅ Check: Today's record shows
6. Click "Clock Out" (if available)
7. ✅ Check: Work hours calculated
```

#### View Attendance
```
1. Go to "Attendance" page
2. ✅ Check: Monthly calendar shows
3. ✅ Check: Present/Absent/Leave marked
4. Login as Admin
5. Go to "Attendance"
6. ✅ Check: All employees' attendance visible
7. Try date filter
8. ✅ Check: Filter works
```

### Dashboard

#### Employee Dashboard
```
1. Login as Employee
2. Go to Dashboard
3. ✅ Check: Welcome card shows
4. ✅ Check: Clock in/out button visible
5. ✅ Check: Weekly timer shows
6. ✅ Check: Attendance calendar shows
7. ✅ Check: Employee stats show:
   - Present days
   - Absent days
   - On leave days
   - Attendance rate (NOT leave balance)
```

#### Admin Dashboard
```
1. Login as Admin
2. Go to Dashboard
3. ✅ Check: Organization stats show:
   - Active employees
   - Departments
   - Present today %
   - Pending leaves
4. ✅ Check: Activity feed shows
5. ✅ Check: Department distribution chart shows
6. ✅ Check: All numbers are accurate
```

---

## 🔄 Data Synchronization Tests

### Test Real-Time Updates
```
1. Open two browser windows
2. Login to both (same or different accounts)
3. In Window 1: Create an employee
4. In Window 2: Wait 10 seconds
5. ✅ Check: New employee appears in Window 2
6. In Window 1: Update the employee
7. In Window 2: Wait 10 seconds
8. ✅ Check: Updates appear in Window 2
```

### Test Database Persistence
```
1. Create an employee
2. Close browser completely
3. Restart browser
4. Login again
5. ✅ Check: Employee still exists
6. Update the employee
7. Refresh page (F5)
8. ✅ Check: Updates persisted
```

---

## ✅ Verification Checklist

### Leave Balance Removal
- [ ] No leave balance card on Leave page
- [ ] No leave balance in Employee Stats
- [ ] No balance validation when applying leave
- [ ] Unlimited policy message visible
- [ ] Leave requests work without balance checks
- [ ] Dashboard shows attendance rate instead of leave balance

### Data Synchronization
- [ ] Create operations sync to database
- [ ] Read operations load from database
- [ ] Update operations sync to database
- [ ] Delete operations sync to database
- [ ] Changes appear immediately in UI
- [ ] Auto-refresh works (10 seconds)
- [ ] Multiple windows stay in sync

### UI/UX
- [ ] All pages load without errors
- [ ] All forms work correctly
- [ ] All buttons respond
- [ ] All modals open/close
- [ ] All toast notifications show
- [ ] All filters work
- [ ] All views (table/grid) work
- [ ] Mobile responsive works

### Error Handling
- [ ] Invalid inputs show errors
- [ ] Network errors show toast
- [ ] Loading states show
- [ ] Empty states show
- [ ] Confirmation dialogs work

---

## 🐛 Common Issues & Solutions

### Issue: Login Fails
**Solution:**
```bash
cd server
node check-users.js
# Use the emails shown in the output
```

### Issue: Data Not Updating
**Solution:**
1. Check browser console for errors (F12)
2. Check backend is running
3. Check MongoDB is running
4. Clear browser cache
5. Refresh page

### Issue: Frontend Not Loading
**Solution:**
```bash
# Stop and restart frontend
npm run dev
```

### Issue: Backend Not Responding
**Solution:**
```bash
cd server
npm start
```

---

## 📊 Expected Results

### After All Tests:
- ✅ All CRUD operations working
- ✅ All data syncing to database
- ✅ No leave balance tracking
- ✅ Unlimited leave policy active
- ✅ Real-time updates working
- ✅ No TypeScript errors
- ✅ No runtime errors
- ✅ Professional UI/UX

---

## 🎉 Success Criteria

Your system is working correctly if:

1. ✅ You can login successfully
2. ✅ You can create/read/update/delete employees
3. ✅ You can create/read/update/delete departments
4. ✅ You can submit leave requests without balance checks
5. ✅ You can approve/reject leave requests
6. ✅ You can track attendance
7. ✅ Dashboard shows correct data
8. ✅ All changes persist to database
9. ✅ No leave balance information anywhere
10. ✅ System feels fast and responsive

---

## 🚀 Next Steps

Once all tests pass:
1. ✅ System is ready for production
2. ✅ Can customize branding
3. ✅ Can deploy to server
4. ✅ Can train users

**Your HRMS is complete and ready to use! 🎊**
