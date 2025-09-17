#!/bin/bash

# Production build script for Angular Multi-Tenant App

echo "Building Angular Multi-Tenant Application for production..."

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist/

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run linting
echo "Running linting..."
npm run lint

# Run tests
echo "Running tests..."
npm run test -- --watch=false --browsers=ChromeHeadless

# Build for production
echo "Building for production..."
npm run build -- --configuration=production

# Generate source maps for debugging (optional)
echo "Generating source maps..."
npm run build -- --configuration=production --source-map

# Security audit
echo "Running security audit..."
npm audit --audit-level=moderate

# Bundle analysis (optional)
echo "Analyzing bundle size..."
npx webpack-bundle-analyzer dist/angular-multitenant-app/stats.json

echo "Production build completed!"
echo "Build output: dist/angular-multitenant-app/"