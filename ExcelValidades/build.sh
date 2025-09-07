#!/bin/bash

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build client
echo "🎨 Building client..."
npm exec vite build

# Build server  
echo "⚙️ Building server..."
npm exec esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Build completed successfully!"