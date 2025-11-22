# 設計文件：Zeabur 部署成功上線

## 概述

本設計文件描述如何確保滑雪教學評量系統後端 API 能夠成功部署到 Zeabur 平台並穩定運行。設計重點在於：

1. **簡化建置流程**：確保 Prisma Client 生成和 TypeScript 編譯在正確的時機執行
2. **動態配置**：支援 Zeabur 的動態 PORT 和環境變數注入
3. **健壯的錯誤處理**：提供清晰的錯誤訊息和優雅的降級機制
4. **可驗證性**：透過健康檢查端點快速驗證部署狀態

## 架構

### 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                        Zeabur Platform                       │
│  ┌────────────────┐              ┌─────────────────────┐   │
│  │  PostgreSQL    │◄─────────────┤   NestJS API        │   │
│  │  Service       │  DATABASE_URL│   Application       │   │
│  └────────────────┘              └─────────────────────┘   │
│         │                                   │                │
│         │                                   │ PORT (dynamic) │
│         └───────────────┬───────────────────┘                │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   Internet   │
                   │   Users      │
                   └──────────────┘
```

### 部署流程

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Git Push    │────►│  Zeabur      │────►│  Build       │────►│  Deploy      │
│              │     │  Webhook     │     │  Process     │     │  & Start     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │  1. npm      │
                                          │     install  │
                                          │  2. postinstall│
                                          │     (prisma  │
                                          │     generate)│
                                          │  3. nest     │
                                          │     build    │
                                          └──────────────┘
```

## 元件與介面

### 1. 應用程式啟動模組 (main.ts)

**職責**：
- 初始化 NestJS 應用程式
- 配置 CORS
- 綁定到正確的網路位址和埠號
- 輸出啟動日誌

**介面**：
```typescript
async function bootstrap(): Promise<void>
```

**關鍵邏輯**：
```typescript
const port = process.env.PORT || 3001;
await app.listen(port, '0.0.0.0');
```

**設計決策**：
- 使用 `process.env.PORT` 支援 Zeabur 的動態埠號分配
- 綁定到 `0.0.0.0` 而非 `localhost` 以接受外部連線
- 提供預設埠號 3001 以支援本地開發

### 2. 應用程式模組 (AppModule)

**職責**：
- 組織應用程式的模組結構
- 註冊控制器和服務

**介面**：
```typescript
@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
```

**設計決策**：
- 保持簡單的模組結構，避免過度設計
- 未來可擴展為包含 PrismaModule 等子模組

### 3. 應用程式控制器 (AppController)

**職責**：
- 提供基本的 API 端點
- 實作健康檢查邏輯
- 管理 Prisma Client 實例

**介面**：
```typescript
class AppController {
  private prisma: PrismaClient;
  
  getHello(): string;
  getHealth(): Promise<HealthCheckResponse>;
}

interface HealthCheckResponse {
  status: 'ok' | 'error';
  db: 'connected' | 'disconnected';
  timestamp: string;
  env?: string;
  error?: string;
}
```

**設計決策**：
- 在控制器中直接實例化 PrismaClient（簡化設計，未來可重構為服務）
- 健康檢查執行實際的資料庫連線測試
- 錯誤不會導致應用程式崩潰，而是回傳錯誤狀態

### 4. Prisma Schema

**職責**：
- 定義資料庫結構
- 配置 Prisma Client 生成選項

**關鍵配置**：
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**設計決策**：
- 包含 `linux-musl-openssl-3.0.x` 以支援 Zeabur 的 Linux 容器環境
- 使用環境變數 `DATABASE_URL` 以支援不同環境的配置

### 5. 建置配置 (package.json)

**關鍵 Scripts**：
```json
{
  "postinstall": "prisma generate",
  "build": "prisma generate && nest build",
  "start": "node dist/main",
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main"
}
```

**設計決策**：
- `postinstall` 確保每次安裝依賴後自動生成 Prisma Client
- `build` 在編譯前先生成 Prisma Client，避免找不到模組
- `start:prod` 直接執行編譯後的 JavaScript，提升啟動速度

### 6. Zeabur 配置 (zbpack.json)

**配置內容**：
```json
{
  "build_command": "npm install && npm run build",
  "start_command": "npm run start:prod",
  "install_command": "npm install",
  "node_version": "18"
}
```

**設計決策**：
- 明確指定 Node.js 版本為 18（LTS 版本）
- 建置指令包含完整的安裝和建置流程
- 啟動指令使用生產模式

## 資料模型

