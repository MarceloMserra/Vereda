FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Código fonte
COPY . .

# Variáveis necessárias no build
ARG DATABASE_URL=file:/app/data/vereda.db
ARG OLLAMA_URL=https://ollama.cpisf.com.br
ENV DATABASE_URL=$DATABASE_URL
ENV OLLAMA_URL=$OLLAMA_URL

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
