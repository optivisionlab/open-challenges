# Build Logs & Error Handling Guide

**Date**: March 23, 2026  
**Project**: Open Challenges Platform  
**Frontend**: Next.js 14 with TypeScript

---

## 📋 Build Process Summary

| Step | Status | Duration |
|------|--------|----------|
| Environment Setup | ✅ Success | - |
| npm install | ✅ Success | 51s |
| Development Server Start | ✅ Success | 3.9s |
| **Total Build Time** | ✅ **Complete** | **~55s** |

---

## 🔴 Errors Encountered & Solutions

### 1. **SWC Binary Load Error (darwin/arm64)**

#### ❌ Error Message
```
⚠ Attempted to load @next/swc-darwin-arm64, but an error occurred: ...
⨯ Failed to load SWC binary for darwin/arm64
Error: dlopen(...): segment '__TEXT' load command content extends beyond end of file
```

#### 🔍 Root Cause
- SWC (Speedy Web Compiler) binary corruption or incompatibility
- Common on M1/M2 Mac machines with Next.js
- Package installation issue with precompiled binaries

#### ✅ Solution Applied
```bash
# Step 1: Remove corrupted dependencies
rm -rf node_modules package-lock.json

# Step 2: Clear npm cache
npm cache clean --force

# Step 3: Fresh install
npm install
```

#### 📌 Prevention Tips
- Always do fresh installs on architecture-specific systems
- Use `npm cache clean --force` before major installs
- Consider using `npm install --no-optional` if issues persist
- Update Node.js to latest LTS: `nvm install 20.19.2`

---

### 2. **Invalid next.config.js Configuration**

#### ❌ Error Message
```
⚠ Invalid next.config.js options detected
⚠ Unrecognized key(s) in object: 'swrConfig'
```

#### 🔍 Root Cause
- Added invalid `swrConfig` option to `next.config.js`
- SWR (stale-while-revalidate) config is not a valid Next.js option
- Should be configured in individual components instead

#### ✅ Solution Applied
**File**: `frontend/next.config.js`

**Before**:
```javascript
swrConfig: {
  dedupingInterval: 60000,
  focusThrottleInterval: 300000,
},
```

**After**: 
```javascript
// Removed swrConfig - use SWR hooks in components instead
```

#### 📌 Prevention Tips
- Check Next.js official config documentation: https://nextjs.org/docs/api-reference/next-config-js
- Validate config before deploying with: `npx next build`
- Use TypeScript for config validation (when available)
- Only use documented configuration options

---

### 3. **Network Connection Error (ECONNRESET)**

#### ❌ Error Message
```
npm error code ECONNRESET
npm error network aborted
npm error network This is a problem related to network connectivity
npm error Could not read package.json
```

#### 🔍 Root Cause
- Failed npm registry connection during first install attempt
- Temporary network interruption or registry timeout
- Possible proxy/firewall issues

#### ✅ Solution Applied
```bash
# Retry npm install with exponential backoff
npm install --retry 5 --registry https://registry.npmjs.org/

# Or use yarn as fallback
yarn install
```

#### 📌 Prevention Tips
```bash
# Configure npm registry timeout
npm config set fetch-timeout 120000
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

# Use mirror registry if main registry is slow
npm config set registry https://npm.taobao.org

# Test connection
npm ping
```

---

## ⚠️ Warnings (Non-Blocking)

### Deprecated Packages
```
npm warn deprecated inflight@1.0.6: Not supported, leaks memory
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array
npm warn deprecated rimraf@3.0.2: Versions prior to v4 no longer supported
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema
npm warn deprecated glob@7.2.3 & glob@10.3.10: Security vulnerabilities
npm warn deprecated eslint@8.57.1: Version no longer supported
```

#### 🔧 Fix
```bash
# Run audit fix to address non-breaking changes
npm audit fix

# For major version updates (breaking changes)
npm audit fix --force  # Use with caution!
```

#### 📌 Status
- **4 high severity vulnerabilities** reported
- Non-blocking for development
- Should be fixed before production deployment

---

## ✅ Build Success Indicators

```
✓ Compiled / in 3.9s (559 modules)
✓ GET / 200 in 4314ms (first load)
✓ GET / 200 in 65ms (cached load)
✓ Hot Module Replacement (HMR) Ready
✓ TypeScript Compilation Success
✓ Tailwind CSS Processing Success
```

### Environment Files Created
- ✅ `.env.local` - Local development variables
- ✅ `node_modules/` - Dependencies installed (401 packages)
- ✅ `.next/` - Build cache generated

---

## 🔧 Development Server Commands

### Start Development Server
```bash
cd frontend
npm run dev
# Server runs on http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
npm run format:check
```

---

## 📊 System Information

