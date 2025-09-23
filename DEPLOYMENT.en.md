# Deployment Guide - FOS Face Over-filling Syndrome Consultation App

This document provides detailed instructions for deploying and using the FOS application in different environments.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Local Development Deployment](#local-development-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Troubleshooting](#troubleshooting)
- [Maintenance Guide](#maintenance-guide)

## 🔧 System Requirements

### Minimum Requirements
- **Node.js**: >= 16.0.0 (Recommended 18.0.0+)
- **npm**: >= 7.0.0 or **yarn**: >= 1.22.0
- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Memory**: Minimum 2GB RAM (Recommended 4GB+)
- **Disk Space**: Minimum 1GB available space

### Recommended Configuration
- **Node.js**: 18.x LTS or 20.x LTS
- **Package Manager**: npm 9.x or yarn 3.x
- **Memory**: 8GB+ RAM
- **CPU**: 4 cores or more

## 🖥️ Local Development Deployment

### Step 1: Clone the Project
```bash
git clone https://github.com/sooogooo/webapp-fos.git
cd webapp-fos
```

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Configure Environment Variables
```bash
# Copy environment variables example file
cp .env.local.example .env.local

# Edit environment variables file
nano .env.local  # or use your preferred editor
```

Set the following variables in the `.env.local` file:
```env
# Gemini AI API Key (Required)
API_KEY=your_gemini_api_key_here

# Optional Configuration
VITE_APP_TITLE=Face Over-filling Syndrome AI Consultation
VITE_APP_VERSION=1.0.0
```

### Step 4: Start Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`.

### Step 5: Verify Installation
Visit `http://localhost:5173` and check:
- [ ] Page loads correctly
- [ ] AI chat functionality works properly
- [ ] Responsive design displays correctly on different devices

## 🌐 Production Deployment

### Method 1: Traditional Web Server Deployment

#### Step 1: Build Production Version
```bash
npm run build
```

After building, production files will be generated in the `dist/` directory.

#### Step 2: Configure Web Server

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/webapp-fos/dist;
    index index.html;

    # Handle single page application routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static resource caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Apache Configuration Example:**
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/webapp-fos/dist
    ServerName your-domain.com
    
    # Enable rewrite module for single page application
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
    
    # Static resource caching
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

### Method 2: Using Preview Server
```bash
npm run preview
```

## 🐳 Docker Deployment

### Create Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Create docker-compose.yml
```yaml
version: '3.8'

services:
  webapp-fos:
    build: .
    ports:
      - "80:80"
    environment:
      - API_KEY=${API_KEY}
    restart: unless-stopped
    volumes:
      - ./logs:/var/log/nginx
```

### Deployment Commands
```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ Cloud Platform Deployment

### Vercel Deployment
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Set `API_KEY` in environment variables
5. Deploy

### Netlify Deployment
1. Build project: `npm run build`
2. Visit [netlify.com](https://netlify.com)
3. Drag and drop `dist` folder to deployment area
4. Configure environment variables in settings

### AWS/Google Cloud/Azure Deployment
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 process manager
npm install -g pm2

# Clone and deploy project
git clone https://github.com/sooogooo/webapp-fos.git
cd webapp-fos
npm install
npm run build

# Use PM2 to start service (requires static file server configuration)
# Or configure Nginx as reverse proxy
```

## 🔐 Environment Variables Configuration

### Required Variables
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `API_KEY` | Gemini AI API Key | `AIzaSyC...` |

### Optional Variables
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_APP_TITLE` | Application Title | `Face Over-filling Syndrome AI Consultation` |
| `VITE_APP_VERSION` | Application Version | `1.0.0` |

### Getting Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Register/login to Google account
3. Create new API key
4. Add key to `.env.local` file

## 🔍 Troubleshooting

### Common Issues

#### 1. API Key Error
**Problem**: AI chat functionality not working, showing "AI service not initialized"
**Solution**:
- Check if `.env.local` file exists
- Verify API key format is correct
- Ensure API key is valid and not expired

#### 2. Dependency Installation Failed
**Problem**: `npm install` fails
**Solution**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Build Failed
**Problem**: `npm run build` fails
**Solution**:
- Check TypeScript errors: `npm run type-check`
- Ensure all dependencies are correctly installed
- Check environment variable configuration

#### 4. Port Conflict
**Problem**: Port 5173 is occupied
**Solution**:
```bash
# Start with different port
npm run dev -- --port 3000
```

### Performance Optimization

#### 1. Enable Gzip Compression
Enable gzip compression in server configuration to reduce transfer size.

#### 2. Static Resource Caching
Configure long-term caching strategy for static resources (CSS, JS, images).

#### 3. CDN Configuration
Host static resources on CDN to improve loading speed.

## 🛠️ Maintenance Guide

### Daily Maintenance
- Regularly check application logs
- Monitor API usage
- Backup important configuration files

### Update Process
```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart service
# (depends on deployment method)
```

### Backup Strategy
- Regularly backup environment variable files
- Backup custom configurations
- Backup user data (if any)

### Monitoring Recommendations
- Set up server monitoring alerts
- Monitor API call frequency and costs
- Set up error log monitoring

## 📞 Technical Support

If you encounter technical issues, please:
1. Check the troubleshooting guide above
2. Check GitHub Issues page
3. Contact technical support: bccsw@cqlhlg.work

---

**Note**: This application is for educational and demonstration purposes only. Before using in production, please ensure you follow relevant security best practices.