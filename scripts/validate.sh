#!/usr/bin/env bash
set -e

echo "Running linter..."
npm run lint

echo "Running client build..."
npm run build

echo "Running server build..."
npm run build --prefix server

echo "Validation passed successfully!"
