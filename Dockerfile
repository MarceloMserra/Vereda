FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Dependências
COPY package.json package-lock.json* ./
RUN npm ci
# Instala binário musl do SWC para Alpine Linux (não incluído no lock gerado no Windows)
RUN npm install --no-save @next/swc-linux-x64-musl

# Código fonte
COPY . .

# Variáveis necessárias no build (Prisma precisa de DATABASE_URL)
ENV DATABASE_URL=file:/tmp/build.db

# Gerar Prisma e build
RUN npx prisma generate
RUN npm run build

# Volume para o banco
RUN mkdir -p /app/data

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

CMD sh -c "npx prisma db push --skip-generate --accept-data-loss; npm start"
