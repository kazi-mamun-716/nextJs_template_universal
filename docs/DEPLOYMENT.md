# Deployment Guide

> Instructions for deploying the Universal Next.js Boilerplate to various environments.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Manual Deployment](#manual-deployment)
- [Database Setup](#database-setup)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Maintenance](#maintenance)

---

## Prerequisites

Before deploying, ensure you have:

- **MongoDB** instance (Atlas, self-hosted, or Docker)
- **Auth.js secret** (generate with: `openssl rand -base64 32`)
- **Cloudinary account** (if using upload features)
- **Resend API key** (if using email features)
- **Domain name** (for production)

### Production Requirements

| Resource    | Minimum | Recommended |
| ----------- | ------- | ----------- |
| **CPU**     | 1 core  | 2+ cores    |
| **RAM**     | 512 MB  | 1 GB+       |
| **Node.js** | 20.x    | 20.x LTS    |
| **MongoDB** | 4.4     | 7.0+        |
| **Disk**    | 1 GB    | 5 GB+       |

---

## Environment Variables

### Core Variables

| Variable               | Required | Description                               |
| ---------------------- | -------- | ----------------------------------------- |
| `NEXT_PUBLIC_APP_URL`  | **Yes**  | Canonical URL (e.g., `https://myapp.com`) |
| `NEXT_PUBLIC_APP_NAME` | **Yes**  | Application display name                  |
| `MONGODB_URI`          | **Yes**  | MongoDB connection string                 |
| `AUTH_SECRET`          | **Yes**  | Auth.js secret (minimum 32 characters)    |
| `AUTH_URL`             | No       | Auth callback URL (defaults to APP_URL)   |

### Optional Variables

| Variable                            | Description                            |
| ----------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_APP_DESCRIPTION`       | Meta description for SEO               |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`                | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET`             | Cloudinary API secret                  |
| `RESEND_API_KEY`                    | Resend API key for emails              |
| `RESEND_FROM_EMAIL`                 | Sender email address                   |
| `ENCRYPTION_KEY`                    | Encryption key (minimum 32 characters) |
| `CSRF_SECRET`                       | CSRF token signing secret              |
| `AUTH_GOOGLE_ID`                    | Google OAuth client ID                 |
| `AUTH_GOOGLE_SECRET`                | Google OAuth client secret             |
| `AUTH_GITHUB_ID`                    | GitHub OAuth client ID                 |
| `AUTH_GITHUB_SECRET`                | GitHub OAuth client secret             |

### Feature Flag Overrides

Feature flags can be overridden via environment variables:

```
FEATURE_FLAG_RATE_LIMITING=true
FEATURE_FLAG_SOCIAL_LOGIN=false
FEATURE_FLAG_EMAIL_VERIFICATION=true
```

---

## Docker Deployment

### Development

```bash
# Start all services
docker compose up

# Start only MongoDB
docker compose up mongo
```

### Production

#### 1. Build the Image

```bash
docker build -t my-app:latest .
```

#### 2. Create `.env.production`

```
NEXT_PUBLIC_APP_URL=https://myapp.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/myapp
AUTH_SECRET=your-secure-secret-here
...
```

#### 3. Run the Container

```bash
docker run -d \
  --name my-app \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  my-app:latest
```

#### 4. With Docker Compose (Production)

Create `docker-compose.prod.yml`:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: my-app
    ports:
      - "3000:3000"
    env_file: .env.production
    restart: unless-stopped

  mongo:
    image: mongo:7
    container_name: my-app-mongo
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

```bash
docker compose -f docker-compose.prod.yml up -d
```

#### 5. Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name myapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myapp.com;

    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Vercel Deployment

### Prerequisites

- Vercel account (connected to GitHub)
- MongoDB Atlas cluster (or other MongoDB provider)

### Steps

#### 1. Push to GitHub

```bash
git push origin main
```

#### 2. Import Project in Vercel

- Go to [vercel.com](https://vercel.com)
- Click **Add New → Project**
- Import your GitHub repository
- Framework preset: **Next.js**

#### 3. Configure Environment Variables

Add all required variables in Vercel project settings:

```
NEXT_PUBLIC_APP_URL=https://myapp.vercel.app
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=...
AUTH_URL=https://myapp.vercel.app
```

#### 4. Deploy

Vercel will automatically deploy on every push to `main`.

### Important Notes for Vercel

- **Serverless Functions**: API routes and server actions run as serverless functions (max 10s timeout, 50MB response)
- **Edge Functions**: Middleware runs on the Edge runtime (limited Node.js APIs)
- **Standalone Output**: The Dockerfile includes `output: "standalone"`, but Vercel uses its own build process
- **Database Connection**: Use MongoDB Atlas; ensure IP whitelist includes `0.0.0.0/0` (or Vercel's IP ranges)
- **Environment Variables**: Must be configured in Vercel dashboard — `.env.local` is ignored

---

## Manual Deployment (VPS/Self-Hosted)

### 1. Build

```bash
npm ci --frozen-lockfile
npm run build
```

### 2. Start

```bash
npm run start
```

### 3. With Process Manager (PM2)

```bash
npm install -g pm2

# Start
pm2 start npm --name "my-app" -- start

# Save process list
pm2 save

# Enable startup
pm2 startup
```

### 4. Systemd Service

```ini
# /etc/systemd/system/my-app.service
[Unit]
Description=My App
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/my-app
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=/opt/my-app/.env.production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable my-app
sudo systemctl start my-app
```

---

## Database Setup

### MongoDB Atlas

1. Create a cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist IP addresses (use `0.0.0.0/0` for Vercel)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/myapp`

### Local MongoDB

```bash
# Docker
docker run -d \
  --name mongo \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7
```

### Seed Data

After connecting the database:

```bash
npm run db:seed
```

This creates initial data:

- Admin user (email: `admin@example.com`, password: `Admin123!`)
- Demo user (email: `user@example.com`, password: `User123!`)
- Sample categories and articles

---

## Post-Deployment Checklist

### Security

- [ ] HTTPS is enabled and redirects from HTTP
- [ ] Security headers are applied (CSP, HSTS, X-Frame-Options)
- [ ] `AUTH_SECRET` is strong and unique
- [ ] MongoDB is not publicly accessible without authentication
- [ ] Rate limiting is configured appropriately
- [ ] CSRF protection is enabled for API routes

### Performance

- [ ] Images are optimized (Next.js Image component)
- [ ] Static pages are cached where appropriate
- [ ] Database indexes are created (run `npm run db:seed` or manually)
- [ ] Response compression is enabled

### Monitoring

- [ ] Application health check at `/api/health`
- [ ] Error logging is configured
- [ ] Audit logging is enabled for sensitive actions

### SEO

- [ ] Sitemap at `/sitemap.xml` is accessible
- [ ] Robots.txt at `/robots.txt` is accessible
- [ ] Meta tags are present on all pages
- [ ] Canonical URLs are set correctly
- [ ] Structured data (JSON-LD) is valid

### Verification

- [ ] Homepage loads without errors
- [ ] Login/registration flow works
- [ ] Dashboard is accessible after login
- [ ] Protected routes redirect to login
- [ ] Email sending works (if configured)
- [ ] File uploads work (if configured)
- [ ] Dark mode toggle works
- [ ] 404 page displays for unknown routes
- [ ] Loading states appear during navigation
- [ ] Mobile responsive layout is correct

---

## Maintenance

### Updates

```bash
# Update dependencies
npm update

# Update Next.js
npm install next@latest

# Rebuild
npm run build
npm run start
```

### Backup

```bash
# MongoDB backup
mongodump --uri="$MONGODB_URI" --out=./backup/$(date +%Y-%m-%d)

# MongoDB restore
mongorestore --uri="$MONGODB_URI" --drop ./backup/2024-01-01
```

### Logs

```bash
# Docker logs
docker logs -f my-app

# PM2 logs
pm2 logs my-app

# Journalctl (systemd)
journalctl -u my-app -f
```

### Health Check

The application exposes a health endpoint:

```bash
curl https://myapp.com/api/health

# Response:
# { "success": true, "message": "OK", "data": { "status": "healthy", "uptime": 12345, "database": "connected" } }
```

---

## Troubleshooting

### Common Issues

| Issue                             | Solution                                                  |
| --------------------------------- | --------------------------------------------------------- |
| **MongoDB connection refused**    | Check MongoDB URI, IP whitelist, and network connectivity |
| **Auth.js callbacks not working** | Verify `AUTH_URL` matches the deployment URL              |
| **Images not loading**            | Check Cloudinary credentials and remote pattern config    |
| **Emails not sending**            | Verify Resend API key and sender email                    |
| **Rate limiting too strict**      | Adjust limits in `src/config/security.ts`                 |
| **CSP blocking resources**        | Update CSP directives in `src/config/security.ts`         |

### Getting Help

- Check existing documentation in `docs/`
- Open a GitHub issue for bugs or feature requests
- Review Next.js deployment docs: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
