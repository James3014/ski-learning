# Ski Teaching Assessment System API

簡化版單一 Repository 結構，專為 Zeabur 部署優化。

## 🚀 專案狀態

- ✅ 部署到 Zeabur
- ✅ 資料庫遷移完成
- ✅ 程式碼重構完成（Clean Code + Linus 原則）
- ✅ API 端點實作完成
- ✅ 179 項能力清單完成
- ✅ Transaction 保證資料一致性

## 最新更新 (2025-11-23)

### Linus 原則重構完成
1. **資料結構優先**: 移除硬編碼 `resortId`，從資料關係取得
2. **消除特殊情況**: 移除所有 magic numbers 和硬編碼常數
3. **不破壞 userspace**: API 向後兼容，行為不變

詳細報告: [LINUS_REFACTOR_COMPLETE.md](./LINUS_REFACTOR_COMPLETE.md)

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

# 執行種子資料 (179 項能力)
npm run seed

# 開發模式
npm run start:dev

# 建置
npm run build

# 生產模式
npm run start:prod

# 執行測試
npm test
```

## API 端點

### 基本端點
- `GET /` - API 歡迎訊息
- `GET /health` - 健康檢查（包含資料庫連線狀態）

### 能力清單
- `GET /abilities` - 查詢能力清單 (179 項)
  - Query: `sportType` (ski | snowboard)
  - Query: `skillLevel` (1-5)
  - 回應: `{ total: number, data: Ability[] }`

### 席位管理
- `GET /seats/:code` - 根據邀請碼查詢席位
- `POST /seats/claim` - 認領席位 (使用 Transaction)
  - Body: `{ code: string, studentEmail: string }`
- `POST /seats/:id/identity` - 提交身份表單
  - Body: `{ studentDisplayName, birthDate, contactEmail, ... }`

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
├── seed.ts                 # 種子資料腳本 (179 項能力)
└── migrations/
    └── 20251122_init/
        └── migration.sql

test/
├── seats.integration.spec.ts      # 席位 API 整合測試
└── abilities.integration.spec.ts  # 能力 API 整合測試
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

### Linus 原則應用

1. **資料結構優先**
   - `resortId` 從 `lesson` 關係取得，不是硬編碼
   - 完整的 179 項能力資料結構
   - Transaction 保證資料一致性

2. **消除特殊情況**
   - 移除 `DEFAULT_RESORT_ID` 常數
   - 統一的能力資料格式
   - 統一的錯誤處理機制

3. **不破壞 Userspace**
   - API 端點不變
   - 回應格式不變
   - 資料庫 Schema 向後兼容

## 資料模型

### 核心表結構
- `Resort` - 雪場資訊
- `Instructor` - 教練資訊
- `Lesson` - 課程資訊
- `OrderSeat` - 席位資訊
- `SeatInvitation` - 邀請碼
- `GlobalStudent` - 學生資訊
- `StudentMapping` - 學生與雪場的映射
- `SeatIdentityForm` - 身份表單
- `AbilityCatalog` - 能力清單 (179 項)
- `GuardianRelationship` - 監護人關係

### 能力清單結構
- **總計**: 179 項能力
- **SKI**: 5 個級別，每級別 10-20 項技能
- **SNOWBOARD**: 5 個級別，每級別 10-20 項技能
- **分類**: 基礎滑行、轉彎技術、進階技術、高級技術、專家技術

## 環境變數

### 必要變數
- `DATABASE_URL`: Prisma Accelerate 連線字串
- `DIRECT_URL`: PostgreSQL 直連字串

### 可選變數
- `PORT`: 應用程式監聽埠號（預設：3001）
- `NODE_ENV`: 執行環境（development/production）

## 測試

### 整合測試
```bash
# 執行所有測試
npm test

# 監看模式
npm run test:watch

# 測試覆蓋率
npm run test:cov
```

### 測試覆蓋
- ✅ 席位查詢 (有效/無效代碼)
- ✅ 席位認領 (Transaction, resortId 驗證)
- ✅ 身份表單提交 (欄位驗證)
- ✅ 能力清單查詢 (篩選、排序、驗證)

## 部署

### Zeabur 部署
1. 連接 GitHub Repository
2. 設定環境變數 (`DATABASE_URL`, `DIRECT_URL`)
3. 自動部署 (每次 push 到 `zeabur-simple-structure`)

### 部署後驗證
```bash
# 健康檢查
curl https://your-app.zeabur.app/health

# 能力清單總數
curl https://your-app.zeabur.app/abilities | jq '.total'
# 預期: 179

# 席位查詢
curl https://your-app.zeabur.app/seats/INVITE100
```

## 文件

- [Linus 重構完成報告](./LINUS_REFACTOR_COMPLETE.md)
- [驗收清單](./ACCEPTANCE_CHECKLIST.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)

## 授權

MIT

---

**最後更新**: 2025-11-23  
**版本**: 0.3.0  
**狀態**: 生產環境運行中 + Linus 原則重構完成

