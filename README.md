# Ski Teaching Assessment System API

簡化版單一 Repository 結構，專為 Zeabur 部署優化。

## 🚀 專案狀態

- ✅ 本地建置和測試通過
- ✅ 配置檔案驗證完成
- ✅ API 端點測試完成
- 🔄 準備部署到 Zeabur

## 技術棧

- **框架**: NestJS 10.x
- **資料庫**: PostgreSQL + Prisma ORM 5.22.0
- **語言**: TypeScript 5.1.3
- **測試**: Jest + Supertest
- **部署**: Zeabur
- **Node.js**: >= 18.0.0

## 本地開發

```bash
# 安裝依賴
npm install

# 生成 Prisma Client
npm run db:generate

# 開發模式
npm run start:dev

# 建置
npm run build

# 生產模式
npm run start:prod

# 執行測試
npm test

# 測試覆蓋率
npm run test:cov
```

## API 端點

### 基本端點

- `GET /` - 歡迎訊息
- `GET /health` - 健康檢查（包含資料庫連線狀態）

### 健康檢查回應範例

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2025-11-22T09:00:00.000Z",
  "env": "production"
}
```

## Zeabur 部署

詳細部署步驟請參考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### 快速部署

1. 建立 PostgreSQL Service
2. 建立 API Service（連接此 Repository）
3. 設定環境變數：
   - `DATABASE_URL`: PostgreSQL 連線字串
   - `NODE_ENV`: `production`
4. Build Command: `npm run build`
5. Start Command: `npm run start:prod`

## 專案結構

```
├── .kiro/                    # Kiro 配置和 specs
│   └── specs/
│       └── zeabur-deployment/  # 部署 spec
├── src/                      # NestJS 源碼
│   ├── main.ts              # 應用程式入口
│   ├── app.module.ts        # 根模組
│   └── app.controller.ts    # 基本控制器
├── prisma/                   # 資料庫 Schema
│   └── schema.prisma        # Prisma Schema
├── test/                     # 測試檔案
│   ├── config-validation.spec.ts  # 配置驗證測試
│   └── api-endpoints.spec.ts      # API 整合測試
├── dist/                     # Build 輸出 (gitignored)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript 配置
├── jest.config.js            # Jest 配置
└── zbpack.json               # Zeabur 配置
```

## 測試

### 配置檔案驗證

```bash
npm test -- test/config-validation.spec.ts
```

驗證項目：
- ✅ package.json scripts 正確
- ✅ Node.js 版本 >= 18
- ✅ Prisma Schema 包含 Linux binaryTargets
- ✅ zbpack.json 配置正確

### API 端點測試

```bash
npm test -- test/api-endpoints.spec.ts
```

測試項目：
- ✅ GET / 回傳歡迎訊息
- ✅ GET /health 回傳健康狀態
- ✅ 404 錯誤處理
- ✅ CORS 設定
- ✅ 回應時間 < 2 秒

## 環境變數

### 必要變數

- `DATABASE_URL`: PostgreSQL 連線字串
  ```
  postgresql://username:password@host:port/database
  ```

### 可選變數

- `PORT`: 應用程式監聽埠號（預設：3001，Zeabur 會自動注入）
- `NODE_ENV`: 執行環境（development/production）

## 開發原則

1. **Walking Skeleton**: 先部署再開發
2. **測試驅動**: 每個功能都要有測試
3. **資料結構優先**: 資料結構優先於程式碼
4. **增量交付**: 垂直切片，逐步交付

## 下一步

部署成功後的開發計畫：

### Phase 1: 基礎設施
- [ ] 建立 PrismaModule 和 PrismaService
- [ ] 擴展資料庫 Schema（根據 spec/erm.dbml）
- [ ] 建立資料種子（Seeding）

### Phase 2: 核心功能
- [ ] 席位認領 API
- [ ] 學生自評 API
- [ ] 教練評量 API
- [ ] 能力清單查詢 API

### Phase 3: 前端整合
- [ ] Next.js 前端專案
- [ ] UI 實作
- [ ] 整合測試

## 參考文件

- [部署指南](./DEPLOYMENT_GUIDE.md)
- [部署檢查清單](./DEPLOYMENT_CHECKLIST.md)
- [架構概覽](./docs/architecture-overview.md)
- [資料庫 Schema](./spec/erm.dbml)

## 授權

MIT

---

**最後更新**: 2025-11-22  
**版本**: 0.1.0  
**狀態**: 準備部署