```
Node.js: v20.19.2
npm: 10.8.2
OS: macOS (M1/M2 chip)
Architecture: darwin/arm64
Next.js: 14.0.0+
React: 18.2.0+
TypeScript: 5.0.0+
Tailwind CSS: 3.3.0+
```

---

## 🛠️ Troubleshooting Checklist

| Issue | Check | Fix |
|-------|-------|-----|
| **Port 3000 already in use** | `lsof -i :3000` | `kill -9 PID` or use `npm run dev -- -p 3001` |
| **Module not found** | Check `import` paths | Verify path aliases in `tsconfig.json` |
| **Styles not loading** | Check Tailwind config | Verify `tailwind.config.ts` content paths |
| **Images not displaying** | Check image domains | Add to `next.config.js` → `images.domains` |
| **Type errors** | Run `tsc --noEmit` | Fix TypeScript errors before build |
| **Hot reload not working** | Check file watcher | Restart dev server |
| **Build fails** | Check memory | Increase Node heap: `NODE_OPTIONS=--max_old_space_size=4096` |

---

## 📝 Git Ignore Configuration

**File**: `frontend/.gitignore`

Ensures these are not committed:
```
/node_modules          # Dependencies
/.next/                # Build output
.env.local             # Local secrets
.env.*.local           # Environment files
package-lock.json      # Lock file (use in CI)
coverage/              # Test coverage
.DS_Store              # macOS files
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Run `npm run type-check` - no errors
- [ ] Run `npm run lint` - no critical issues
- [ ] Test all pages on `npm run start`
- [ ] Verify `.env.production` variables set correctly
- [ ] Test responsive design on mobile
- [ ] Check performance with Lighthouse
- [ ] Update `system.md` and documentation
- [ ] Create `.env.prod` from `.env.example`

---

## 📞 Common Issues & Solutions

### Issue: `Cannot find module '@/types'`

**Cause**: Path alias not configured  
**Fix**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Issue: `Tailwind classes not applying`

**Cause**: Content paths not configured  
**Fix**:
```javascript
// tailwind.config.ts
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}
```

---

### Issue: `Next.js port already in use`

**Cause**: Port 3000 occupied by another process  
**Fix**:
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

---

### Issue: `Image optimization failed`

**Cause**: Image domain not allowed  
**Fix**:
```javascript
// next.config.js
images: {
  domains: ['images.unsplash.com', 'yourdomain.com'],
}
```

---

## 📈 Performance Metrics

**First Build**: 
- Time: 3.9 seconds
- Modules: 559
- Total Pages: 2 (Home + Challenges)

**Page Load Times**:
- First Load: 4314ms (Cold)
- Subsequent: 65ms (Hot/Cached)

**Bundle Size** (Estimated):
- JavaScript: ~150KB (gzipped)
- CSS: ~50KB (gzipped)
- Total: ~200KB

---

## 🔒 Security Notes

### Vulnerable Dependencies
```
4 high severity vulnerabilities detected

To fix:
1. Review: npm audit
2. Update: npm upgrade
3. Fix: npm audit fix --force
```

### Environment Variables
- ✅ `.env.example` - Safe template (no secrets)
- ✅ `.env.local` - Local development (git ignored)
- ✅ `.env.production` - Production (git ignored, CI only)

### CORS & Security Headers
Configured in `next.config.js`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

---

## 📚 References & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **React**: https://react.dev
- **npm Packages Info**: https://www.npmjs.com

---

## 🔄 Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check for failed builds

### Weekly
- [ ] Review vulnerabilities: `npm audit`
- [ ] Update patch versions: `npm update`
- [ ] Check for new releases

### Monthly
- [ ] Update minor versions: `npm upgrade`
- [ ] Review deprecated packages
- [ ] Performance audit

### Quarterly
- [ ] Major version updates
- [ ] Dependency security review
- [ ] Performance optimization

---

## 📞 Support & Contact

For issues or questions:
1. Check this logs.md file
2. Review error messages in console
3. Check Next.js documentation
4. Open issue on GitHub
5. Contact team lead

---

### Log Entry: March 26, 2026

#### Backend
- Investigated and fixed the registration issue by reviewing `auth.py`, `auth_service.py`, and `user.py`.
- Updated `authService.ts` to connect the frontend with the backend API.
- Resolved PostgreSQL error by fixing the healthcheck in `docker-compose.dev.yml`.
- Verified database persistence using `test_db_persistence.py`.

#### Frontend
- Edited `Header.tsx` to conditionally display the account icon for authenticated users.
- Updated `authService.ts` to store user information in `localStorage` after login.
- Verified frontend changes by running `npm run dev` and testing the login flow.

#### Testing
- Conducted end-to-end testing to ensure registration and login functionality.
- Verified database and API functionality with test scripts.
- Confirmed frontend UI updates after login.

---

**Last Updated**: March 23, 2026  
**Status**: ✅ All Build Issues Resolved - Development Ready  
**Next Action**: Deploy to staging or production
