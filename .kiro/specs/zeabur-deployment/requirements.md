# 需求文件：Zeabur 部署成功上線

## 簡介

本專案是一個滑雪教學評量系統的後端 API，使用 NestJS + PostgreSQL + Prisma 技術棧。目前專案已經完成基本架構重構（從 Monorepo 改為單一 Repository），但在 Zeabur 平台部署時遇到問題。本需求文件旨在確保專案能夠成功部署到 Zeabur 並穩定運行。

## 術語表

- **System**: 滑雪教學評量系統後端 API
- **Zeabur**: 雲端部署平台，提供自動化部署和 PostgreSQL 資料庫服務
- **NestJS**: Node.js 後端框架
- **Prisma**: TypeScript ORM 工具
- **Build Process**: 將 TypeScript 原始碼編譯為 JavaScript 的過程
- **Runtime**: 應用程式執行時期
- **Health Check**: 健康檢查端點，用於驗證服務狀態
- **Environment Variable**: 環境變數，用於配置應用程式
- **PORT**: 應用程式監聽的網路埠號
- **DATABASE_URL**: PostgreSQL 資料庫連線字串

## 需求

### 需求 1：建置流程正確性

**使用者故事**：作為開發者，我希望建置流程能夠正確執行，以便產生可部署的應用程式

#### 驗收標準

1. WHEN THE System 執行建置指令 THEN THE System SHALL 成功生成 Prisma Client
2. WHEN THE System 執行建置指令 THEN THE System SHALL 成功編譯 TypeScript 程式碼為 JavaScript
3. WHEN THE System 執行建置指令 THEN THE System SHALL 在 dist 目錄產生所有必要的執行檔案
4. WHEN THE Build Process 完成 THEN THE System SHALL 包含正確的 Linux 平台 Prisma 二進位檔案
5. WHEN THE System 安裝依賴套件 THEN THE System SHALL 自動執行 Prisma Client 生成

### 需求 2：應用程式啟動與網路綁定

**使用者故事**：作為系統管理員，我希望應用程式能夠正確啟動並接受外部連線，以便使用者可以存取 API

#### 驗收標準

1. WHEN THE System 啟動 THEN THE System SHALL 使用 Zeabur 提供的動態 PORT 環境變數
2. WHEN THE PORT 環境變數不存在 THEN THE System SHALL 使用預設埠號 3001
3. WHEN THE System 監聽網路埠 THEN THE System SHALL 綁定到 0.0.0.0 位址以接受外部連線
4. WHEN THE System 成功啟動 THEN THE System SHALL 在日誌中輸出正在監聽的埠號
5. WHEN THE System 啟動失敗 THEN THE System SHALL 輸出明確的錯誤訊息

### 需求 3：資料庫連線管理

**使用者故事**：作為系統管理員，我希望應用程式能夠正確連線到 PostgreSQL 資料庫，以便儲存和查詢資料

#### 驗收標準

1. WHEN THE System 啟動 THEN THE System SHALL 從 DATABASE_URL 環境變數讀取資料庫連線資訊
2. WHEN THE DATABASE_URL 環境變數不存在 THEN THE System SHALL 輸出明確的錯誤訊息
3. WHEN THE System 收到健康檢查請求 THEN THE System SHALL 測試資料庫連線狀態
4. WHEN 資料庫連線成功 THEN THE System SHALL 回傳包含 "db": "connected" 的 JSON 回應
5. WHEN 資料庫連線失敗 THEN THE System SHALL 回傳包含錯誤訊息的 JSON 回應且不中斷服務

### 需求 4：健康檢查端點

**使用者故事**：作為運維人員，我希望有一個健康檢查端點，以便監控服務狀態

#### 驗收標準

1. WHEN THE System 收到 GET /health 請求 THEN THE System SHALL 回傳 JSON 格式的健康狀態
2. WHEN 健康檢查執行 THEN THE System SHALL 包含服務狀態欄位
3. WHEN 健康檢查執行 THEN THE System SHALL 包含資料庫連線狀態欄位
4. WHEN 健康檢查執行 THEN THE System SHALL 包含當前時間戳記
5. WHEN 健康檢查執行 THEN THE System SHALL 包含執行環境資訊

### 需求 5：基本 API 端點

