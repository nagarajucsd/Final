# Render Deployment - Step-by-Step Guide

## 🚨 CRITICAL: Follow These Steps Exactly

### Step 1: Deploy Backend First

1. **Go to Render Dashboard** (https://dashboard.render.com)
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure Backend Service:**
   - **Name**: `hr-management-backend` (or your preferred name)
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://hr_admin:hrpassword123@cluster0.w5ypk0z.mongodb.net/hr-management?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<CLICK_GENERATE_TO_AUTO-CREATE>
JWT_EXPIRE=30d
MFA_ISSUER=HR Management System
FRONTEND_URL=https://hr-management-frontend.onrender.com
```

**IMPORTANT**: 
- For `JWT_SECRET`, click the "Generate" button in Render
- For `FRONTEND_URL`, use your actual frontend URL (you'll get this in Step 2)

6. **Click "Create Web Service"**
7. **Wait for deployment** (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://hr-management-backend.onrender.com`)

### Step 2: Verify Backend is Running

1. **Open your backend URL in browser**: `https://YOUR-BACKEND-URL.onrender.com/api/health`
2. **You should see**: `{"status":"ok","message":"HR Management API is running"}`
3. **If you see an error**, check the Logs tab in Render dashboard

### Step 3: Deploy Frontend

1. **Go back to Render Dashboard**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository**
4. **Configure Frontend Service:**
   - **Name**: `hr-management-frontend` (or your preferred name)
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Add Environment Variable**:

```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

**IMPORTANT**: Replace `YOUR-BACKEND-URL` with the actual URL from Step 1

6. **Click "Create Static Site"**
7. **Wait for deployment** (5-10 minutes)
8. **Copy your frontend URL** (e.g., `https://hr-management-frontend.onrender.com`)

### Step 4: Update Backend with Frontend URL

1. **Go back to your Backend Service** in Render dashboard
2. **Click "Environment" tab**
3. **Update `FRONTEND_URL`** to your actual frontend URL from Step 3
4. **Click "Save Changes"**
5. **Backend will automatically redeploy** (wait 2-3 minutes)

### Step 5: Configure MongoDB Atlas

1. **Go to MongoDB Atlas** (https://cloud.mongodb.com)
2. **Click "Network Access"** (left sidebar)
3. **Click "Add IP Address"**
4. **Select "Allow Access from Anywhere"** (0.0.0.0/0)
5. **Click "Confirm"**

### Step 6: Test Your Application

1. **Open your frontend URL** in browser
2. **Try logging in with default credentials:**
   - Email: `admin@company.com`
   - Password: `password`

3. **If login fails**, open browser console (F12) and check for errors

## 🔧 Troubleshooting

### Issue: "Network Error" or "Cannot connect to server"

**Solution:**
1. Check if backend is running: Visit `https://YOUR-BACKEND-URL.onrender.com/api/health`
2. Check browser console for CORS errors
3. Verify `VITE_API_URL` in frontend environment variables includes `/api` at the end
4. Verify `FRONTEND_URL` in backend environment variables matches your actual frontend URL

### Issue: "Invalid email or password"

**Solution:**
1. The database might not have users. Run the seed script:
   - Go to Backend Service → Shell tab in Render
   - Run: `node utils/seed.js`

2. Or use these default credentials:
   - Admin: `admin@company.com` / `password`
   - HR: `hr@company.com` / `password`
   - Employee: `n@gmail.com` / `password`

### Issue: CORS Error in Browser Console

**Solution:**
1. Go to Backend Service → Environment
2. Make sure `FRONTEND_URL` exactly matches your frontend URL (no trailing slash)
3. Save and wait for redeploy

### Issue: Backend Logs Show "MongoDB Connection Error"

**Solution:**
1. Check MongoDB Atlas Network Access (Step 5)
2. Verify `MONGODB_URI` is correct in backend environment variables
3. Make sure MongoDB cluster is running (not paused)

### Issue: "JWT Secret not defined"

**Solution:**
1. Go to Backend Service → Environment
2. Add `JWT_SECRET` variable
3. Click "Generate" button to create a secure random string
4. Save and wait for redeploy

## 📋 Quick Verification Checklist

Before testing, verify:

- [ ] Backend health check works: `https://YOUR-BACKEND-URL.onrender.com/api/health`
- [ ] Frontend loads: `https://YOUR-FRONTEND-URL.onrender.com`
- [ ] Backend environment variable `FRONTEND_URL` matches your actual frontend URL
- [ ] Frontend environment variable `VITE_API_URL` ends with `/api`
- [ ] MongoDB Atlas allows IP `0.0.0.0/0`
- [ ] Backend logs show "HR Management Backend Server Started"
- [ ] No errors in backend logs
- [ ] Browser console shows no CORS errors

## 🎯 Expected URLs

After deployment, you should have:

- **Backend**: `https://hr-management-backend.onrender.com`
- **Backend Health**: `https://hr-management-backend.onrender.com/api/health`
- **Frontend**: `https://hr-management-frontend.onrender.com`

## 🔐 Default Login Credentials

After successful deployment, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | password |
| HR Manager | hr@company.com | password |
| Employee | n@gmail.com | password |

## ⚠️ Important Notes

1. **Free Tier Limitations**: Render free tier services spin down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

2. **Environment Variables**: Changes to environment variables trigger automatic redeployment.

3. **Build Time**: Initial deployment takes 5-10 minutes. Subsequent deployments are faster.

4. **HTTPS Only**: Render provides HTTPS by default. Don't use HTTP URLs.

5. **Custom Domain**: You can add a custom domain in Render dashboard under "Settings" → "Custom Domain".

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check Backend Logs**: Render Dashboard → Backend Service → Logs
2. **Check Browser Console**: Press F12 on your frontend
3. **Check Network Tab**: F12 → Network tab → Try login → Check request details

**Provide this information for support:**
- Your backend URL
- Your frontend URL
- Screenshot of browser console errors
- Screenshot of backend logs
- Screenshot of environment variables (hide sensitive values)

---

**Last Updated**: November 5, 2025
