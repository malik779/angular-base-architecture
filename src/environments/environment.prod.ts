export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  identityUrl: 'https://identity.yourdomain.com',
  clientId: 'angular-multitenant-app',
  tenantMode: true,
  features: {
    orders: true,
    products: true,
    admin: true,
    reports: true,
    analytics: true
  },
  theme: {
    primary: '#3f51b5',
    secondary: '#ff4081'
  },
  version: '1.0.0'
};