**使用者故事**：作為使用者，我希望能夠存取基本的 API 端點，以便驗證服務正常運作

#### 驗收標準

1. WHEN THE System 收到 GET / 請求 THEN THE System SHALL 回傳歡迎訊息
2. WHEN THE System 收到跨域請求 THEN THE System SHALL 正確處理 CORS 標頭
3. WHEN THE System 收到請求 THEN THE System SHALL 在 2 秒內回應
4. WHEN THE System 收到無效路徑請求 THEN THE System SHALL 回傳 404 狀態碼
5. WHEN THE System 發生內部錯誤 THEN THE System SHALL 回傳 500 狀態碼且不洩漏敏感資訊

### 需求 6：Zeabur 平台整合

**使用者故事**：作為開發者，我希望專案能夠與 Zeabur 平台無縫整合，以便實現自動化部署

#### 驗收標準

1. WHEN Zeabur 偵測專案類型 THEN THE System SHALL 被正確識別為 Node.js 專案
2. WHEN Zeabur 執行建置 THEN THE System SHALL 使用 package.json 中定義的 build script
3. WHEN Zeabur 啟動應用程式 THEN THE System SHALL 使用 package.json 中定義的 start:prod script
4. WHEN Zeabur 注入環境變數 THEN THE System SHALL 正確讀取所有必要的環境變數
5. WHEN 部署完成 THEN THE System SHALL 在 Zeabur 控制台顯示 "Running" 狀態

### 需求 7：部署驗證與監控

**使用者故事**：作為系統管理員，我希望能夠驗證部署是否成功，以便確保服務品質

#### 驗收標準

1. WHEN 部署完成 THEN THE System SHALL 可透過 Zeabur 提供的網域存取
2. WHEN 存取根路徑 THEN THE System SHALL 回傳正確的歡迎訊息
3. WHEN 存取健康檢查端點 THEN THE System SHALL 回傳資料庫已連線的狀態
4. WHEN 查看部署日誌 THEN THE System SHALL 不包含錯誤訊息
5. WHEN 服務運行 THEN THE System SHALL 在 Zeabur 日誌中持續輸出運行狀態

### 需求 8：錯誤處理與復原

**使用者故事**：作為系統管理員，我希望系統能夠優雅地處理錯誤，以便快速診斷和修復問題

#### 驗收標準

1. WHEN THE Build Process 失敗 THEN THE System SHALL 在日誌中輸出具體的錯誤原因
2. WHEN THE System 啟動失敗 THEN THE System SHALL 輸出可操作的錯誤訊息
3. WHEN 資料庫連線失敗 THEN THE System SHALL 持續嘗試重新連線
4. WHEN 環境變數缺失 THEN THE System SHALL 明確指出缺少哪個環境變數
5. WHEN THE System 遇到未預期的錯誤 THEN THE System SHALL 記錄完整的錯誤堆疊但不暴露給使用者

### 需求 9：配置檔案正確性

**使用者故事**：作為開發者，我希望所有配置檔案都正確設定，以便確保部署流程順利

#### 驗收標準

1. WHEN 檢查 package.json THEN THE System SHALL 包含正確的 build 和 start:prod scripts
2. WHEN 檢查 package.json THEN THE System SHALL 包含 postinstall script 以生成 Prisma Client
3. WHEN 檢查 package.json THEN THE System SHALL 指定 Node.js 版本為 18 或以上
4. WHEN 檢查 prisma/schema.prisma THEN THE System SHALL 包含 Linux 平台的 binaryTargets
5. WHEN 檢查 zbpack.json THEN THE System SHALL 包含正確的 build_command 和 start_command

### 需求 10：本地開發與生產環境一致性

**使用者故事**：作為開發者，我希望本地開發環境與生產環境行為一致，以便減少部署後的意外

#### 驗收標準

1. WHEN 在本地執行 npm run build THEN THE System SHALL 成功建置且無錯誤
2. WHEN 在本地執行 npm run start:prod THEN THE System SHALL 成功啟動
3. WHEN 在本地設定 DATABASE_URL THEN THE System SHALL 能夠連線到資料庫
4. WHEN 在本地執行健康檢查 THEN THE System SHALL 回傳與生產環境相同格式的回應
5. WHEN 比較本地與生產環境的依賴套件 THEN THE System SHALL 使用相同版本的套件
