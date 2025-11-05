# 📋 Render Deployment Checklist

Use this checklist to verify your deployment is configured correctly.

## Before You Start

- [ ] You have a Render account (https://render.com)
- [ ] You have a MongoDB Atlas account (https://cloud.mongodb.com)
- [ ] Your code is pushed to GitHub
- [ ] You have access to both frontend and backend services in Render

## Backend Service Checklist

### Service Configuration
- [ ] Service name: `hr-management-backend` (or similar)
- [ ] Environment: **Node**
- [ ] Region: **Oregon (US West)** or your preferred region
- [ ] Root Directory: **server**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Status: **Live** (green indicator)

### Environment Variables
Go to Backend Service → Environment tab and verify:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `FRONTEND_URL` = Your actual frontend URL (e.g., `https://hr-management-frontend.onrender.com`)
  - ⚠️ **No trailing slash**
  - ⚠️ **Must match exactly**
- [ ] `MONGODB_URI` = Your MongoDB connection string
  - Should start with `mongodb+srv://`
  - Should include database name
- [ ] `JWT_SECRET` = A secure random string (use Render's "Generate" button)
- [ ] `JWT_EXPIRE` = `30d`
- [ ] `MFA_ISSUER` = `HR Management System`

### Backend Health Check
- [ ] Visit: `https://YOUR-BACKEND-URL.onrender.com/api/health`
- [ ] You see: `{"status":"ok","message":"HR Management API is running"}`
- [ ] No errors in browser console

### Backend Logs
Go to Backend Service → Logs tab:
- [ ] No error messages
- [ ] You see: "HR Management Backend Server Started"
- [ ] You see: "MongoDB Connected Successfully"
- [ ] You see: "JWT Secret: Configured"

## Frontend Service Checklist

### Service Configuration
- [ ] Service name: `hr-management-frontend` (or similar)
- [ ] Environment: **Static Site**
- [ ] Region: **Oregon (US West)** or your preferred region
- [ ] Root Directory: **(empty/root)**
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Status: **Live** (green indicator)

### Environment Variables
Go to Frontend Service → Environment tab and verify:

- [ ] `VITE_API_URL` = Your backend URL + `/api`
  - Example: `https://hr-management-backend.onrender.com/api`
  - ⚠️ **MUST end with `/api`**
  - ⚠️ **No trailing slash after `/api`**

### Frontend Access
- [ ] Visit your frontend URL
- [ ] Page loads without errors
- [ ] Login form is visible
- [ ] No console errors (press F12 to check)

## MongoDB Atlas Checklist

### Network Access
Go to MongoDB Atlas → Network Access:
- [ ] You have an entry for `0.0.0.0/0` (Allow from anywhere)
- [ ] Status is **Active**

### Database Access
Go to MongoDB Atlas → Database Access:
- [ ] You have a database user (e.g., `hr_admin`)
- [ ] User has **Read and write to any database** permission

### Cluster Status
Go to MongoDB Atlas → Database:
- [ ] Cluster status is **Active** (not paused)
- [ ] You can see your database (e.g., `hr-management`)

## Login Test Checklist

### Test 1: Backend Connection
- [ ] Open browser console (F12)
- [ ] Go to Network tab
- [ ] Try to login
- [ ] You see a request to `/api/auth/login`
- [ ] Request URL points to your backend
- [ ] No CORS errors

### Test 2: Login with Admin Credentials
Try logging in with:
- Email: `admin@company.com`
- Password: `password`

Results:
- [ ] Login succeeds OR
- [ ] You see a specific error message (not "Network Error")

### Test 3: Check Response
In browser console → Network tab → Click on login request:
- [ ] Status code is 200 (success) or 401 (wrong credentials)
- [ ] NOT 404 (backend not found)
- [ ] NOT CORS error
- [ ] Response contains user data or error message

## Common Issues & Quick Fixes

### ❌ "Network Error" or "Failed to fetch"
**Problem**: Frontend can't reach backend
**Fix**: 
1. Check `VITE_API_URL` ends with `/api`
2. Verify backend is running (health check)
3. Check backend URL is correct

### ❌ CORS Error in Console
**Problem**: Backend blocking frontend requests
**Fix**:
1. Check `FRONTEND_URL` in backend matches your actual frontend URL
2. No trailing slash in `FRONTEND_URL`
3. Redeploy backend after changes

### ❌ "Invalid email or password"
**Problem**: Credentials don't match or no users in database
**Fix**:
1. Try default credentials: `admin@company.com` / `password`
2. Run seed script in backend Shell: `node utils/seed.js`
3. Check MongoDB has users collection with data

### ❌ Backend Health Check Returns 404
**Problem**: Backend not running or wrong URL
**Fix**:
1. Check backend service status is "Live"
2. Check backend logs for errors
3. Verify backend URL is correct

### ❌ "MongooseError: Operation buffering timed out"
**Problem**: Can't connect to MongoDB
**Fix**:
1. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
2. Verify `MONGODB_URI` is correct
3. Check MongoDB cluster is not paused

## Final Verification

### All Systems Go ✅
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] No CORS errors in browser console
- [ ] No errors in backend logs
- [ ] MongoDB connection successful
- [ ] Can login with default credentials
- [ ] After login, you see the dashboard

### URLs to Save
Write down your URLs for reference:

**Backend URL**: `_________________________________`

**Backend Health**: `_________________________________/api/health`

**Frontend URL**: `_________________________________`

**MongoDB URI**: `mongodb+srv://...` (keep this secure!)

## Next Steps After Successful Deployment

1. **Change Default Passwords**: Login and change passwords for all default users
2. **Add Real Data**: Add your actual employees and departments
3. **Configure Email**: Set up email service for password resets (optional)
4. **Custom Domain**: Add a custom domain in Render settings (optional)
5. **Monitoring**: Set up monitoring and alerts in Render dashboard

## Need Help?

If any checkbox is unchecked or you encounter errors:

1. **Check Logs**: Backend Service → Logs tab
2. **Check Console**: Browser → F12 → Console tab
3. **Use Test Tool**: Open `test-connection.html` in browser
4. **Read Guides**: 
   - `QUICK_FIX_GUIDE.md` - Common issues and solutions
   - `RENDER_DEPLOYMENT_STEPS.md` - Full deployment guide
   - `RENDER_LOGIN_FIX.md` - Login-specific troubleshooting

---

**Last Updated**: November 5, 2025

**Pro Tip**: Print this checklist and check off items as you verify them!
