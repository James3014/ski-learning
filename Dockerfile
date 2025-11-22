FROM node:18-alpine

WORKDIR /app

# 安裝 OpenSSL 3 和其他必要套件
RUN apk add --no-cache openssl openssl-dev

# 複製 package files
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci

# 生成 Prisma Client
RUN npx prisma generate

# 複製源碼
COPY . .

# 建置
RUN npm run build

# 暴露端口
EXPOSE 3000

# 啟動
CMD ["npm", "run", "start:prod"]
