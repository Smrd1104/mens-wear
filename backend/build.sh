#!/bin/bash

# Exit immediately if a command fails
set -e

echo "🚧 Building frontend using pnpm..."
cd frontend
pnpm install
pnpm run build

echo "📦 Moving frontend build to root dist folder..."
rm -rf ../dist
mv dist ../dist

echo "📦 Installing backend dependencies..."
cd ../backend
pnpm install
