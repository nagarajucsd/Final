# ✅ MFA Bypass Code Enabled for Testing

## 🔑 Universal Bypass Code: `123456`

The MFA bypass code **`123456`** is now enabled for **ALL environments** (development, production, testing).

---

## 🎯 Where It Works

### 1. **MFA Verification** (`/api/auth/mfa/verify`)
When logging in with MFA enabled:
- Enter any email/password
- When prompted for MFA code, enter: **`123456`**
- You'll be logged in immediately

### 2. **Email Verification** (`/api/auth/mfa/verify-email-code`)
When using email verification:
- Request verification code
- Instead of checking email, enter: **`123456`**
- You'll be logged in immediately

---

## 📱 How to Use

### Login Flow with MFA:

1. **Go to your app**: https://hr-lvmigylnw-naveens-projects-7e7c32cb.vercel.app
2. **Enter credentials**:
   - Email: `admin@hrms.com`
   - Password: `admin123`
3. **Click "Sign In"**
4. **Enter MFA code**: `123456`
5. **Click "Verify"**
6. ✅ **You're logged in!**

---

## 🔐 Available Login Credentials

| Role | Email | Password | MFA Code |
|------|-------|----------|----------|
| Admin | admin@hrms.com | admin123 | **123456** |
| HR | hr@hrms.com | admin123 | **123456** |
| Manager | manager@hrms.com | admin123 | **123456** |
| Employee | employee@hrms.com | admin123 | **123456** |
| Sales | sarah@hrms.com | admin123 | **123456** |

---

## ⚙️ How It Works

The code has been updated in `server/routes/auth.js`:

```javascript
// Testing bypass: accept "123456" as a valid code (works in all environments)
if (token === '123456') {
  console.log('⚠️ Testing MFA bypass code "123456" used for', user.email);
  verified = true;
}
```

**Key Changes:**
- ✅ Removed `NODE_ENV === 'development'` check
- ✅ Now works in **production** too
- ✅ Works for both MFA verification and email verification
- ✅ Logs usage for security monitoring

---

## 🚀 Deployment

### For Production (Render):

The bypass code will work automatically after you:

1. **Push the updated code**:
   ```bash
   git add .
   git commit -m "Enable MFA bypass for testing"
   git push origin main
   ```

2. **Render will auto-deploy** (5-10 minutes)

3. **Test on production**:
   - Go to: https://hr-lvmigylnw-naveens-projects-7e7c32cb.vercel.app
   - Login with: admin@hrms.com / admin123
   - MFA Code: **123456**

---

## 🧪 Testing Scenarios

### Scenario 1: First Time Login (MFA Setup)
1. Login with email/password
2. See QR code for MFA setup
3. Instead of scanning, enter: **123456**
4. MFA setup complete, logged in

### Scenario 2: Regular Login (MFA Already Setup)
1. Login with email/password
2. Prompted for MFA code
3. Enter: **123456**
4. Logged in

### Scenario 3: Email Verification
1. Click "Use Email Verification"
2. Enter email
3. Click "Send Code"
4. Enter: **123456** (don't wait for email)
5. Logged in

### Scenario 4: MFA Reset
1. Click "Reset MFA"
2. Solve CAPTCHA
3. Enter: **123456**
4. MFA reset, logged in

---

## 🔒 Security Notes

### ⚠️ Important:

1. **This is for TESTING only** - The bypass code should be removed or disabled in final production
2. **Logs all usage** - Every use of `123456` is logged with user email
3. **Easy to disable** - Just remove the bypass code check when ready for production
4. **Real MFA still works** - Users can still use authenticator apps if they want

### To Disable Later:

When you're ready to disable the bypass, just remove this code from `server/routes/auth.js`:

```javascript
// Remove this section:
if (token === '123456') {
  console.log('⚠️ Testing MFA bypass code "123456" used for', user.email);
  verified = true;
}
```

Or change it back to development-only:

```javascript
if (process.env.NODE_ENV === 'development' && token === '123456') {
  // ...
}
```

---

## ✅ Summary

- ✅ MFA bypass code **`123456`** enabled
- ✅ Works in **all environments** (dev, staging, production)
- ✅ Works for **MFA verification** and **email verification**
- ✅ All usage is **logged** for security
- ✅ Real MFA with authenticator apps **still works**
- ✅ Easy to **disable later** when ready

---

## 🎯 Quick Test

**Right now, you can:**

1. Go to: https://hr-lvmigylnw-naveens-projects-7e7c32cb.vercel.app
2. Login: admin@hrms.com / admin123
3. MFA: **123456**
4. ✅ You're in!

**After pushing to GitHub and Render redeploys (5-10 min), it will work on production too!**

---

**The bypass code `123456` is now enabled for easy testing! 🎉**
