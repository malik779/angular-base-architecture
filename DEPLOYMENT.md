# Deployment Guide - Angular Multi-Tenant App

## Prerequisites

- Node.js 18+
- Docker (optional)
- Nginx (for production)
- SSL Certificate (for HTTPS)

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:4200`

### 3. Run Tests
```bash
# Unit tests
npm run test

# Tests with coverage
npm run test:coverage

# CI tests (headless)
npm run test:ci
```

### 4. Linting
```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## Production Build

### 1. Build for Production
```bash
npm run build:prod
```

### 2. Analyze Bundle Size
```bash
npm run build:stats
npm run analyze
```

### 3. Security Audit
```bash
npm run audit
npm run audit:fix
```

## Docker Deployment

### 1. Build Docker Image
```bash
npm run docker:build
```

### 2. Run Docker Container
```bash
npm run docker:run
```

### 3. Docker Compose (Recommended)
```bash
# Start services
npm run docker:compose

# Build and start services
npm run docker:compose:build
```

## Manual Deployment

### 1. Build Application
```bash
npm run build:prod
```

### 2. Configure Nginx
Copy the `nginx.conf` file to your server and update the configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist/angular-multitenant-app;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Handle Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Configure Runtime Environment
Create `/assets/runtime-config.json` with your production settings:

```json
{
  "apiBaseUrl": "https://api.yourdomain.com",
  "identityServerUrl": "https://identity.yourdomain.com",
  "clientId": "angular-multitenant-app",
  "tenantMode": true,
  "features": {
    "orders": true,
    "products": true,
    "admin": true,
    "reports": true,
    "analytics": true
  },
  "theme": {
    "primary": "#3f51b5",
    "secondary": "#ff4081"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

## Environment Configuration

### Development
- API URL: `http://localhost:3000/api`
- Identity Server: `http://localhost:5000`
- Tenant Mode: `true`
- Features: All enabled

### Production
- API URL: `https://api.yourdomain.com`
- Identity Server: `https://identity.yourdomain.com`
- Tenant Mode: `true`
- Features: Configured per tenant

## Security Configuration

### 1. Content Security Policy
Add CSP headers to your server configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com;
```

### 2. HTTPS Configuration
Ensure HTTPS is properly configured with valid SSL certificates.

### 3. Authentication Security
- Use HTTP-only cookies for refresh tokens
- Store access tokens in memory only
- Implement proper token rotation
- Set appropriate token expiration times

## Monitoring and Logging

### 1. Application Monitoring
- Set up error tracking (Sentry, Bugsnag)
- Monitor performance metrics
- Track user analytics

### 2. Server Monitoring
- Monitor server resources
- Set up alerts for failures
- Track response times

### 3. Security Monitoring
- Monitor authentication attempts
- Track suspicious activity
- Set up intrusion detection

## Backup and Recovery

### 1. Application Backups
- Regular backups of configuration files
- Version control for all changes
- Document deployment procedures

### 2. Database Backups
- Automated daily backups
- Test restore procedures
- Off-site backup storage

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration

3. **Performance Issues**
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets

4. **Authentication Issues**
   - Verify token storage
   - Check token expiration
   - Validate API endpoints

### Debug Mode
Enable debug mode by setting `environment.debug = true` in your configuration.

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Run security audits
- [ ] Monitor performance metrics
- [ ] Review and update configurations
- [ ] Test backup and recovery procedures

### Version Updates
- [ ] Test in staging environment
- [ ] Update documentation
- [ ] Notify users of changes
- [ ] Monitor for issues post-deployment

## Support

For technical support or questions:
- Check the README.md for documentation
- Review SECURITY.md for security guidelines
- Check GitHub issues for known problems
- Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.