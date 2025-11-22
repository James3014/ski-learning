FROM node:18-alpine

WORKDIR /app

# 安裝 OpenSSL 3
RUN apk add --no-cache openssl openssl-dev libc6-compat

# 設定 Prisma 環境變數
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

# 複製 package files
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴（不包含 dev dependencies）
RUN npm ci --omit=dev && npm cache clean --force

# 生成 Prisma Client（強制使用正確的 binary target）
RUN npx prisma generate

# 複製源碼
COPY . .

# 安裝 build 依賴並建置
RUN npm install @nestjs/cli typescript && npm run build && npm prune --production

# 暴露端口
EXPOSE 3000

# 啟動
CMD ["npm", "run", "start:prod"]
