# 🚀 Complete Deployment Instructions

## Your Deployment URLs

- **Frontend**: https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
- **Backend**: https://success-15ke.onrender.com
- **Backend API**: https://success-15ke.onrender.com/api

---

## ⚠️ Current Issue: Login Failed

The login is failing because of **missing environment variables** and **database connection**. Let's fix this step by step.

---

## 🔧 Step 1: Configure Render Backend

### 1.1 Set Environment Variables in Render

Go to your Render dashboard: https://dashboard.render.com/

1. Click on your service: **success-15ke**
2. Go to **"Environment"** tab
3. Add/Update these environment variables:

```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
MONGODB_URI=mongodb+srv://Naveen:Naveenroy@hrbackend.bmeyguz.mongodb.net/hrbackend?retryWrites=true&w=majority&appName=hrbackend
JWT_SECRET=(let Render auto-generate or use a secure random string)
JWT_EXPIRE=30d
MFA_ISSUER=HR Management System
```

### 1.2 MongoDB Atlas Setup

**CRITICAL**: You need a MongoDB Atlas database!

1. Go to https://cloud.mongodb.com/
2. Create a free cluster (if you haven't)
3. Create a database user:
   - Username: `hr_admin` (or your choice)
   - Password: Create a strong password
4. **Network Access**: Add `0.0.0.0/0` to allow connections from anywhere
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

Your connection string:
```
mongodb+srv://Naveen:Naveenroy@hrbackend.bmeyguz.mongodb.net/hrbackend?retryWrites=true&w=majority&appName=hrbackend
```

6. **Update MONGODB_URI in Render** with this connection string (already configured in render.yaml)

### 1.3 Verify Render Deployment

1. After setting environment variables, Render will automatically redeploy
2. Wait for deployment to complete (5-10 minutes)
3. Check logs for any errors
4. Test health endpoint: https://success-15ke.onrender.com/api/health
   - Should return: `{"status":"ok","message":"HR Management API is running"}`

---

## 🎨 Step 2: Configure Vercel Frontend

### 2.1 Set Environment Variable in Vercel

Go to your Vercel dashboard: https://vercel.com/dashboard

1. Select your project
2. Go to **"Settings"** → **"Environment Variables"**
3. Add this variable:

```
Name: VITE_API_URL
Value: https://success-15ke.onrender.com/api
```

4. **Apply to**: Production, Preview, and Development (check all three)
5. Click **"Save"**

### 2.2 Redeploy Vercel

After adding the environment variable:

1. Go to **"Deployments"** tab
2. Click the **three dots** on the latest deployment
3. Select **"Redeploy"**
4. Wait for redeployment to complete (2-3 minutes)

---

## 🗄️ Step 3: Seed Database with Users

Your database needs users to login! Run this script locally:

### 3.1 Connect to Your MongoDB Atlas

Update your local `server/.env` file temporarily:

```bash
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/hr_management?retryWrites=true&w=majority
```

### 3.2 Run Seed Script

```bash
cd server
npm install
node scripts/test-login.js
```

This will show you if users exist in the database.

### 3.3 If No Users Exist, Create Them

You need to create users in your MongoDB Atlas database. You can either:

**Option A**: Import from your local MongoDB
```bash
# Export from local
mongodump --db hr_management_system --out ./backup

# Import to Atlas
mongorestore --uri "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/" --db hr_management ./backup/hr_management_system
```

**Option B**: Create users manually using MongoDB Compass or Atlas UI

**Option C**: Run your application locally connected to Atlas and create users through the UI

---

## ✅ Step 4: Verification Checklist

### 4.1 Backend Verification

Test these URLs in your browser:

1. **Health Check**: https://success-15ke.onrender.com/api/health
   - Should return: `{"status":"ok","message":"HR Management API is running"}`

2. **Check Render Logs**:
   - Go to Render dashboard
   - Click on your service
   - View "Logs" tab
   - Look for:
     - ✅ "MongoDB Connected"
     - ✅ "HR Management Backend Server Started"
     - ❌ Any error messages

### 4.2 Frontend Verification

1. Open: https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
2. Open browser console (F12)
3. Check for errors
4. Try to login with:
   - Email: `admin@hrms.com`
   - Password: `admin123`
   - MFA Code: `123456` (development bypass)

### 4.3 Common Issues

**Issue 1: "Network Error" or "Failed to fetch"**
- **Cause**: Frontend can't reach backend
- **Fix**: Verify `VITE_API_URL` is set in Vercel
- **Fix**: Check backend is running (health check)

**Issue 2: "Invalid credentials"**
- **Cause**: No users in database
- **Fix**: Seed database with users (Step 3)

**Issue 3: "CORS Error"**
- **Cause**: Frontend URL not in CORS whitelist
- **Fix**: Already fixed in server.js (your URL is added)
- **Fix**: Redeploy Render after code update

**Issue 4: "MongoDB connection failed"**
- **Cause**: Wrong connection string or network access
- **Fix**: Verify MONGODB_URI in Render
- **Fix**: Add 0.0.0.0/0 to MongoDB Network Access

---

## 📝 Step 5: Update Code and Redeploy

### 5.1 Commit Changes

```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### 5.2 Redeploy Both Services

**Render** (Backend):
- Automatically redeploys when you push to GitHub
- Or manually trigger redeploy in Render dashboard

**Vercel** (Frontend):
- Automatically redeploys when you push to GitHub
- Or manually trigger redeploy in Vercel dashboard

---

## 🔐 Step 6: Test Login

### 6.1 Default Credentials

If you seeded the database with default users:

| Role | Email | Password | MFA Code |
|------|-------|----------|----------|
| Admin | admin@hrms.com | admin123 | 123456 |
| HR | hr@hrms.com | admin123 | 123456 |
| Manager | manager@hrms.com | admin123 | 123456 |
| Employee | employee@hrms.com | admin123 | 123456 |

### 6.2 Login Steps

1. Go to: https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
2. Enter email: `admin@hrms.com`
3. Enter password: `admin123`
4. Click "Sign In"
5. Enter MFA code: `123456`
6. Click "Verify"
7. You should be logged in!

---

## 🐛 Troubleshooting

### Check Backend Logs

```bash
# In Render dashboard:
1. Click on your service
2. Go to "Logs" tab
3. Look for errors
```

### Check Frontend Console

```bash
# In browser:
1. Press F12
2. Go to "Console" tab
3. Look for errors
4. Go to "Network" tab
5. Check API calls
```

### Test API Directly

```bash
# Test health endpoint
curl https://success-15ke.onrender.com/api/health

# Test login endpoint
curl -X POST https://success-15ke.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hrms.com","password":"admin123"}'
```

---

## 📊 Environment Variables Summary

### Render (Backend)

```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
MONGODB_URI=mongodb+srv://Naveen:Naveenroy@hrbackend.bmeyguz.mongodb.net/hrbackend?retryWrites=true&w=majority&appName=hrbackend
JWT_SECRET=(auto-generated by Render)
JWT_EXPIRE=30d
MFA_ISSUER=HR Management System
```

### Vercel (Frontend)

```bash
VITE_API_URL=https://success-15ke.onrender.com/api
```

---

## ✅ Final Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB Network Access allows 0.0.0.0/0
- [ ] Database user created with read/write permissions
- [ ] MONGODB_URI set in Render
- [ ] FRONTEND_URL set in Render
- [ ] JWT_SECRET set in Render (auto-generated)
- [ ] VITE_API_URL set in Vercel
- [ ] Backend redeployed
- [ ] Frontend redeployed
- [ ] Health check works: https://success-15ke.onrender.com/api/health
- [ ] Frontend loads: https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
- [ ] Database has users
- [ ] Login works

---

## 🎉 Success!

Once all steps are complete:
1. Backend should be running and connected to MongoDB
2. Frontend should be able to reach backend
3. Login should work with default credentials
4. All features should be accessible

**If you're still having issues, check the Troubleshooting section or Render/Vercel logs for specific error messages.**

---

## 📞 Need Help?

1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB connection string is correct
5. Test health endpoint first before testing login

Good luck! 🚀