### 環境變數模型

```typescript
interface EnvironmentVariables {
  PORT?: string;           // Zeabur 動態注入，本地預設 3001
  DATABASE_URL: string;    // PostgreSQL 連線字串（必要）
  NODE_ENV?: string;       // 執行環境（development/production）
}
```

### 健康檢查回應模型

```typescript
interface HealthCheckResponse {
  status: 'ok' | 'error';
  db: 'connected' | 'disconnected';
  timestamp: string;
  env?: string;
  error?: string;
}
```

**範例回應（成功）**：
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "env": "production"
}
```

**範例回應（失敗）**：
```json
{
  "status": "error",
  "db": "disconnected",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "error": "Connection timeout"
}
```

## 正確性屬性

*屬性是一種特徵或行為，應該在系統的所有有效執行中保持為真。屬性作為人類可讀規格與機器可驗證正確性保證之間的橋樑。*

### 屬性反思

經過分析，許多驗收標準是重複的或測試外部系統行為（如 Zeabur 平台、npm、Prisma）。真正需要測試的核心屬性只有少數幾個：

**可合併的屬性**：
- 健康檢查回應格式（4.1-4.5）可合併為一個屬性
- 配置檔案檢查（9.1-9.5）可合併為一個屬性
- 建置流程（1.1-1.5）可合併為一個屬性

**冗餘的屬性**：
- 需求 7、10 大部分是重複測試
- 需求 8 大部分是設計原則而非可測試行為

### 核心屬性

**屬性 1：PORT 環境變數處理**
*對於任何* PORT 環境變數值（包括未設定），應用程式應該能夠啟動並監聽正確的埠號（設定值或預設 3001）
**驗證需求：2.1, 2.2**

**屬性 2：健康檢查回應完整性**
*對於任何* 資料庫連線狀態（成功或失敗），GET /health 應該回傳包含 status、db、timestamp、env 欄位的 JSON 回應
**驗證需求：3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5**

**屬性 3：回應時間限制**
*對於任何* 有效的 HTTP 請求，系統應該在 2 秒內回應
**驗證需求：5.3**

## 錯誤處理

### 建置階段錯誤

**錯誤情境**：
1. TypeScript 編譯錯誤
2. Prisma Client 生成失敗
3. 依賴套件安裝失敗

**處理策略**：
- 依賴 npm 和 NestJS CLI 的內建錯誤訊息
- 確保 package.json scripts 正確配置
- 在 CI/CD 日誌中可見

### 執行階段錯誤

**錯誤情境**：
1. DATABASE_URL 未設定或格式錯誤
2. 資料庫連線失敗
3. PORT 已被佔用

**處理策略**：
```typescript
// DATABASE_URL 錯誤
try {
  await this.prisma.$connect();
} catch (error) {
  return {
    status: 'error',
    db: 'disconnected',
    error: error.message,
    timestamp: new Date().toISOString()
  };
}
```

**設計決策**：
- 健康檢查失敗不會導致應用程式崩潰
- 錯誤訊息包含足夠資訊以診斷問題
- 不暴露敏感資訊（如完整的 DATABASE_URL）

### 降級策略

1. **資料庫不可用**：健康檢查回傳錯誤狀態，但應用程式繼續運行
2. **環境變數缺失**：使用預設值（PORT）或在啟動時失敗（DATABASE_URL）
3. **網路問題**：依賴 NestJS 的內建錯誤處理

## 測試策略

### 單元測試

**測試範圍**：
- 配置檔案驗證（package.json, prisma/schema.prisma, zbpack.json）
- 健康檢查邏輯（AppController.getHealth）

**測試工具**：
- Jest（NestJS 內建）
- 檔案系統讀取測試

**範例測試**：
```typescript
describe('AppController', () => {
  describe('getHealth', () => {
    it('should return connected status when database is available', async () => {
      const result = await controller.getHealth();
      expect(result.status).toBe('ok');
      expect(result.db).toBe('connected');
      expect(result.timestamp).toBeDefined();
    });

    it('should return error status when database is unavailable', async () => {
      // Mock Prisma to throw error
      const result = await controller.getHealth();
      expect(result.status).toBe('error');
      expect(result.db).toBe('disconnected');
      expect(result.error).toBeDefined();
    });
  });
});
```

### 整合測試

**測試範圍**：
- 完整的建置流程（npm install → npm run build）
- 應用程式啟動和關閉
- HTTP 端點回應

**測試工具**：
- Supertest（HTTP 測試）
- 實際的 PostgreSQL 測試資料庫

**範例測試**：
```typescript
describe('API Integration', () => {
  it('GET / should return welcome message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World from NestJS!');
  });

  it('GET /health should return health status', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('db');
        expect(res.body).toHaveProperty('timestamp');
      });
  });
});
```

### 屬性測試

**不適用於此專案**：
- 目前的需求都是具體的範例測試，不需要屬性測試
- 屬性 1-3 可以用參數化測試覆蓋，但不需要完整的 PBT 框架

### 部署驗證測試

**測試範圍**：
- Zeabur 部署後的煙霧測試
- 端點可用性檢查

**測試方法**：
```bash
# 手動驗證腳本
curl https://your-domain.zeabur.app/
curl https://your-domain.zeabur.app/health

