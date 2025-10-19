# 🚀 Deployment Guide

## Overview

This guide covers the complete deployment process for the Anoma AGI Operating System, from development setup to production deployment. The system is designed to be deployable on various platforms including traditional servers, containerized environments, and serverless platforms.

## Prerequisites

### System Requirements

**Minimum Requirements**:
- Node.js 18.0 or higher
- npm 8.0 or higher
- 2GB RAM
- 10GB disk space
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

**Recommended Requirements**:
- Node.js 20.0 or higher
- 4GB RAM
- 20GB disk space
- Multi-core CPU

### Development Tools

```bash
# Required tools
node --version  # Should be 18.0+
npm --version   # Should be 8.0+
git --version   # Should be 2.0+

# Optional but recommended
docker --version
docker-compose --version
```

## Development Deployment

### Local Development Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd anoma-agi-os
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

4. **Database Setup**
```bash
# Initialize database
npm run db:push

# (Optional) Seed database with sample data
npm run db:seed
```

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create `.env.local` with the following variables:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Authentication (NextAuth.js)
NEXTAUTH_SECRET="your-development-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
ZAI_API_KEY="your-zai-api-key"  # Optional for AI features

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_TERMINAL=true
NEXT_PUBLIC_ENABLE_FILESYSTEM=true

# Development Options
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_MOCK_API=false
```

## Production Deployment

### Build Process

1. **Install Production Dependencies**
```bash
npm ci --only=production
```

2. **Build Application**
```bash
npm run build
```

3. **Start Production Server**
```bash
npm start
```

### Production Environment Variables

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# AI Services
ZAI_API_KEY="your-production-zai-api-key"

# Security
NEXTAUTH_SECRET_INTERNAL="your-internal-secret"

# Monitoring
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_TERMINAL=true
NEXT_PUBLIC_ENABLE_FILESYSTEM=true

# Performance
NEXT_PUBLIC_CACHE_MAX_AGE=3600
```

## Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
COPY . .
RUN npm ci
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set permissions
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/anoma_os
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - ZAI_API_KEY=${ZAI_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=anoma_os
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Docker Commands

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Rebuild with no cache
docker-compose build --no-cache
```

## Cloud Platform Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy Application**
```bash
vercel --prod
```

4. **Environment Variables in Vercel Dashboard**
- Go to Vercel dashboard
- Select project
- Add environment variables
- Redeploy

### AWS Deployment

#### EC2 Deployment

1. **Launch EC2 Instance**
```bash
# Ubuntu 22.04 LTS
# t3.medium or larger
# Configure security groups (ports 80, 443, 22)
```

2. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <repository-url>
cd anoma-agi-os

# Install dependencies
npm ci

# Build application
npm run build
```

3. **PM2 Configuration**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'anoma-agi-os',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

4. **Start Application**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### AWS ECS Deployment

```yaml
# task-definition.json
{
  "family": "anoma-agi-os",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "anoma-agi-os",
      "image": "your-account.dkr.ecr.region.amazonaws.com/anoma-agi-os:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/anoma-agi-os",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Platform

#### Cloud Run Deployment

1. **Build and Push Container**
```bash
# Configure Docker
gcloud auth configure-docker

# Build image
docker build -t gcr.io/PROJECT-ID/anoma-agi-os .

# Push to registry
docker push gcr.io/PROJECT-ID/anoma-agi-os
```

2. **Deploy to Cloud Run**
```bash
gcloud run deploy anoma-agi-os \
  --image gcr.io/PROJECT-ID/anoma-agi-os \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

### Azure Deployment

#### Container Instances

```bash
# Create resource group
az group create --name anoma-agi-os --location eastus

# Deploy container
az container create \
  --resource-group anoma-agi-os \
  --name anoma-agi-os \
  --image your-registry/anoma-agi-os:latest \
  --cpu 1 \
  --memory 2 \
  --ports 3000 \
  --environment-variables \
    NODE_ENV=production \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET
```

## Database Deployment

### PostgreSQL Setup

#### Local PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE anoma_os;
CREATE USER anoma_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE anoma_os TO anoma_user;
\q
```

#### Cloud PostgreSQL

**AWS RDS**:
```bash
# Create RDS instance via AWS Console or CLI
aws rds create-db-instance \
  --db-instance-identifier anoma-os-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your_password \
  --allocated-storage 20
```

**Google Cloud SQL**:
```bash
# Create Cloud SQL instance
gcloud sql instances create anoma-os-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

### Database Migration

```bash
# Generate migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/anoma-agi-os
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
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

## Monitoring and Logging

### Application Monitoring

#### Sentry Integration

```bash
# Install Sentry
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

#### Custom Monitoring

```typescript
// lib/monitoring.ts
export class MonitoringService {
  static logError(error: Error, context?: any) {
    console.error('Application Error:', error, context)
    // Send to monitoring service
  }

  static logPerformance(metric: string, value: number) {
    console.log(`Performance: ${metric} = ${value}ms`)
    // Send to monitoring service
  }

  static trackEvent(event: string, properties?: any) {
    console.log('Event:', event, properties)
    // Send to analytics service
  }
}
```

### Log Management

#### Winston Logging

```bash
npm install winston
```

```typescript
// lib/logger.ts
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif']
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false
}

module.exports = nextConfig
```

### Caching Strategy

```typescript
// pages/api/system.ts
export async function GET() {
  const cacheKey = 'system-metrics'
  const cached = await redis.get(cacheKey)
  
  if (cached) {
    return NextResponse.json(JSON.parse(cached))
  }
  
  const data = await fetchSystemMetrics()
  await redis.setex(cacheKey, 5, JSON.stringify(data))
  
  return NextResponse.json(data)
}
```

## Security Hardening

### Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
  )
  
  return response
}
```

### Rate Limiting

```typescript
// lib/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})
```

## Backup and Recovery

### Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="anoma_os"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/anoma_os_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/anoma_os_$DATE.sql

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "anoma_os_*.sql.gz" -mtime +7 -delete
```

### Application Backup

```bash
# Backup application files
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Create application backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=logs \
  .
```

## Troubleshooting

### Common Issues

1. **Build Fails**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

2. **Database Connection Issues**:
```bash
# Check database status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U anoma_user -d anoma_os

# Reset database
npx prisma migrate reset
```

3. **Performance Issues**:
```bash
# Monitor resource usage
htop
iotop
df -h

# Check application logs
pm2 logs
tail -f logs/combined.log
```

### Health Checks

```typescript
// pages/api/health.ts
export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    // Check AI service
    const zai = await ZAI.create()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        ai: 'connected'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
```

## Deployment Checklist

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Security headers configured
- [ ] Monitoring and logging set up
- [ ] Backup procedures implemented
- [ ] Performance testing completed
- [ ] Security audit performed
- [ ] Documentation updated

### Post-deployment Checklist

- [ ] Application health check passing
- [ ] Monitoring alerts configured
- [ ] Load testing performed
- [ ] User acceptance testing
- [ ] Performance benchmarks recorded
- [ ] Security scan completed
- [ ] Backup verification
- [ ] Rollback plan tested

---

## 📚 Related Documentation

- [API Documentation](./API.md) - API endpoint reference
- [Architecture Documentation](./ARCHITECTURE.md) - System architecture
- [Component Documentation](./COMPONENTS.md) - Component reference
- [Developer Guide](./DEVELOPER.md) - Development workflows