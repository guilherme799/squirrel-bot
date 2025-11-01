# Etapa 1: build
FROM node:lts-alpine AS builder


RUN apk update && \
    apk add ffmpeg

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o código-fonte
COPY . .

# Compila o TypeScript
RUN npm run build

# Etapa 2: runtime
FROM node:lts-alpine

WORKDIR /app

# Copia apenas o build e dependências de runtime
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Porta (se seu app expõe algo)
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
