# Ski Teaching Assessment System API

簡化版單一 Repository 結構，專為 Zeabur 部署優化。

## 🚀 專案狀態

- ✅ 部署到 Zeabur
- ✅ 資料庫遷移完成
- ✅ 程式碼重構完成（Clean Code 原則）
- ✅ API 端點實作完成

## 技術棧

- **框架**: NestJS 10.x
- **資料庫**: PostgreSQL + Prisma ORM 5.22.0
- **驗證**: class-validator + class-transformer
- **語言**: TypeScript 5.1.3
- **部署**: Zeabur
- **Node.js**: >= 18.0.0

## 本地開發

```bash
# 安裝依賴
npm install

# 生成 Prisma Client
npm run db:generate

# 執行資料庫遷移
npm run migrate

# 執行種子資料
npm run seed

# 開發模式
npm run start:dev

# 建置
npm run build

# 生產模式
npm run start:prod
```

## API 端點

### 基本端點
- `GET /` - API 歡迎訊息
- `GET /health` - 健康檢查（包含資料庫連線狀態）

### 能力清單
- `GET /abilities` - 查詢能力清單
  - Query: `sportType` (ski | snowboard)
  - Query: `skillLevel` (1-5)

### 席位管理
- `GET /seats/:code` - 根據邀請碼查詢席位
- `POST /seats/claim` - 認領席位
- `POST /seats/:id/identity` - 提交身份表單

## 專案結構

```
src/
├── abilities/              # 能力清單功能
│   ├── abilities.controller.ts
│   └── abilities.dto.ts
├── seats/                  # 席位管理功能
│   ├── seats.controller.ts
│   └── seats.dto.ts
├── database/               # 資料庫模組
│   ├── database.module.ts
│   └── prisma.service.ts
├── common/                 # 共用模組
│   ├── constants.ts
│   ├── dto/
│   │   └── response.dto.ts
│   └── filters/
│       └── http-exception.filter.ts
├── app.module.ts
├── app.controller.ts
└── main.ts

prisma/
├── schema.prisma
├── seed.ts                 # 種子資料腳本
└── migrations/
    └── 20251122_init/
        └── migration.sql
```

## 重構改進

### Clean Code 原則應用

1. **單一職責原則**
   - 移除混合職責的 MigrationController
   - 將 seed 邏輯獨立為 script
   - 按功能分離 controllers

2. **依賴注入**
   - 建立 DatabaseModule 統一管理
   - 使用 @Global() 避免重複 import

3. **輸入驗證**
   - 所有 API 使用 DTO + class-validator
   - 全域 ValidationPipe 自動驗證

4. **錯誤處理**
   - 統一的 HttpExceptionFilter
   - 標準化錯誤訊息常數

5. **程式碼清理**
   - 移除 magic numbers
   - 移除診斷端點
   - 改善變數命名

## 環境變數

### 必要變數
- `DATABASE_URL`: Prisma Accelerate 連線字串
- `DIRECT_URL`: PostgreSQL 直連字串

### 可選變數
- `PORT`: 應用程式監聽埠號（預設：3001）
- `NODE_ENV`: 執行環境（development/production）

## 授權

MIT

---

**最後更新**: 2025-11-23  
**版本**: 0.2.0  
**狀態**: 生產環境運行中
