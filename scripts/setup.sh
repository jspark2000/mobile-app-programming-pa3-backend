#!/usr/bin/env bash

set -ex

# Check requirements: npm
if [ ! $(command -v npm) ]
then
  echo "Error: npm is not installed. Please install npm first."
  exit 1
fi

BASEDIR=$(dirname $(dirname $(realpath $0)))

cd $BASEDIR

# If .env does not exist, create one
if [ ! -f .env ]
then
  echo "FIREBASE_SERVICE_ACCOUNT_PATH=YOUR_JSON_FILE_PATH_HERE" >> .env
fi

# Install dependencies
npm install

# Enable git auto completion
if ! grep -q "bash-completion/completions/git" ~/.bashrc
then
  echo "source /usr/share/bash-completion/completions/git" >> ~/.bashrc
fi

# Setup Minio
npx ts-node scripts/setup-minio.ts

# Setup DynamoDB
npx ts-node scripts/setup-dynamodb.ts
