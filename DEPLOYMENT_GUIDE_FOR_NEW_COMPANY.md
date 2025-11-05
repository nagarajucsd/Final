# 🚀 Deployment Guide for New Company

This guide explains what you need to change to deploy this HR Management System for your company.

---

## 📋 What You Need

1. **MongoDB Atlas Account** (Free tier available)
2. **Render Account** (For backend hosting - Free tier available)
3. **Vercel Account** (For frontend hosting - Free tier available)
4. **GitHub Account** (To store your code)

---

## 🔧 Configuration Changes Required

### 1. MongoDB Atlas Setup

**Create your database:**

1. Go to https://cloud.mongodb.com/
2. Create a new cluster (free tier is fine)
3. Create a database user with username and password
4. Note your connection string - it will look like:
   ```
   mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Network Access**: Add `0.0.0.0/0` to allow connections from anywhere

---

### 2. Backend Configuration (Render)

**File: `server/.env.production`**

Update these values:

```bash
# Your frontend URL (will be provided by Vercel)
FRONTEND_URL=https://your-company-app.vercel.app

# Your MongoDB connection string
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE_NAME?retryWrites=true&w=majority

# These can stay as default
PORT=5000
NODE_ENV=production
JWT_SECRET=auto-generated-by-render
JWT_EXPIRE=30d
MFA_ISSUER=Your Company HR System
```

**File: `render.yaml`**

Update these values:

```yaml
services:
  - type: web
    name: your-company-hr-backend  # Change this to your preferred name
    env: node
    region: oregon  # Change to your preferred region
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: FRONTEND_URL
        value: https://your-company-app.vercel.app  # Your Vercel URL
      - key: MONGODB_URI
        value: mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE_NAME?retryWrites=true&w=majority
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRE
        value: 30d
      - key: MFA_ISSUER
        value: Your Company HR System  # Your company name
    healthCheckPath: /api/health
```

---

### 3. Frontend Configuration (Vercel)

**File: `.env.production`**

Update this value:

```bash
# Your backend URL (will be provided by Render)
VITE_API_URL=https://your-company-hr-backend.onrender.com/api
```

**In Vercel Dashboard:**

After deploying, add this environment variable:
- Name: `VITE_API_URL`
- Value: `https://your-company-hr-backend.onrender.com/api`
- Apply to: Production, Preview, Development

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Code

1. Update the configuration files mentioned above
2. Commit changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure for company deployment"
   git push origin main
   ```

### Step 2: Deploy Backend to Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and use those settings
5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Note your backend URL: `https://your-service-name.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
6. Click "Deploy"
7. Note your frontend URL: `https://your-project.vercel.app`

### Step 4: Update CORS Settings

After getting your Vercel URL, update the backend:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your actual Vercel URL
5. Save and redeploy

### Step 5: Test Your Deployment

1. **Test Backend**: Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"HR Management API is running"}`

2. **Test Frontend**: Visit your Vercel URL
   - Should load the login page
   - Try logging in (default admin credentials if you haven't changed them)

---

## 📝 Summary of Changes

| File | What to Change | Example |
|------|----------------|---------|
| `server/.env.production` | FRONTEND_URL, MONGODB_URI | Your Vercel URL, Your MongoDB connection |
| `render.yaml` | name, FRONTEND_URL, MONGODB_URI, MFA_ISSUER | Your service name, URLs, company name |
| `.env.production` | VITE_API_URL | Your Render backend URL |
| Vercel Dashboard | VITE_API_URL environment variable | Your Render backend URL |

---

## 🔐 Security Checklist

- [ ] Changed MongoDB username and password
- [ ] Updated FRONTEND_URL to your actual domain
- [ ] Let Render auto-generate JWT_SECRET (don't use a hardcoded value)
- [ ] MongoDB Network Access configured (0.0.0.0/0 for Render)
- [ ] Changed default admin password after first login
- [ ] Removed any test/demo data from database

---

## 🆘 Troubleshooting

### Backend won't connect to MongoDB
- Verify MongoDB connection string is correct
- Check MongoDB Network Access allows 0.0.0.0/0
- Ensure database user has read/write permissions

### Frontend can't connect to backend
- Verify VITE_API_URL is set in Vercel
- Check FRONTEND_URL is set correctly in Render
- Ensure no trailing slashes in URLs

### CORS errors
- Verify FRONTEND_URL in Render matches your Vercel URL exactly
- No www prefix unless your Vercel URL has it
- No trailing slashes

---

## 📞 Support

For detailed troubleshooting, see:
- `docs/DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `docs/ARCHITECTURE.md` - System architecture
- `docs/API_REFERENCE.md` - API documentation

---

## ✅ Deployment Complete!

Once everything is working:
1. Change default admin credentials
2. Add your company's employees
3. Configure leave policies
4. Set up departments
5. Start using the system!

**Your HR Management System is now live! 🎉**
