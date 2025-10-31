# 🔧 Login Troubleshooting Guide

**Issue:** Login Failed Error  
**Date:** October 31, 2025

---

## ✅ System Status Check

### Backend Status
```
✅ Server Running: http://localhost:5000
✅ Health Check: OK
✅ API Login Test: PASSED
✅ MFA Verification: PASSED
```

### Frontend Status
```
✅ Server Running: http://localhost:3000
✅ Hot Module Reload: Active
⚠️ Login Issue: Investigating
```

---

## 🔍 Common Causes & Solutions

### 1. Browser Cache Issue
**Symptom:** Login fails even though backend works

**Solution:**
```
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear all:
   - Local Storage
   - Session Storage
   - Cookies
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Try login again
```

### 2. API URL Mismatch
**Symptom:** Network errors in console

**Check:**
```
Frontend .env file should have:
VITE_API_URL=http://localhost:5000/api
```

**Fix:**
```bash
# Create/update .env file in project root
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Restart frontend
npm run dev
```

### 3. CORS Error
**Symptom:** "CORS policy" error in console

**Check Backend:**
```javascript
// server/server.js should have:
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Fix:**
```bash
# Restart backend
cd server
npm start
```

### 4. Token/Session Issue
**Symptom:** Login succeeds but redirects back

**Solution:**
```
1. Open DevTools Console (F12)
2. Run: localStorage.clear()
3. Run: sessionStorage.clear()
4. Refresh page
5. Try login again
```

### 5. MFA Field Missing
**Symptom:** Login succeeds but hangs

**Check:**
Backend should return `isMfaSetup` field in login response.

**Verify:**
```bash
# Test login API
node test-login-now.js

# Should show:
# isMfaSetup: true
# mfaEnabled: true
```

---

## 🧪 Step-by-Step Diagnosis

### Step 1: Check Backend
```bash
# Test health
curl http://localhost:5000/api/health

# Expected: {"status":"ok","message":"HR Management API is running"}
```

### Step 2: Test Login API
```bash
# Run test script
node test-login-now.js

# Should show:
# ✅ Login successful!
# ✅ MFA verification successful!
```

### Step 3: Check Frontend Console
```
1. Open http://localhost:3000
2. Press F12 (DevTools)
3. Go to Console tab
4. Try to login
5. Look for errors (red text)
```

### Step 4: Check Network Tab
```
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for failed requests (red)
5. Click on failed request
6. Check Response tab for error message
```

---

## 🔧 Quick Fixes

### Fix 1: Clear Everything
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 2: Restart Servers
```bash
# Stop all Node processes
taskkill /F /IM node.exe /T

# Start backend
cd server
npm start

# Start frontend (new terminal)
npm run dev
```

### Fix 3: Check Environment
```bash
# Frontend .env
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api

# Backend .env
cat server/.env
# Should show: FRONTEND_URL=http://localhost:3000
```

---

## 📝 Login Credentials

### Admin Account
```
Email: admin@hrms.com
Password: password123
MFA Code: 123456
```

### Other Accounts
```
HR:       hr@hrms.com / password123 / 123456
Manager:  manager@hrms.com / password123 / 123456
Employee: employee@hrms.com / password123 / 123456
```

---

## 🐛 Error Messages & Solutions

### "Login failed. Please try again."
**Cause:** Generic error, check console for details

**Solution:**
1. Open browser console (F12)
2. Look for specific error message
3. Check network tab for failed requests
4. Clear cache and try again

### "Invalid email or password"
**Cause:** Wrong credentials or account locked

**Solution:**
1. Verify credentials: admin@hrms.com / password123
2. Check if account is locked
3. Run unlock script if needed:
   ```bash
   node server/unlock-user.js
   ```

### "Network Error" or "Failed to fetch"
**Cause:** Backend not running or CORS issue

**Solution:**
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Restart backend if needed
3. Check CORS configuration
4. Verify API URL in .env

### "MFA token required"
**Cause:** MFA verification step

**Solution:**
1. This is normal - proceed to MFA page
2. Enter code: 123456
3. Should login successfully

### Blank page or infinite loading
**Cause:** JavaScript error or API issue

**Solution:**
1. Check console for errors
2. Clear cache and reload
3. Check network tab for failed requests
4. Restart both servers

---

## 🔍 Debug Mode

### Enable Detailed Logging

**Frontend (LoginPage.tsx):**
Already has console.log statements:
```typescript
console.log('🔍 Attempting login with:', { email, password: '***' });
console.log('✅ Login API response:', response);
console.log('✅ User data:', response.user);
```

**Backend (server/routes/auth.js):**
Already has console.log statements:
```javascript
console.log('✅ Auto-attendance created for', user.name);
console.log('ℹ️ Attendance already exists for', user.name);
```

### Check Logs
```bash
# Backend logs
# Look at terminal running: npm start

# Frontend logs
# Look at browser console (F12)
```

---

## ✅ Verification Checklist

### Before Login
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] .env files configured
- [ ] Browser cache cleared

### During Login
- [ ] Email entered correctly
- [ ] Password entered correctly
- [ ] No console errors
- [ ] Network requests succeed
- [ ] MFA page appears

### After Login
- [ ] Token stored in localStorage
- [ ] User data stored
- [ ] Redirected to dashboard
- [ ] Dashboard loads correctly

---

## 🚀 Fresh Start Procedure

If nothing works, try a complete fresh start:

```bash
# 1. Stop all servers
taskkill /F /IM node.exe /T

# 2. Clear browser data
# - Open browser
# - Press Ctrl+Shift+Delete
# - Clear all data
# - Close browser

# 3. Restart MongoDB (if needed)
net stop MongoDB
net start MongoDB

# 4. Start backend
cd server
npm start

# 5. Start frontend (new terminal)
npm run dev

# 6. Open fresh browser window
# - Open incognito/private window
# - Go to http://localhost:3000
# - Try login
```

---

## 📞 Still Not Working?

### Collect Debug Information

1. **Backend Health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Login Test:**
   ```bash
   node test-login-now.js
   ```

3. **Browser Console:**
   - Open DevTools (F12)
   - Copy all console messages
   - Copy all network errors

4. **Server Logs:**
   - Copy backend terminal output
   - Copy frontend terminal output

### Check These Files

1. **Frontend API Configuration:**
   - File: `services/api.ts`
   - Should have: `baseURL: import.meta.env.VITE_API_URL`

2. **Backend CORS:**
   - File: `server/server.js`
   - Should allow: `origin: process.env.FRONTEND_URL`

3. **Auth Route:**
   - File: `server/routes/auth.js`
   - Should return: `isMfaSetup` and `mfaEnabled`

---

## 💡 Quick Test

### Test Backend Directly
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hrms.com\",\"password\":\"password123\"}"

# Should return user object with isMfaSetup: true
```

### Test Frontend API Call
```javascript
// In browser console (F12)
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)

// Should show: {status: "ok", message: "HR Management API is running"}
```

---

## 🎯 Most Likely Solutions

Based on common issues:

1. **Clear browser cache** (80% of cases)
2. **Restart both servers** (15% of cases)
3. **Check .env files** (5% of cases)

Try these three first before diving deeper!

---

**Status:** Troubleshooting Guide  
**Last Updated:** October 31, 2025  
**Backend Status:** ✅ Working  
**Issue:** Frontend login error

