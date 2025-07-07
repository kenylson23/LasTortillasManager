#!/bin/bash

# Build script para Vercel

echo "Building for Vercel deployment..."

# Build do frontend usando npx para garantir que os comandos sejam encontrados
echo "Building frontend..."
npx vite build

# Build do servidor usando npx
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete for Vercel!"