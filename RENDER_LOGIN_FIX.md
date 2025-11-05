# Fix Login Issue on Render Deployment

## Common Issues & Solutions

### Issue 1: Frontend Can't Connect to Backend

**Symptoms**: Login button does nothing, or shows "Network Error"

**Check**:
1. Open browser console (F12) on your deployed site
2. Look for errors like:
   - `ERR_CONNECTION_REFUSED`
   - `CORS error`
   - `Failed to fetch`

**Solution**:

#### Step 1: Verify Backend URL in Frontend
Your frontend needs to know where your backend is.

1. Go to Render Dashboard → Your Frontend Service
2. Go to **Environment** tab
3. Check if `VITE_API_URL` is set correctly
4. It should be: `https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api`

**Example**: If your backend is at `https://hr-backend-abc123.onrender.com`, then:
```
VITE_API_URL=https://hr-backend-abc123.onrender.com/api
```

5. After updating, click **Save** and **Redeploy**

#### Step 2: Verify CORS in Backend
Your backend needs to allow requests from your frontend.

1. Go to Render Dashboard → Your Backend Service
2. Go to **Environment** tab
3. Check if `FRONTEND_URL` is set correctly
4. It should be: `https://hrapp.onrender.com` (your actual frontend URL)

5. After updating, click **Save** and **Redeploy**

### Issue 2: MongoDB Connection Failed

**Symptoms**: Backend logs show "MongoDB connection error"

**Solution**:

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Make sure you have an entry for `0.0.0.0/0` (Allow from anywhere)
4. If not, click **Add IP Address** → **Allow Access from Anywhere** → **Confirm**

### Issue 3: Environment Variables Not Set

**Symptoms**: Backend crashes or shows "undefined" errors

**Solution**:

#### Backend Environment Variables (Render Dashboard):
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hrapp.onrender.com
MONGODB_URI=mongodb+srv://hr_admin:hrpassword123@cluster0.w5ypk0z.mongodb.net/hr-management?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<GENERATE_A_SECURE_RANDOM_STRING>
JWT_EXPIRE=30d
MFA_ISSUER=HR Management System
```

To generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend Environment Variables (Render Dashboard):
```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

### Issue 4: Backend Not Running

**Symptoms**: Frontend shows "Failed to connect" or backend URL returns 404

**Check**:
1. Go to Render Dashboard → Your Backend Service
2. Check **Logs** tab
3. Look for errors

**Common Errors**:

**Error**: "Cannot find module"
**Solution**: Make sure `package.json` has all dependencies

**Error**: "Port already in use"
**Solution**: Render handles this automatically, just redeploy

**Error**: "MongoDB connection timeout"
**Solution**: Check MongoDB Atlas IP whitelist (see Issue 2)

### Issue 5: Credentials Don't Work

**Symptoms**: Login shows "Invalid credentials" even with correct password

**Solution**:

The default credentials are:
- **Admin**: admin@company.com / password
- **HR**: hr@company.com / password  
- **Employee**: n@gmail.com / password

If these don't work, the database might not have users. You need to seed the database:

1. Go to Render Dashboard → Your Backend Service
2. Go to **Shell** tab
3. Run:
```bash
cd server
node utils/seed.js
```

Or connect to MongoDB Atlas and check if users exist in the `users` collection.

## Step-by-Step Debugging

### Step 1: Check Backend Health

Visit: `https://YOUR-BACKEND-URL.onrender.com/api/health`

**Expected**: `{"status":"ok","message":"HR Management API is running"}`

**If you get 404 or error**:
- Backend is not running
- Check backend logs on Render
- Check environment variables

### Step 2: Check Frontend Console

1. Open your frontend: `https://hrapp.onrender.com`
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. Look for errors

**Common Errors**:

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
**Fix**: Update `FRONTEND_URL` in backend environment variables

**Error**: `Failed to fetch` or `ERR_CONNECTION_REFUSED`
**Fix**: Update `VITE_API_URL` in frontend environment variables

**Error**: `401 Unauthorized`
**Fix**: Check if users exist in database (see Issue 5)

### Step 3: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Try to login
3. Look for the login request (usually `/api/auth/login`)
4. Click on it to see details

**Check**:
- **Request URL**: Should point to your backend
- **Status Code**: 
  - 200 = Success
  - 401 = Wrong credentials
  - 404 = Backend not found
  - 500 = Server error
  - CORS error = CORS misconfiguration

### Step 4: Check Backend Logs

1. Go to Render Dashboard → Backend Service
2. Click **Logs** tab
3. Look for errors when you try to login

**Common Log Errors**:

**Error**: "MongooseError: Operation `users.findOne()` buffering timed out"
**Fix**: MongoDB Atlas IP whitelist issue (see Issue 2)

**Error**: "JWT secret not defined"
**Fix**: Add `JWT_SECRET` to environment variables

## Quick Fix Checklist

- [ ] Backend health check works: `https://YOUR-BACKEND-URL.onrender.com/api/health`
- [ ] Frontend environment variable `VITE_API_URL` is correct
- [ ] Backend environment variable `FRONTEND_URL` is correct
- [ ] Backend environment variable `MONGODB_URI` is correct
- [ ] Backend environment variable `JWT_SECRET` is set
- [ ] MongoDB Atlas allows IP `0.0.0.0/0`
- [ ] No CORS errors in browser console
- [ ] Backend logs show no errors
- [ ] Users exist in database

## Still Not Working?

### Get Your Actual URLs

1. **Backend URL**: Go to Render Dashboard → Backend Service → Copy the URL at the top
2. **Frontend URL**: Go to Render Dashboard → Frontend Service → Copy the URL at the top

### Update Configuration

1. **Update Frontend**:
   - Go to Frontend Service → Environment
   - Set: `VITE_API_URL=<YOUR_BACKEND_URL>/api`
   - Save and Redeploy

2. **Update Backend**:
   - Go to Backend Service → Environment
   - Set: `FRONTEND_URL=<YOUR_FRONTEND_URL>`
   - Save and Redeploy

3. **Wait 2-3 minutes** for both services to redeploy

4. **Clear browser cache** (Ctrl+Shift+Delete)

5. **Try login again**

## Contact Information

If you're still having issues, provide:
1. Your backend URL
2. Your frontend URL
3. Screenshot of browser console errors
4. Screenshot of backend logs from Render

---

**Last Updated**: November 5, 2025
