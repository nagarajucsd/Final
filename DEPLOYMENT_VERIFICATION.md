# Deployment Verification & Troubleshooting

## Step 1: Verify Backend is Running

### Test Backend Health Check

Open this URL in your browser (replace with your actual backend URL):
```
https://YOUR-BACKEND-URL.onrender.com/api/health
```

**Expected Response**:
```json
{"status":"ok","message":"HR Management API is running"}
```

**If you get an error**:
- Backend is not running
- Go to Render Dashboard → Backend Service → Check Logs
- Look for startup errors

### Check Backend Logs

1. Go to Render Dashboard
2. Click on your backend service
3. Click **Logs** tab
4. Look for this output:
```
═══════════════════════════════════════════════════════
🚀 HR Management Backend Server Started
═══════════════════════════════════════════════════════
📍 Port: 5000
🌍 Environment: production
🔗 Frontend URL: https://hrapp.onrender.com
🗄️  Database: Connected
🔐 JWT Secret: Configured
═══════════════════════════════════════════════════════
```

**If you see**:
- `⚠️  NOT SET` for JWT Secret → Add JWT_SECRET environment variable
- `Not configured` for Database → Add MONGODB_URI environment variable
- MongoDB connection errors → Check MongoDB Atlas IP whitelist

## Step 2: Verify Frontend Configuration

### Check Browser Console

1. Open: `https://hrapp.onrender.com`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for this line:
```
🔍 Attempting login with: { email: '...', password: '***' }
```

5. Try to login
6. Check what error appears

### Common Console Errors:

**Error**: `Failed to fetch` or `ERR_CONNECTION_REFUSED`
```
Problem: Frontend can't reach backend
Solution: Check VITE_API_URL environment variable
```

**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`
```
Problem: Backend not allowing frontend domain
Solution: Check FRONTEND_URL in backend environment variables
```

**Error**: `401 Unauthorized`
```
Problem: Wrong credentials or users don't exist in database
Solution: Check database has users, or try default credentials
```

## Step 3: Verify Environment Variables

### Backend Environment Variables (Render Dashboard)

Go to: Backend Service → Environment

**Required Variables**:
```
✅ NODE_ENV=production
✅ PORT=5000
✅ FRONTEND_URL=https://hrapp.onrender.com
✅ MONGODB_URI=mongodb+srv://hr_admin:hrpassword123@cluster0.w5ypk0z.mongodb.net/hr-management?retryWrites=true&w=majority&appName=Cluster0
✅ JWT_SECRET=<YOUR_GENERATED_SECRET>
✅ JWT_EXPIRE=30d
✅ MFA_ISSUER=HR Management System
```

**To generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Environment Variables (Render Dashboard)

Go to: Frontend Service → Environment

**Required Variables**:
```
✅ VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```

**IMPORTANT**: Replace `YOUR-ACTUAL-BACKEND-URL` with your real backend URL from Render!

## Step 4: Verify MongoDB Atlas

### Check Network Access

1. Go to https://cloud.mongodb.com
2. Click **Network Access** (left sidebar)
3. You should see an entry: `0.0.0.0/0` (Allow from anywhere)

**If not**:
1. Click **Add IP Address**
2. Click **Allow Access from Anywhere**
3. Click **Confirm**

### Check Database User

1. Go to **Database Access** (left sidebar)
2. You should see user: `hr_admin`
3. Make sure it has **Read and write to any database** permission

## Step 5: Test Login Flow

### Default Credentials:
```
Admin:    admin@company.com / password
HR:       hr@company.com / password
Employee: n@gmail.com / password
```

### If Login Fails:

1. **Check browser console** (F12) for errors
2. **Check Network tab** (F12 → Network) for failed requests
3. **Check backend logs** on Render for errors
4. **Verify environment variables** are set correctly

## Common Solutions

### Solution 1: Update Frontend API URL

If frontend can't connect to backend:

1. Get your backend URL from Render (e.g., `https://hr-backend-xyz.onrender.com`)
2. Go to Frontend Service → Environment
3. Update: `VITE_API_URL=https://hr-backend-xyz.onrender.com/api`
4. Click **Manual Deploy** → **Clear build cache & deploy**

### Solution 2: Update Backend CORS

If you get CORS errors:

1. Get your frontend URL from Render (e.g., `https://hrapp-xyz.onrender.com`)
2. Go to Backend Service → Environment
3. Update: `FRONTEND_URL=https://hrapp-xyz.onrender.com`
4. Click **Manual Deploy** → **Deploy latest commit**

### Solution 3: Seed Database

If users don't exist:

1. Go to Backend Service → Shell
2. Run:
```bash
node utils/seed.js
```

Or manually create a user in MongoDB Atlas.

## Verification Checklist

After making changes:

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without console errors
- [ ] No CORS errors in browser console
- [ ] Backend logs show successful startup
- [ ] MongoDB Atlas allows connections
- [ ] Environment variables are set correctly
- [ ] Can login with default credentials
- [ ] Dashboard loads after login

## Need More Help?

Provide these details:
1. **Backend URL**: (from Render dashboard)
2. **Frontend URL**: (from Render dashboard)
3. **Browser Console Errors**: (screenshot or copy/paste)
4. **Backend Logs**: (from Render logs tab)
5. **Environment Variables**: (confirm they're set)

This will help identify the exact issue!
