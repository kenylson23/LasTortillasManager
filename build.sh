#!/bin/bash

# Build client
echo "Building client..."
npm run vite:build

# Build server
echo "Building server..."
npx esbuild server/**/*.ts api/**/*.js --platform=node --format=esm --bundle --packages=external --outdir=dist/server --loader:.js=js --loader:.ts=ts

# Copy necessary files
echo "Copying files..."
cp -r dist/client/* dist/
cp package.json dist/
cp package-lock.json dist/

echo "Build complete!"