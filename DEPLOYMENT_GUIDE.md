# 🚀 Deployment Guide - WEintegrity HRMS

Complete guide for deploying the WEintegrity HR Management System to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Domain & SSL Configuration](#domain--ssl-configuration)
7. [Post-Deployment](#post-deployment)
8. [Deployment Platforms](#deployment-platforms)
9. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist

### Code Preparation
- [ ] All tests passing (run `node test-complete-system-comprehensive.js`)
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] Security review completed
- [ ] Database backup created
- [ ] Documentation updated

### Required Accounts
- [ ] Cloud hosting account (AWS, Azure, Heroku, DigitalOcean, etc.)
- [ ] MongoDB Atlas account (or other cloud MongoDB)
- [ ] Domain registrar account (optional)
- [ ] SSL certificate provider (Let's Encrypt recommended)

---

## 🔧 Environment Setup

### Backend Environment Variables

Create `server/.env.production`:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Frontend URL (Update with your production domain)
FRONTEND_URL=https://your-domain.com

# Database (MongoDB Atlas or other cloud MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr_management_system?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_random_string_here_min_32_chars
JWT_EXPIRE=7d

# Email Configuration (SMTP)
ENABLE_REAL_EMAIL=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=noreply@your-domain.com

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=30

# CORS
CORS_ORIGIN=https://your-domain.com
```

### Frontend Environment Variables

Create `.env.production`:

```env
# API URL (Update with your backend URL)
VITE_API_URL=https://api.your-domain.com/api
```

---

## 💾 Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier (512MB storage)

2. **Create Cluster**
   ```
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select region closest to your users
   - Click "Create Cluster"
   ```

3. **Configure Database Access**
   ```
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: hrms_admin
   - Password: Generate secure password
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
   ```

4. **Configure Network Access**
   ```
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Add your IP
   - For production: Add "0.0.0.0/0" (Allow from anywhere)
     OR add specific server IPs
   - Click "Confirm"
   ```

5. **Get Connection String**
   ```
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your database password
   - Replace <dbname> with "hr_management_system"
   ```

6. **Seed Initial Data** (Optional)
   ```bash
   # Update MONGODB_URI in server/.env
   cd server
   node utils/seed.js
   ```

### Option 2: Self-Hosted MongoDB

If hosting MongoDB yourself:

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
use hr_management_system
db.createUser({
  user: "hrms_admin",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

---

## 🖥️ Backend Deployment

### Option A: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd server
   heroku create your-hrms-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
   heroku config:set JWT_SECRET="your_secure_jwt_secret"
   heroku config:set FRONTEND_URL="https://your-frontend-domain.com"
   heroku config:set ENABLE_REAL_EMAIL=true
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_PORT=587
   heroku config:set SMTP_USER=your-email@gmail.com
   heroku config:set SMTP_PASS=your-app-password
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   heroku git:remote -a your-hrms-api
   git push heroku main
   ```

6. **Verify Deployment**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Option B: DigitalOcean App Platform

1. **Create Account** at [DigitalOcean](https://www.digitalocean.com/)

2. **Create App**
   - Go to "Apps" → "Create App"
   - Connect your GitHub repository
   - Select branch: `main`
   - Autodeploy: Enable

3. **Configure Build Settings**
   ```
   Build Command: npm install
   Run Command: npm start
   HTTP Port: 5000
   ```

4. **Add Environment Variables**
   - Go to "Settings" → "App-Level Environment Variables"
   - Add all variables from `.env.production`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option C: AWS EC2

1. **Launch EC2 Instance**
   ```
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t2.micro (free tier)
   - Security Group: Allow ports 22, 80, 443, 5000
   ```

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 (Process Manager)
   sudo npm install -g pm2

   # Install Nginx (Reverse Proxy)
   sudo apt install nginx -y
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd HR_app-main/server

   # Install dependencies
   npm install --production

   # Create .env file
   nano .env
   # Paste production environment variables

   # Start with PM2
   pm2 start server.js --name hrms-api
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/hrms-api
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name api.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/hrms-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🌐 Frontend Deployment

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Configure Project**
   Create `vercel.json` in project root:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "env": {
       "VITE_API_URL": "https://your-api-domain.com/api"
     }
   }
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option B: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Build Project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Configure Environment Variables**
   - Go to Netlify Dashboard
   - Site Settings → Environment Variables
   - Add `VITE_API_URL`

### Option C: AWS S3 + CloudFront

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-hrms-frontend
   aws s3 website s3://your-hrms-frontend --index-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-hrms-frontend --delete
   ```

4. **Configure CloudFront**
   - Create CloudFront distribution
   - Origin: S3 bucket
   - Enable HTTPS
   - Set custom error page: /index.html (for SPA routing)

### Option D: Same Server as Backend (Nginx)

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Copy to Server**
   ```bash
   scp -r dist/* ubuntu@your-server:/var/www/hrms
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/hrms;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔒 Domain & SSL Configuration

### Configure Domain

1. **Point Domain to Server**
   - Add A record: `your-domain.com` → `your-server-ip`
   - Add A record: `api.your-domain.com` → `your-server-ip`

2. **Wait for DNS Propagation** (up to 48 hours)

### Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## ✅ Post-Deployment

### 1. Verify Deployment

```bash
# Test backend health
curl https://api.your-domain.com/api/health

# Test frontend
curl https://your-domain.com

# Test login
curl -X POST https://api.your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hrms.com","password":"password123"}'
```

### 2. Create Admin Account

```bash
# SSH to server
ssh ubuntu@your-server

# Run seed script
cd HR_app-main/server
node utils/seed.js
```

### 3. Configure Monitoring

**Option A: PM2 Monitoring**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Option B: External Monitoring**
- [UptimeRobot](https://uptimerobot.com/) - Free uptime monitoring
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay

### 4. Set Up Backups

**MongoDB Atlas Backups** (Automatic)
- Go to "Backup" tab
- Enable "Continuous Backup"

**Manual Backup Script**:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your_mongodb_uri" --out="/backups/hrms_$DATE"
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### 5. Security Hardening

```bash
# Enable firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd

# Install fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

---

## 🌍 Deployment Platforms Comparison

| Platform | Backend | Frontend | Database | Cost | Difficulty |
|----------|---------|----------|----------|------|------------|
| **Heroku** | ✅ | ✅ | External | $7/mo | Easy |
| **Vercel + Heroku** | Heroku | Vercel | External | $7/mo | Easy |
| **Netlify + Railway** | Railway | Netlify | External | $5/mo | Easy |
| **DigitalOcean** | ✅ | ✅ | ✅ | $6/mo | Medium |
| **AWS** | EC2 | S3+CloudFront | Atlas | $10/mo | Hard |
| **Azure** | App Service | Static Web Apps | Cosmos DB | $15/mo | Hard |
| **VPS (DigitalOcean/Linode)** | ✅ | ✅ | ✅ | $5/mo | Medium |

### Recommended for Beginners:
**Vercel (Frontend) + Railway (Backend) + MongoDB Atlas (Database)**
- Total Cost: ~$5/month
- Easy setup
- Auto-deployment from Git
- Free SSL
- Good performance

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:**
```javascript
// server/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Issue: MongoDB Connection Failed

**Solution:**
1. Check MongoDB Atlas IP whitelist
2. Verify connection string
3. Check network connectivity
4. Ensure database user has correct permissions

### Issue: Environment Variables Not Loading

**Solution:**
```bash
# Verify .env file exists
ls -la server/.env

# Check if variables are set
echo $NODE_ENV

# Restart application
pm2 restart hrms-api
```

### Issue: Build Fails

**Solution:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+

# Build with verbose logging
npm run build --verbose
```

### Issue: SSL Certificate Not Working

**Solution:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL certificate obtained
- [ ] Domain configured

### Deployment
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] API endpoints working
- [ ] Login functionality working

### Post-Deployment
- [ ] Admin account created
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Security hardened
- [ ] Documentation updated
- [ ] Team notified

---

## 🎯 Quick Deployment (Recommended Stack)

### 1. MongoDB Atlas (Database)
```
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Add to environment variables
```

### 2. Railway (Backend)
```
1. Go to railway.app
2. Connect GitHub repository
3. Select server folder
4. Add environment variables
5. Deploy
```

### 3. Vercel (Frontend)
```
1. Go to vercel.com
2. Import GitHub repository
3. Set build command: npm run build
4. Set output directory: dist
5. Add VITE_API_URL environment variable
6. Deploy
```

**Total Time:** ~30 minutes  
**Total Cost:** $0-5/month  
**Difficulty:** Easy

---

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs` or platform-specific logs
2. Review error messages
3. Check environment variables
4. Verify database connection
5. Test API endpoints manually

---

**Deployment Guide Version:** 1.0  
**Last Updated:** October 31, 2025  
**Status:** Production Ready

