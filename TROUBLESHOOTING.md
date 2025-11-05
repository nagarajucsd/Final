# 🔧 Troubleshooting Guide

Common issues and their solutions for HR Management System deployment and operation.

---

## 🚨 Backend Issues

### Issue: Backend won't start on Render

**Symptoms**:
- Render shows "Deploy failed"
- Logs show "Cannot find module"
- Build fails

**Solutions**:

1. **Check build command**:
   ```
   cd server && npm install
   ```

2. **Check start command**:
   ```
   cd server && npm start
   ```

3. **Verify package.json exists in server folder**

4. **Check Render logs**:
   - Go to Render dashboard
   - Click on your service
   - View "Logs" tab
   - Look for specific error messages

---

### Issue: MongoDB connection failed

**Symptoms**:
- Backend logs show "MongoServerError"
- "Authentication failed"
- "Connection timeout"

**Solutions**:

1. **Check MongoDB password**:
   - Verify `<db_password>` is replaced with actual password
   - No special characters causing issues
   - URL encode special characters if needed

2. **Check Network Access**:
   - Go to MongoDB Atlas
   - Network Access → Verify 0.0.0.0/0 is added
   - Wait 2-3 minutes for changes to propagate

3. **Check Database User**:
   - Database Access → Verify user exists
   - User has "Read and write to any database" role

4. **Test connection string**:
   ```bash
   # Replace with your actual password
   mongodb+srv://naveenrahulroy1_db_user:YOUR_PASSWORD@hrbackend.9prjvtu.mongodb.net/?retryWrites=true&w=majority&appName=hrbackend
   ```

---

### Issue: Health check fails

**Symptoms**:
- https://app-hr.onrender.com/api/health returns 404
- "Service unavailable"

**Solutions**:

1. **Wait for deployment**:
   - First deployment takes 5-10 minutes
   - Check Render dashboard for deployment status

2. **Check service name**:
   - Must be exactly: `app-hr`
   - This determines your URL

3. **Check health check path**:
   - Should be: `/api/health`
   - Verify in render.yaml

4. **Check Render logs**:
   - Look for startup errors
   - Verify server is listening on correct port

---

## 🚨 Frontend Issues

### Issue: Frontend can't connect to backend

**Symptoms**:
- Browser console shows "Network Error"
- "Failed to fetch"
- API calls return 404

**Solutions**:

1. **Check VITE_API_URL**:
   - Go to Vercel → Settings → Environment Variables
   - Should be: `https://your-backend.onrender.com/api`
   - No trailing slash!

2. **Redeploy Vercel**:
   - After adding env vars, you MUST redeploy
   - Go to Deployments → Redeploy

3. **Check backend is running**:
   - Test: https://your-backend.onrender.com/api/health
   - Should return JSON response

4. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito mode

---

### Issue: CORS errors

**Symptoms**:
- Browser console shows "CORS policy"
- "Access-Control-Allow-Origin"
- "Blocked by CORS policy"

**Solutions**:

1. **Check FRONTEND_URL in Render**:
   - Must match your Vercel URL exactly
   - No trailing slash
   - No www prefix unless your URL has it

2. **Check server.js CORS config**:
   - Should include your Vercel URL in allowedOrigins
   - Already configured in your project

3. **Restart Render service**:
   - Go to Render dashboard
   - Manual Deploy → Deploy latest commit

4. **Check browser console**:
   - Look for the exact origin being blocked
   - Verify it matches your Vercel URL

---

### Issue: Login doesn't work

**Symptoms**:
- Login button does nothing
- "Invalid credentials" error
- Redirects to login immediately

**Solutions**:

1. **Check API connection**:
   - Open browser console (F12)
   - Look for network errors
   - Verify API calls are reaching backend

2. **Check credentials**:
   - Use correct username/password
   - Check if users exist in database

3. **Check JWT token**:
   - Backend logs should show token generation
   - Frontend should store token in localStorage

4. **Check MongoDB data**:
   - Verify users collection has data
   - Check password hashes are correct

---

## 🚨 Database Issues

### Issue: No data showing in application

**Symptoms**:
- Dashboard is empty
- "No employees found"
- Lists are empty

**Solutions**:

1. **Check database connection**:
   - Backend logs should show "MongoDB Connected"
   - No connection errors

2. **Check database has data**:
   - Go to MongoDB Atlas
   - Browse Collections
   - Verify data exists

3. **Check API responses**:
   - Browser console → Network tab
   - Check API responses
   - Should return data arrays

4. **Seed database** (if empty):
   - Run seed scripts if available
   - Or manually add test data

---

### Issue: Database connection timeout

**Symptoms**:
- "MongoServerSelectionError"
- "Connection timeout"
- Takes long time then fails

**Solutions**:

1. **Check Network Access**:
   - MongoDB Atlas → Network Access
   - Must have 0.0.0.0/0
   - Wait 2-3 minutes after adding

