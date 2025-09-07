#!/bin/bash

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Debug: Show what's available
echo "🔍 Checking node_modules/.bin..."
ls -la node_modules/.bin/ | grep -E "(vite|esbuild)"

# Try different approaches to find and run vite
echo "🎨 Building client..."
if [ -f "node_modules/.bin/vite" ]; then
    echo "Using node_modules/.bin/vite"
    node_modules/.bin/vite build
elif [ -f "node_modules/vite/bin/vite.js" ]; then
    echo "Using node_modules/vite/bin/vite.js"
    node node_modules/vite/bin/vite.js build
else
    echo "Trying npm run build:client..."
    npm run build:client
fi

# Build server
echo "⚙️ Building server..."
if [ -f "node_modules/.bin/esbuild" ]; then
    echo "Using node_modules/.bin/esbuild"
    node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
elif [ -f "node_modules/esbuild/bin/esbuild" ]; then
    echo "Using node_modules/esbuild/bin/esbuild"
    node node_modules/esbuild/bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
else
    echo "Trying npm run build:server..."
    npm run build:server
fi

# Debug: Show what was created
echo "🔍 Checking dist directory..."
ls -la dist/ || echo "No dist directory found"

# Debug: Show current directory structure
echo "🔍 Current directory contents..."
ls -la

echo "✅ Build completed!"