# ⚡ Quick Fix Checklist - Login Issue

## 🎯 Your URLs
- Frontend: https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
- Backend: https://success-15ke.onrender.com

---

## ✅ Do These 5 Things NOW

### 1️⃣ Render: Set Environment Variables (5 minutes)

Go to: https://dashboard.render.com/ → Your Service → Environment

Add these variables:

```
NODE_ENV = production
PORT = 5000
FRONTEND_URL = https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
MONGODB_URI = mongodb+srv://Naveen:Naveenroy@hrbackend.bmeyguz.mongodb.net/hrbackend?retryWrites=true&w=majority&appName=hrbackend
JWT_SECRET = (click "Generate" or leave blank for auto-generate)
JWT_EXPIRE = 30d
MFA_ISSUER = HR Management System
```

**✅ MongoDB URL is already configured above - just copy and paste!**

---

### 2️⃣ MongoDB Atlas: Allow Render to Connect (2 minutes)

Go to: https://cloud.mongodb.com/

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. IP Address: `0.0.0.0/0`
5. Click "Confirm"

---

### 3️⃣ Vercel: Set Environment Variable (2 minutes)

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add this variable:

```
Name: VITE_API_URL
Value: https://success-15ke.onrender.com/api
```

Apply to: ✅ Production ✅ Preview ✅ Development

Click "Save"

---

### 4️⃣ Redeploy Both Services (5 minutes)

**Render:**
1. Go to your service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment (5-10 minutes)

**Vercel:**
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment (2-3 minutes)

---

### 5️⃣ Test (1 minute)

**Test Backend:**
Open: https://success-15ke.onrender.com/api/health

Should see: `{"status":"ok","message":"HR Management API is running"}`

**Test Frontend:**
1. Open: https://hr-pkwyq9egs-naveens-projects-7e7c32cb.vercel.app
2. Login with:
   - Email: `admin@hrms.com`
   - Password: `admin123`
   - MFA Code: `123456`

---

## 🚨 If Login Still Fails

### Check 1: Do you have users in your database?

Run locally:
```bash
cd server
# Update server/.env with your MongoDB Atlas URI
node scripts/test-login.js
```

If no users found, you need to seed your database!

### Check 2: Is MongoDB connected?

Check Render logs:
1. Go to Render dashboard
2. Click your service
3. View "Logs" tab
4. Look for "MongoDB Connected" message

If you see "MongoDB connection failed":
- Verify MONGODB_URI is correct
- Verify MongoDB Network Access allows 0.0.0.0/0
- Verify database user has correct permissions

### Check 3: Is CORS working?

Check browser console (F12):
- If you see "CORS error", the backend needs to be redeployed
- Code has been updated to allow your Vercel URL

---

## 📝 Quick Commands

### Test Backend Health
```bash
curl https://success-15ke.onrender.com/api/health
```

### Test Login API
```bash
curl -X POST https://success-15ke.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hrms.com","password":"admin123"}'
```

---

## ✅ Success Indicators

- ✅ Backend health check returns OK
- ✅ Render logs show "MongoDB Connected"
- ✅ Render logs show "HR Management Backend Server Started"
- ✅ Frontend loads without errors
- ✅ Browser console shows no CORS errors
- ✅ Login works

---

## 🎯 Most Common Issue

**90% of the time, the issue is:**
1. ❌ MONGODB_URI not set in Render
2. ❌ MongoDB Network Access not allowing 0.0.0.0/0
3. ❌ No users in the database

**Fix these three things first!**

---

**Total Time: ~15 minutes**

**See DEPLOYMENT_INSTRUCTIONS.md for detailed step-by-step guide.**
