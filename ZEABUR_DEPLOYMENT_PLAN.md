# Zeabur 部署完整規劃

## 📋 專案現況分析

### 當前狀態
- ✅ 簡化版 NestJS 專案結構 (非 Monorepo)
- ✅ Prisma ORM + PostgreSQL
- ✅ 基本 API 端點 (/, /health)
- ✅ 本地 build 測試通過
- ⚠️ Zeabur 部署失敗 (需要重新規劃)

### 專案結構
```
評量2/
├── src/                 # NestJS 源碼
├── prisma/              # 資料庫 Schema
├── dist/                # Build 輸出
├── package.json         # 依賴管理
├── zbpack.json          # Zeabur 配置
└── tsconfig.json        # TypeScript 配置
```

---

## 🔍 Zeabur 部署常見問題研究

### 問題 1: Port 綁定錯誤
**症狀**: 應用啟動但無法訪問
**原因**: Zeabur 使用動態 PORT 環境變數
**解決方案**: 
```typescript
// main.ts 需要改為
const port = process.env.PORT || 3001;
await app.listen(port, '0.0.0.0');
```

### 問題 2: Prisma Client 未生成
**症狀**: `@prisma/client` 找不到
**原因**: Build 階段未執行 `prisma generate`
**解決方案**: 
```json
// package.json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma generate && nest build"
}
```

### 問題 3: DATABASE_URL 未設定
**症狀**: 資料庫連線失敗
**原因**: 環境變數未正確注入
**解決方案**: 在 Zeabur 控制台設定環境變數

### 問題 4: Node 版本不匹配
**症狀**: Build 失敗或執行時錯誤
**原因**: Zeabur 預設 Node 版本可能不符
**解決方案**: 
```json
// package.json
"engines": {
  "node": ">=18.0.0"
}
```

### 問題 5: 依賴安裝失敗
**症狀**: npm install 錯誤
**原因**: package-lock.json 與 package.json 不同步
**解決方案**: 重新生成 lock 檔案

---

## 🎯 部署前檢查清單

### 1. 程式碼修正
- [ ] 修正 main.ts 的 PORT 綁定
- [ ] 確保 Prisma Client 在 build 時生成
- [ ] 添加 postinstall script
- [ ] 確認所有依賴都在 dependencies (非 devDependencies)

### 2. 配置檔案
- [ ] 檢查 package.json scripts
- [ ] 檢查 zbpack.json 設定
- [ ] 確認 .gitignore 正確 (不要 commit dist/)
- [ ] 確認 tsconfig.json 輸出設定

### 3. 資料庫設定
- [ ] 在 Zeabur 建立 PostgreSQL Service
- [ ] 取得 DATABASE_URL
- [ ] 設定環境變數
- [ ] 測試連線

### 4. 環境變數
必要的環境變數:
```
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=自動注入 (不需手動設定)
```

---

## 📝 實作步驟

### Step 1: 修正程式碼

#### 1.1 修正 main.ts
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    
    // Zeabur 使用動態 PORT
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    
    console.log(`Application is running on port ${port}`);
}
bootstrap();
```

#### 1.2 修正 package.json
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && nest build",
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  }
}
```

#### 1.3 優化 Prisma Schema
確保 binaryTargets 包含 Linux:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}
```

#### 1.4 改善 app.controller.ts
```typescript
import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller()
export class AppController {
    private prisma = new PrismaClient();

    @Get()
    getHello(): string {
        return 'Hello World from NestJS!';
    }

