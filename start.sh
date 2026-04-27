#!/bin/sh
set -e

# Cria diretório de dados se não existir
mkdir -p /app/data

# Roda migrations/push do banco
npx prisma db push --skip-generate

# Inicia o servidor
node server.js
