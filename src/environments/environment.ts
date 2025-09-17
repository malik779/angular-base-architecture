export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  identityUrl: 'http://localhost:5000',
  clientId: 'angular-multitenant-app',
  tenantMode: true,
  features: {
    orders: true,
    products: true,
    admin: true,
    reports: false,
    analytics: false
  },
  theme: {
    primary: '#3f51b5',
    secondary: '#ff4081'
  },
  version: '1.0.0'
};