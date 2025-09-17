# Security Configuration for Angular Multi-Tenant App

## Content Security Policy (CSP)
# Add to your server configuration or nginx.conf

# Strict CSP for production
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.yourdomain.com https://identity.yourdomain.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';

## Security Headers
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains

## CORS Configuration
# For your API server
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400

## Authentication Security
# JWT Configuration
JWT_SECRET: your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN: 15m
JWT_REFRESH_EXPIRES_IN: 7d

# Token Storage
# Use HTTP-only cookies for refresh tokens
# Store access tokens in memory only
# Never store sensitive tokens in localStorage

## Database Security
# Use connection pooling
# Enable SSL connections
# Use parameterized queries
# Implement proper access controls

## API Security
# Rate limiting: 100 requests per minute per IP
# Input validation and sanitization
# SQL injection prevention
# XSS protection
# CSRF protection

## Monitoring and Logging
# Log all authentication attempts
# Monitor for suspicious activity
# Set up alerts for failed logins
# Regular security audits

## Backup and Recovery
# Encrypted backups
# Regular backup testing
# Disaster recovery plan
# Version control for configurations

## Environment Variables
# Never commit secrets to version control
# Use environment-specific configurations
# Rotate secrets regularly
# Use secret management tools

## Production Checklist
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Enable security monitoring
- [ ] Configure proper logging
- [ ] Set up automated backups
- [ ] Enable security scanning
- [ ] Configure firewall rules
- [ ] Set up intrusion detection
- [ ] Regular security updates