    @Get('health')
    async getHealth(): Promise<any> {
        try {
            await this.prisma.$connect();
            await this.prisma.$disconnect();
            return { 
                status: 'ok', 
                db: 'connected',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { 
                status: 'error', 
                db: 'disconnected', 
                error: error.message 
            };
        }
    }
}
```

### Step 2: 更新 zbpack.json
```json
{
    "build_command": "npm install && npm run build",
    "start_command": "npm run start:prod",
    "install_command": "npm install",
    "node_version": "18"
}
```

### Step 3: Zeabur 控制台設定

#### 3.1 建立 PostgreSQL Service
1. 進入 Zeabur Dashboard
2. 點擊 "Add Service" → "Database" → "PostgreSQL"
3. 等待部署完成
4. 複製 DATABASE_URL

#### 3.2 建立 API Service
1. 點擊 "Add Service" → "Git"
2. 選擇 Repository
3. 選擇分支 (建議: `main` 或 `zeabur-simple-structure`)
4. 等待自動偵測框架

#### 3.3 設定環境變數
在 API Service 的 "Variables" 頁面:
```
DATABASE_URL = <從 PostgreSQL Service 複製>
NODE_ENV = production
```

#### 3.4 設定 Build & Start
- Build Command: `npm run build`
- Start Command: `npm run start:prod`
- Port: 自動偵測 (不需設定)

### Step 4: 部署與驗證

#### 4.1 觸發部署
- 方式 1: 在 Zeabur 點擊 "Redeploy"
- 方式 2: Push 新 commit 到 GitHub

#### 4.2 監控部署日誌
查看以下關鍵訊息:
```
✓ npm install 成功
✓ prisma generate 執行
✓ nest build 完成
✓ Application is running on port XXXX
```

#### 4.3 驗證端點
```bash
# 基本端點
curl https://<your-domain>/

# 健康檢查
curl https://<your-domain>/health
```

預期回應:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2025-11-22T03:23:47.274Z"
}
```

---

## 🐛 故障排除

### 問題 A: Build 失敗
**檢查項目**:
1. 查看 Build Log 的錯誤訊息
2. 確認 package.json 的 scripts 正確
3. 確認 TypeScript 編譯無誤
4. 本地執行 `npm run build` 測試

**常見錯誤**:
```
Error: Cannot find module '@prisma/client'
→ 解決: 確保 postinstall script 存在

Error: TypeScript compilation failed
→ 解決: 檢查 tsconfig.json 和程式碼語法
```

### 問題 B: 啟動失敗
**檢查項目**:
1. 查看 Runtime Log
2. 確認 PORT 綁定正確
3. 確認 DATABASE_URL 已設定
4. 確認 dist/ 目錄有檔案

**常見錯誤**:
```
Error: listen EADDRINUSE
→ 解決: 使用 process.env.PORT

Error: Can't reach database server
→ 解決: 檢查 DATABASE_URL 格式和網路連線
```

### 問題 C: 資料庫連線失敗
**檢查項目**:
1. DATABASE_URL 格式正確
2. PostgreSQL Service 正在運行
3. 網路連線正常
4. Prisma Client 已生成

**測試方法**:
```bash
# 在本地測試連線
DATABASE_URL="<zeabur-url>" npm run db:push
```

---

## 📊 部署後維護

### 監控指標
- [ ] API 回應時間
- [ ] 資料庫連線狀態
- [ ] 錯誤率
- [ ] 記憶體使用量

### 日誌管理
- 在 Zeabur 查看 Runtime Logs
- 設定 Log Level (production 使用 warn/error)
- 考慮整合第三方日誌服務 (如 Sentry)

### 資料庫維護
- 定期備份 (Zeabur 自動備份)
- 執行 Migration: `npm run db:push`
- 監控資料庫大小

---

## 🚀 下一步規劃

### Phase 1: 基礎功能 (當前)
- [x] 基本 API 架構
- [x] 資料庫連線
- [ ] Zeabur 部署成功
- [ ] 健康檢查端點

### Phase 2: 核心功能
- [ ] 實作 Prisma Service
- [ ] 實作 User CRUD
- [ ] 實作 Ability 查詢
- [ ] 資料種子 (Seeding)

### Phase 3: 業務邏輯
- [ ] 席位認領功能
- [ ] 學生自評功能
- [ ] 教練評量功能
- [ ] 共享紀錄功能

### Phase 4: 前端整合
- [ ] Next.js 前端部署
- [ ] API 整合
- [ ] UI 實作

---

## 📚 參考資源

### Zeabur 官方文件
- [Node.js 部署指南](https://zeabur.com/docs/deploy/nodejs)
- [環境變數設定](https://zeabur.com/docs/deploy/variables)
- [PostgreSQL 服務](https://zeabur.com/docs/marketplace/postgresql)

### NestJS 部署
- [Production Deployment](https://docs.nestjs.com/faq/serverless)
- [Environment Variables](https://docs.nestjs.com/techniques/configuration)

### Prisma 部署
- [Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [Binary Targets](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#binarytargets-options)

---

## ✅ 成功標準

部署成功的判斷標準:
1. ✅ Zeabur 顯示 "Running" 狀態
2. ✅ 可以訪問根路徑 `/`
3. ✅ `/health` 回傳 `db: connected`
4. ✅ 無錯誤日誌
5. ✅ 回應時間 < 1 秒

---

**建立時間**: 2025-11-22  
**最後更新**: 2025-11-22  
**狀態**: 待執行
