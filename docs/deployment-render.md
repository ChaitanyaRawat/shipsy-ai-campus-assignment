# Render Deployment Guide

This guide explains how to deploy the Expense Tracker application to Render.

## Prerequisites

1. GitHub repository with your code
2. Render account (free tier available)
3. PostgreSQL database (Render provides free tier)

## Backend Deployment

### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - Name: `expense-tracker-db`
   - Database: `expense_tracker`
   - User: `expense_user`
   - Region: Choose closest to your users
   - PostgreSQL Version: 15
   - Plan: Free (or paid for production)

4. After creation, note down:
   - Internal Database URL
   - External Database URL

### 2. Deploy Backend Service

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - Name: `expense-tracker-api`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
   - Plan: Free (or paid for production)

4. Add Environment Variables:
   ```
   DATABASE_URL=<your-postgresql-internal-url>
   JWT_SECRET=your-super-secret-jwt-key-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-production
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```

5. Deploy and wait for completion

### 3. Update Prisma Schema for PostgreSQL

Update `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

## Frontend Deployment

### 1. Deploy Frontend Service

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - Name: `expense-tracker-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

5. Deploy and wait for completion

## Environment Variables Summary

### Backend (.env)
```bash
DATABASE_URL="postgresql://expense_user:password@host:port/expense_tracker"
JWT_SECRET="your-super-secret-jwt-key-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-production"
NODE_ENV="production"
PORT="3001"
FRONTEND_URL="https://your-frontend-app.onrender.com"
```

### Frontend (.env)
```bash
VITE_API_URL="https://your-backend-app.onrender.com/api"
```

## Post-Deployment Steps

1. **Database Migration**: Render will automatically run migrations during build
2. **SSL**: Render provides SSL certificates automatically
3. **Custom Domain** (Optional): Configure in Render dashboard
4. **Monitoring**: Use Render's built-in monitoring or integrate external services

## Production Considerations

1. **Database Backups**: Configure automated backups
2. **Environment Secrets**: Use Render's secret management
3. **Scaling**: Upgrade to paid plans for auto-scaling
4. **CDN**: Consider using a CDN for static assets
5. **Monitoring**: Set up application monitoring and alerts

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is correct
2. **CORS Issues**: Verify FRONTEND_URL in backend environment
3. **Build Failures**: Check build logs for missing dependencies
4. **Migration Errors**: Ensure Prisma schema matches database

### Useful Commands

```bash
# Check service status
curl https://your-backend-app.onrender.com/api/health

# View logs (in Render dashboard)
# Navigate to your service → Logs tab

# Manual database migration (if needed)
npx prisma migrate deploy
```

## Cost Estimation

### Free Tier Limits
- Backend: 512MB RAM, sleeps after 15min inactivity
- Database: 1GB storage, 97 connection limit
- Frontend: Static site hosting

### Paid Plans (Starting prices)
- Backend: $7/month for always-on service
- Database: $7/month for 1GB with backups
- Total: ~$14/month for production setup

## Security Notes

1. Use strong, unique secrets for JWT tokens
2. Enable database SSL in production
3. Configure proper CORS origins
4. Use environment variables for all secrets
5. Enable Render's DDoS protection

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check application logs in Render dashboard for debugging
