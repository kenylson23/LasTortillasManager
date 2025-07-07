#!/bin/bash

# Simple build script for Vercel
echo "Starting build..."

# Build frontend
npx vite build

# Build server
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete!"