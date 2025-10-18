# Water Sort Solver - Vercel Deployment Guide

This guide will help you deploy both the frontend (Next.js) and backend (Django) to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a GitHub repository
3. Vercel CLI installed (optional but recommended)

## Deployment Steps

### 1. Deploy Frontend (Next.js)

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (you'll get this after deploying the backend)

6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set root directory to current folder
# - Confirm build settings
```

### 2. Deploy Backend (Django)

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import the same GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements-vercel.txt`
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty

5. Add Environment Variables:
   ```
   DJANGO_SETTINGS_MODULE=backend.production_settings
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-backend-url.vercel.app
   FRONTEND_URLS=https://your-frontend-url.vercel.app
   ```

6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Navigate to backend directory
cd backend

# Deploy
vercel

# Follow the prompts and add environment variables
```

### 3. Update Frontend Environment Variables

After deploying the backend, you'll get a URL like `https://your-backend-name.vercel.app`. Update your frontend environment variables:

1. Go to your frontend project in Vercel dashboard
2. Go to Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to your backend URL
4. Redeploy the frontend

### 4. Database Setup (Optional)

For production, you might want to use a PostgreSQL database:

1. **Vercel Postgres** (Recommended):
   - Go to your backend project in Vercel
   - Go to Storage → Create Database → Postgres
   - Copy the connection string
   - Add `DATABASE_URL` environment variable

2. **External Database** (Railway, Supabase, etc.):
   - Create a PostgreSQL database
   - Add `DATABASE_URL` environment variable with connection string

## Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

### Backend
```env
DJANGO_SETTINGS_MODULE=backend.production_settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-backend-url.vercel.app
FRONTEND_URLS=https://your-frontend-url.vercel.app
DATABASE_URL=postgresql://user:password@host:port/database  # Optional
```

## Project Structure for Vercel

```
WaterSortSolver/
├── frontend/
│   ├── vercel.json          # Frontend Vercel config
│   ├── package.json
│   └── ...
├── backend/
│   ├── vercel.json          # Backend Vercel config
│   ├── requirements-vercel.txt
│   └── backend/
│       └── backend/
│           ├── settings.py
│           └── production_settings.py
└── ...
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `requirements-vercel.txt`
   - Ensure Python version compatibility
   - Check build logs in Vercel dashboard

2. **CORS Errors**:
   - Update `FRONTEND_URLS` environment variable
   - Check `CORS_ALLOWED_ORIGINS` in production settings

3. **Database Issues**:
   - Ensure `DATABASE_URL` is correctly formatted
   - Run migrations: `python manage.py migrate`

4. **Static Files**:
   - Vercel handles static files automatically for Django
   - No additional configuration needed

### Useful Commands

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Redeploy
vercel --prod

# Remove deployment
vercel remove [project-name]
```

## Security Considerations

1. **Secret Key**: Use a strong, unique secret key for production
2. **Debug Mode**: Always set `DEBUG=False` in production
3. **Allowed Hosts**: Only include your actual domain names
4. **CORS**: Restrict CORS origins to your frontend domains only
5. **HTTPS**: Vercel provides HTTPS by default

## Monitoring

- Use Vercel Analytics for performance monitoring
- Check Vercel dashboard for deployment status
- Monitor logs for errors and performance issues

## Cost Considerations

- Vercel has a generous free tier
- Frontend: Unlimited static deployments
- Backend: 100GB-hours of serverless function execution per month
- Additional usage is charged per GB-hour

## Next Steps

1. Set up custom domains (optional)
2. Configure CI/CD with GitHub Actions
3. Set up monitoring and alerting
4. Implement database backups
5. Add performance optimizations

For more information, visit the [Vercel Documentation](https://vercel.com/docs).
