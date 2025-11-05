# ✅ Configuration Checklist for New Company

Use this checklist when deploying the HR Management System for your company.

---

## 📋 Before You Start

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and connection string obtained
- [ ] Render account created
- [ ] Vercel account created
- [ ] Code pushed to your GitHub repository

---

## 🔧 Configuration Files to Update

### 1. Backend Environment (`server/.env.production`)

```bash
# Update these values:
FRONTEND_URL=https://your-frontend-app.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MFA_ISSUER=Your Company HR System
```

- [ ] Updated `FRONTEND_URL` with your Vercel URL
- [ ] Updated `MONGODB_URI` with your MongoDB connection string
- [ ] Updated `MFA_ISSUER` with your company name

---

### 2. Frontend Environment (`.env.production`)

```bash
# Update this value:
VITE_API_URL=https://your-backend.onrender.com/api
```

- [ ] Updated `VITE_API_URL` with your Render backend URL

---

### 3. Render Configuration (`render.yaml`)

```yaml
# Update these values:
name: your-company-hr-backend
FRONTEND_URL: https://your-frontend-app.vercel.app
MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/database
MFA_ISSUER: Your Company HR System
```

- [ ] Updated service `name`
- [ ] Updated `FRONTEND_URL`
- [ ] Updated `MONGODB_URI`
- [ ] Updated `MFA_ISSUER`
- [ ] Updated `region` (optional)

---

## 🗄️ MongoDB Atlas Configuration

- [ ] Created database cluster
- [ ] Created database user with read/write permissions
- [ ] Added `0.0.0.0/0` to Network Access (allows Render to connect)
- [ ] Obtained connection string
- [ ] Tested connection (optional)

---

## 🚀 Deployment Steps

### Backend (Render)

- [ ] Pushed code to GitHub
- [ ] Created new Web Service on Render
- [ ] Connected GitHub repository
- [ ] Render detected `render.yaml`
- [ ] Verified environment variables are correct
- [ ] Deployment completed successfully
- [ ] Health check endpoint works: `https://your-backend.onrender.com/api/health`

---

### Frontend (Vercel)

- [ ] Created new project on Vercel
- [ ] Connected GitHub repository
- [ ] Added `VITE_API_URL` environment variable
- [ ] Applied to Production, Preview, and Development
- [ ] Deployment completed successfully
- [ ] Frontend loads correctly

---

## ✅ Post-Deployment Verification

- [ ] Backend health check returns OK
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] Dashboard displays correctly
- [ ] No CORS errors in browser console
- [ ] Can create/edit employees
- [ ] Can apply for leave
- [ ] Can mark attendance
- [ ] Notifications work
- [ ] Reports generate correctly

---

## 🔐 Security Checklist

- [ ] Changed default admin password
- [ ] Removed test/demo data from database
- [ ] JWT_SECRET is auto-generated (not hardcoded)
- [ ] MongoDB password is strong and secure
- [ ] Environment variables are not committed to Git
- [ ] HTTPS is enabled (automatic on Vercel/Render)

---

## 📝 URLs to Save

After deployment, save these URLs:

```
Frontend URL: https://_____________________.vercel.app
Backend URL:  https://_____________________.onrender.com
Health Check: https://_____________________.onrender.com/api/health
MongoDB:      https://cloud.mongodb.com/

Vercel Dashboard:  https://vercel.com/dashboard
Render Dashboard:  https://dashboard.render.com/
MongoDB Dashboard: https://cloud.mongodb.com/
```

---

## 🆘 If Something Goes Wrong

See **TROUBLESHOOTING.md** for common issues and solutions.

See **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md** for detailed deployment instructions.

---

## ✅ Deployment Complete!

Once all items are checked:
1. Change default admin credentials
2. Add your company's employees
3. Configure leave policies
4. Set up departments
5. Start using the system!

**Congratulations! Your HR Management System is now live! 🎉**
