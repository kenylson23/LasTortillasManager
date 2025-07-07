#!/bin/bash

# Build script para Vercel

echo "Building for Vercel deployment..."

# Instalar dependências se necessário
echo "Installing dependencies..."
npm ci

# Build do frontend usando npm run build
echo "Building frontend..."
npm run build

# Criar diretório de saída se não existir
mkdir -p dist/client

# Copiar arquivos do frontend para o diretório correto
echo "Copying frontend files..."
if [ -d "dist" ]; then
  cp -r dist/* dist/client/ 2>/dev/null || true
fi

echo "Build complete for Vercel!"