# 🧪 Test Your Deployment - Quick Guide

## Your URLs
- **Frontend**: https://hr-lvmigylnw-naveens-projects-7e7c32cb.vercel.app
- **Backend**: https://success-15ke.onrender.com

---

## ⚡ Quick Fix (Do This First!)

### 1. Set Environment Variables in Render

Go to: https://dashboard.render.com/ → success-15ke → Environment

**Copy and paste these:**
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hr-lvmigylnw-naveens-projects-7e7c32cb.vercel.app
MONGODB_URI=mongodb+srv://Naveen:Naveenroy@hrbackend.bmeyguz.mongodb.net/hrbackend?retryWrites=true&w=majority&appName=hrbackend
JWT_EXPIRE=30d
MFA_ISSUER=HR Management System
```

For JWT_SECRET: Click "Generate"

### 2. MongoDB Atlas Network Access

Go to: https://cloud.mongodb.com/ → Network Access

- Verify `0.0.0.0/0` is in the list
- If not, add it: "Add IP Address" → "Allow Access from Anywhere"

### 3. Vercel Environment Variable

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

```
VITE_API_URL=https://success-15ke.onrender.com/api
```

Apply to all environments, then redeploy.

### 4. Push Updated Code

```bash
git add .
git commit -m "Update for new Vercel URL"
git push origin main
```

---

## 🧪 Test Now

### Test 1: Backend Health
Open: https://success-15ke.onrender.com/api/health

Should see: `{"status":"ok","message":"HR Management API is running"}`

### Test 2: Login
1. Open: https://hr-lvmigylnw-naveens-projects-7e7c32cb.vercel.app
2. Login: `admin@hrms.com` / `admin123`
3. MFA Code: `123456`

---

## 📋 Login Credentials

| Email | Password | MFA Code |
|-------|----------|----------|
| admin@hrms.com | admin123 | 123456 |
| hr@hrms.com | admin123 | 123456 |
| manager@hrms.com | admin123 | 123456 |
| employee@hrms.com | admin123 | 123456 |

---

**See FINAL_DEPLOYMENT_STEPS.md for detailed troubleshooting!**