2. **Check connection string**:
   - Verify format is correct
   - No typos in cluster name
   - Password is correct

3. **Check MongoDB Atlas status**:
   - Visit MongoDB status page
   - Check for outages

4. **Try different region**:
   - In render.yaml, try different region
   - Some regions may have better connectivity

---

## 🚨 Deployment Issues

### Issue: Render deployment fails

**Symptoms**:
- "Build failed"
- "Deploy failed"
- Red status in Render dashboard

**Solutions**:

1. **Check build logs**:
   - Render dashboard → Logs
   - Look for specific error messages

2. **Check render.yaml syntax**:
   - YAML is indentation-sensitive
   - Verify no syntax errors

3. **Check Node.js version**:
   - Render uses latest Node.js by default
   - Add `NODE_VERSION` env var if needed

4. **Manual deployment**:
   - Try deploying without render.yaml
   - Set everything manually in Render UI

---

### Issue: Vercel deployment fails

**Symptoms**:
- Build fails
- "Command failed"
- Red status in Vercel

**Solutions**:

1. **Check build logs**:
   - Vercel dashboard → Deployments → View logs

2. **Check build command**:
   - Should be: `npm run build`
   - Or: `npm install && npm run build`

3. **Check dependencies**:
   - Verify package.json is correct
   - All dependencies are listed

4. **Check Node.js version**:
   - Vercel uses Node 18 by default
   - Add `NODE_VERSION` in settings if needed

---

## 🚨 Performance Issues

### Issue: Backend is slow (Render free tier)

**Symptoms**:
- First request takes 30+ seconds
- Subsequent requests are fast
- "Service unavailable" initially

**Solutions**:

1. **This is normal for Render free tier**:
   - Service sleeps after 15 minutes inactivity
   - First request wakes it up (30-60 seconds)
   - Consider upgrading to paid plan

2. **Keep service awake**:
   - Use a cron job to ping health endpoint
   - Services like UptimeRobot (free)
   - Ping every 10 minutes

3. **Optimize cold starts**:
   - Reduce dependencies
   - Optimize startup code
   - Use lazy loading

---

### Issue: Frontend is slow

**Symptoms**:
- Pages take long to load
- Images load slowly
- Laggy interactions

**Solutions**:

1. **Check bundle size**:
   - Run: `npm run build`
   - Check dist folder size
   - Should be < 5MB

2. **Optimize images**:
   - Compress images
   - Use appropriate formats
   - Lazy load images

3. **Check API response times**:
   - Use browser Network tab
   - Identify slow endpoints
   - Optimize backend queries

---

## 🔍 Debugging Tools

### Browser Console (F12)

```javascript
// Check if API URL is correct
console.log(import.meta.env.VITE_API_URL);

// Check stored token
console.log(localStorage.getItem('token'));

// Check stored user
console.log(localStorage.getItem('user'));

// Clear storage (if needed)
localStorage.clear();
```

### Test Backend from Terminal

```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Test login endpoint
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### Check Render Logs

```bash
# In Render dashboard:
# 1. Click on your service
# 2. Go to "Logs" tab
# 3. Look for errors
# 4. Filter by error level
```

---

## 📞 Getting Help

### Check Documentation

1. **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md** - Complete deployment guide
2. **docs/DEPLOYMENT_GUIDE.md** - General deployment documentation
3. **docs/API_REFERENCE.md** - API documentation
4. **docs/ARCHITECTURE.md** - System architecture

### Check Service Status

- Render Status: https://status.render.com/
- Vercel Status: https://www.vercel-status.com/
- MongoDB Status: https://status.cloud.mongodb.com/

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| ECONNREFUSED | Backend not running | Check Render deployment |
| 401 Unauthorized | Invalid token | Re-login |
| 404 Not Found | Wrong URL | Check API_URL |
| 500 Internal Server Error | Backend error | Check Render logs |
| CORS Error | Origin not allowed | Check FRONTEND_URL |
| MongoServerError | Database issue | Check MongoDB Atlas |

---

## ✅ Verification Checklist

Use this to verify everything is working:

- [ ] Backend health check returns OK
- [ ] Frontend loads without errors
- [ ] Login works
- [ ] Dashboard displays data
- [ ] Can create/edit employees
- [ ] Can apply for leave
- [ ] Can mark attendance
- [ ] Reports generate
- [ ] No console errors
- [ ] No CORS errors
- [ ] Mobile view works

---

## 🎯 Still Having Issues?

1. **Check all environment variables** are set correctly
2. **Verify MongoDB Atlas** Network Access allows 0.0.0.0/0
3. **Check Render logs** for specific errors
4. **Check browser console** for frontend errors
5. **Test backend independently** using curl
6. **Clear browser cache** and try again
7. **Try incognito mode** to rule out cache issues

---

**Remember**: Most issues are due to:
- Incorrect environment variables
- MongoDB Network Access not configured
- Forgetting to redeploy after changes
- Typos in URLs (trailing slashes, etc.)

Good luck! 🚀
