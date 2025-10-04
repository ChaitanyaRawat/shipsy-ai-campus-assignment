# Vercel + Railway Deployment Guide

This guide explains how to deploy the frontend to Vercel and backend to Railway.

## Architecture Overview

- **Frontend**: Deployed to Vercel (static site hosting)
- **Backend**: Deployed to Railway (Node.js hosting)
- **Database**: PostgreSQL on Railway

## Backend Deployment (Railway)

### 1. Create Railway Account

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Create new project

### 2. Deploy Backend

1. Click "Deploy from GitHub repo"
2. Select your repository
3. Choose the backend directory
4. Railway will auto-detect Node.js

### 3. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create and connect the database automatically

### 4. Configure Environment Variables

In Railway dashboard, add these variables:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-production
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 5. Add Build and Start Commands

Create `railway.json` in backend directory:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Frontend Deployment (Vercel)

### 1. Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your project

### 2. Configure Project

1. Select your repository
2. Set Framework Preset: "Vite"
3. Set Root Directory: `frontend`
4. Override Build Command: `npm run build`
5. Override Output Directory: `dist`

### 3. Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```bash
VITE_API_URL=https://your-railway-app.railway.app/api
```

### 4. Deploy

1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Get your deployment URL

## Prisma Configuration for Railway

Update `backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ...rest of your schema
```

## Build Scripts Update

Update `backend/package.json`:

```json
{
  "scripts": {
    "build": "prisma generate",
    "start": "node src/server.js",
    "railway:build": "npm install && prisma generate && prisma migrate deploy"
  }
}
```

## Custom Domains (Optional)

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Railway Custom Domain
1. Go to Project Settings → Domains
2. Add custom domain
3. Configure CNAME record

## Environment Variables Summary

### Railway (Backend)
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-production-secret-key-32-chars-min
JWT_REFRESH_SECRET=your-production-refresh-secret-32-chars-min
NODE_ENV=production
FRONTEND_URL=https://expense-tracker.vercel.app
```

### Vercel (Frontend)
```bash
VITE_API_URL=https://expense-tracker-api.railway.app/api
```

## One-Click Deploy

### Deploy Backend to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

### Deploy Frontend to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/shipsy-project&project-name=expense-tracker&framework=vite&root-directory=frontend)

## Production Optimizations

### 1. Backend Optimizations

```javascript
// backend/src/server.js additions
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  
  // Enhanced security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
}
```

### 2. Frontend Optimizations

```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
```

## Monitoring and Analytics

### 1. Railway Monitoring
- Built-in metrics and logging
- Uptime monitoring
- Resource usage tracking

### 2. Vercel Analytics
- Core Web Vitals
- Page views and performance
- Error tracking

## Cost Estimation

### Railway
- **Hobby Plan**: $5/month (includes PostgreSQL)
- **Pro Plan**: $20/month (higher limits)

### Vercel
- **Hobby Plan**: Free (generous limits)
- **Pro Plan**: $20/month (team features)

**Total**: $5-40/month depending on usage

## Troubleshooting

### Common Issues

1. **CORS Errors**: Verify FRONTEND_URL in Railway
2. **Database Connection**: Check DATABASE_URL format
3. **Build Failures**: Ensure all dependencies are listed
4. **Environment Variables**: Double-check variable names

### Debug Commands

```bash
# Check Railway logs
railway logs --tail

# Check Vercel deployment logs
vercel logs your-deployment-url

# Test API health
curl https://your-railway-app.railway.app/api/health
```

## Security Best Practices

1. **Secrets Management**: Use Railway's secret management
2. **HTTPS Only**: Both platforms provide SSL by default
3. **Environment Isolation**: Use separate environments for staging/production
4. **Database Security**: Railway PostgreSQL includes SSL by default
5. **Rate Limiting**: Already implemented in the application

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Discord](https://discord.gg/railway)
- [Vercel Discord](https://discord.gg/vercel)
