# Ski Teaching Assessment System API

簡化版單一 Repository 結構,專為 Zeabur 部署優化。

## 技術棧
- **框架**: NestJS
- **資料庫**: PostgreSQL + Prisma ORM
- **語言**: TypeScript
- **部署**: Zeabur

## 本地開發
```bash
# 安裝依賴
npm install

# 生成 Prisma Client
npm run db:generate

# 開發模式
npm run start:dev
```

## Zeabur 部署
1. 連接此 Repository 的 `zeabur-simple-structure` 分支
2. Build Command: `npm run build`
3. Start Command: `npm run start:prod`
4. 環境變數: `DATABASE_URL`

## 專案結構
```
├── src/              # NestJS 源碼
├── prisma/           # 資料庫 Schema
├── dist/             # Build 輸出 (gitignored)
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript 配置
```

部署成功後即可繼續專案開發。
