FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Código fonte
COPY . .

# Gerar Prisma e build
RUN npx prisma generate
RUN npm run build

# Volume para o banco
RUN mkdir -p /app/data

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

CMD sh -c "npx prisma db push --skip-generate 2>/dev/null; npm start"
