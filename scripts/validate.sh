#!/usr/bin/env bash
set -e

echo "Running linter..."
npm run lint

echo "Running typecheck and build..."
npm run build

echo "Validation passed successfully!"
