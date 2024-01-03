#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run knex -- migrate:latest
npm run build