#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Use portable node runtime if node is not found in PATH
if ! command -v node >/dev/null 2>&1; then
  if [ -d "$DIR/.node_runtime/bin" ]; then
    export PATH="$DIR/.node_runtime/bin:$PATH"
  fi
fi

echo "=========================================================="
echo " Starting Mobi Global Payments Operations Platform"
echo " Node version: $(node -v)"
echo " npm version:  $(npm -v)"
echo " Local URL:    http://localhost:3000"
echo "=========================================================="

npm run dev

