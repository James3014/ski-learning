FROM node:18-alpine

WORKDIR /app

# 安裝 OpenSSL 3
RUN apk add --no-cache openssl

# 複製 package files
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci --omit=dev

# 生成 Prisma Client
RUN npx prisma generate

# 複製源碼
COPY . .

# 安裝 build 依賴並建置
RUN npm install @nestjs/cli typescript && npm run build && npm prune --production

# 暴露端口
EXPOSE 3000

# 啟動
CMD ["npm", "run", "start:prod"]