# 預期結果
# GET / → "Hello World from NestJS!"
# GET /health → {"status":"ok","db":"connected",...}
```

## 部署檢查清單

### 部署前檢查

- [ ] 本地執行 `npm run build` 成功
- [ ] 本地執行 `npm run start:prod` 成功
- [ ] 本地執行健康檢查回傳 connected
- [ ] package.json 包含所有必要的 scripts
- [ ] prisma/schema.prisma 包含 Linux binaryTargets
- [ ] .gitignore 排除 dist/ 和 node_modules/

### Zeabur 配置檢查

- [ ] 建立 PostgreSQL Service
- [ ] 複製 DATABASE_URL
- [ ] 建立 API Service 並連接 Git Repository
- [ ] 設定環境變數：DATABASE_URL, NODE_ENV=production
- [ ] 確認 Build Command: `npm run build`
- [ ] 確認 Start Command: `npm run start:prod`

### 部署後驗證

- [ ] Zeabur 控制台顯示 "Running" 狀態
- [ ] 存取 `https://your-domain/` 回傳歡迎訊息
- [ ] 存取 `https://your-domain/health` 回傳 `"db": "connected"`
- [ ] 查看日誌無錯誤訊息
- [ ] 回應時間 < 2 秒

## 監控與維護

### 關鍵指標

1. **可用性**：健康檢查端點的成功率
2. **回應時間**：API 端點的平均回應時間
3. **錯誤率**：5xx 錯誤的發生頻率
4. **資料庫連線**：資料庫連線失敗的次數

### 日誌策略

**日誌等級**：
- `production`：只記錄 warn 和 error
- `development`：記錄所有等級

**關鍵日誌**：
```typescript
// 啟動日誌
console.log(`Application is running on port ${port}`);

// 錯誤日誌（由 NestJS 自動處理）
// 資料庫錯誤會在健康檢查回應中回傳
```

### 故障排除指南

**問題 1：部署後無法存取**
- 檢查 Zeabur 控制台狀態
- 查看 Runtime Logs 是否有啟動錯誤
- 確認 PORT 綁定到 0.0.0.0

**問題 2：健康檢查回傳 disconnected**
- 檢查 DATABASE_URL 環境變數是否正確設定
- 確認 PostgreSQL Service 正在運行
- 測試資料庫連線字串格式

**問題 3：建置失敗**
- 查看 Build Logs 的具體錯誤
- 確認 package.json scripts 正確
- 本地執行 `npm run build` 重現問題

## 未來擴展

### Phase 1：Prisma Service 模組化

當開始實作業務邏輯時，應該將 Prisma Client 重構為獨立的服務：

```typescript
// prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// prisma/prisma.module.ts
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Phase 2：完整的資料庫 Schema

根據 `spec/erm.dbml` 實作完整的 Prisma Schema，包括：
- 179 項能力矩陣（ability_catalog）
- 席位認領流程（order_seats, seat_invitations）
- 教學紀錄（lesson_records, lesson_record_details）
- 評量系統（coach_ability_ratings, student_self_evaluations）

### Phase 3：業務 API 端點

實作核心業務功能：
- 席位認領 API
- 學生自評 API
- 教練評量 API
- 能力清單查詢 API

## 參考資料

### Zeabur 文件
- [Node.js 部署指南](https://zeabur.com/docs/deploy/nodejs)
- [環境變數設定](https://zeabur.com/docs/deploy/variables)
- [PostgreSQL 服務](https://zeabur.com/docs/marketplace/postgresql)

### NestJS 文件
- [Production Deployment](https://docs.nestjs.com/faq/serverless)
- [Configuration](https://docs.nestjs.com/techniques/configuration)

### Prisma 文件
- [Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [Binary Targets](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#binarytargets-options)

