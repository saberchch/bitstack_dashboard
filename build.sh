#!/usr/bin/env bash
set -o errexit

echo "==> Installing Python dependencies"
pip install -r requirements.txt

echo "==> Building React frontend"
cd frontend
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
npm run build
cd ..

echo "==> Frontend build complete ($(ls -la frontend/dist/index.html)"
