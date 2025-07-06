#!/bin/bash

# Build script para Vercel

echo "Building for Vercel deployment..."

# Build do frontend
echo "Building frontend..."
vite build

# Criar diretório de saída se não existir
mkdir -p dist/client

# Copiar arquivos do frontend
cp -r dist/* dist/client/

echo "Build complete for Vercel!"