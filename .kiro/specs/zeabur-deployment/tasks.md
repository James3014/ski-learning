# 實作計畫：Zeabur 部署成功上線

## 任務清單

- [x] 1. 驗證本地建置和啟動
  - 確認本地環境可以成功建置和執行應用程式
  - 驗證所有配置檔案正確
  - _需求：1.1, 1.2, 1.3, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2_

- [x] 1.1 執行本地建置測試
  - 執行 `npm install` 確認依賴安裝成功
  - 執行 `npm run build` 確認建置成功
  - 檢查 `dist/` 目錄包含 main.js, app.module.js, app.controller.js
  - 檢查 `node_modules/.prisma/client` 存在
  - _需求：1.1, 1.2, 1.3, 1.5_

- [x] 1.2 驗證配置檔案
  - 檢查 package.json 包含正確的 scripts（build, start:prod, postinstall）
  - 檢查 package.json 指定 Node.js >= 18
  - 檢查 prisma/schema.prisma 包含 linux-musl-openssl-3.0.x binaryTarget
  - 檢查 zbpack.json 包含正確的 build_command 和 start_command
  - _需求：9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 1.3 測試本地啟動
  - 設定測試用的 DATABASE_URL 環境變數
  - 執行 `npm run start:prod`
  - 確認應用程式啟動並輸出 "Application is running on port 3001"
  - _需求：2.2, 2.4, 10.2_

- [x] 1.4 測試 PORT 環境變數處理
  - 設定 PORT=8080
  - 啟動應用程式
  - 確認應用程式監聽 8080 埠
  - 不設定 PORT，確認應用程式使用預設 3001 埠
  - _需求：2.1, 2.2_

- [x] 1.5 撰寫配置檔案驗證測試
  - 建立測試檔案驗證 package.json 內容
  - 建立測試檔案驗證 prisma/schema.prisma 內容
  - 建立測試檔案驗證 zbpack.json 內容
  - _需求：9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. 驗證 API 端點功能
  - 測試基本端點和健康檢查
  - 確認錯誤處理正確
  - _需求：3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4_

- [x] 2.1 測試基本端點
  - 啟動應用程式
  - 發送 GET / 請求
  - 確認回應為 "Hello World from NestJS!"
  - 發送 GET /invalid-path 請求
  - 確認回應狀態碼為 404
  - _需求：5.1, 5.4_

- [x] 2.2 測試健康檢查端點（資料庫連線成功）
  - 設定正確的 DATABASE_URL
  - 啟動應用程式
  - 發送 GET /health 請求
  - 確認回應包含 status: "ok", db: "connected", timestamp, env 欄位
  - 確認 Content-Type 為 application/json
  - _需求：3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2.3 測試健康檢查端點（資料庫連線失敗）
  - 設定錯誤的 DATABASE_URL（例如：postgresql://invalid:invalid@localhost:5432/invalid）
  - 啟動應用程式
  - 發送 GET /health 請求
  - 確認回應包含 status: "error", db: "disconnected", error, timestamp 欄位
  - 確認應用程式仍在運行（不會崩潰）
  - _需求：3.5_

- [x] 2.4 測試 CORS 處理
  - 發送帶 Origin 標頭的請求
  - 確認回應包含 Access-Control-Allow-Origin 標頭
  - _需求：5.2_

- [x] 2.5 測試回應時間
  - 發送多個請求到 / 和 /health 端點
  - 測量回應時間
  - 確認所有回應時間 < 2 秒
  - _需求：5.3_

- [x] 2.6 撰寫 API 端點整合測試
  - 使用 Supertest 撰寫 GET / 測試
  - 使用 Supertest 撰寫 GET /health 測試（成功和失敗情況）
  - 使用 Supertest 撰寫 404 錯誤測試
  - 使用 Supertest 撰寫 CORS 測試
  - _需求：3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.4_

- [x] 3. 在 Zeabur 建立 PostgreSQL Service
  - 登入 Zeabur 並建立資料庫服務
  - 取得連線資訊
  - _需求：6.1, 6.2, 6.3_

- [x] 3.1 登入 Zeabur Dashboard
  - 前往 https://zeabur.com
  - 登入帳號
  - 選擇或建立專案

- [x] 3.2 建立 PostgreSQL Service
  - 點擊 "Add Service" → "Database" → "PostgreSQL"
  - 等待部署完成（約 1-2 分鐘）
  - 確認狀態顯示 "Running"

- [x] 3.3 取得 DATABASE_URL
  - 點擊 PostgreSQL Service
  - 進入 "Variables" 頁面
  - 複製 DATABASE_URL 的值
  - 記錄下來供後續使用

- [x] 4. 部署 API 到 Zeabur
  - 建立 API Service 並連接 Git Repository
  - 設定環境變數
  - 觸發部署
  - _需求：6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4.1 建立 API Service
  - 點擊 "Add Service" → "Git"
  - 選擇 Repository（例如：James3014/ski-learning）
  - 選擇分支（main 或 zeabur-simple-structure）
  - 等待 Zeabur 自動偵測為 Node.js 專案

- [x] 4.2 設定環境變數
  - 進入 API Service 的 "Variables" 頁面
  - 新增 DATABASE_URL（從步驟 3.3 複製的值）
  - 新增 NODE_ENV=production
  - 儲存變更

- [x] 4.3 確認建置和啟動指令
  - 檢查 Build Command 是否為 `npm run build`
  - 檢查 Start Command 是否為 `npm run start:prod`
  - 如果不正確，手動修改

- [x] 4.4 觸發部署
  - 點擊 "Redeploy" 或等待自動部署
  - 監控 Build Logs
  - 確認看到 "npm install" → "prisma generate" → "nest build" 成功訊息

- [x] 4.5 監控部署狀態
  - 等待部署完成
  - 確認 Zeabur 控制台顯示 "Running" 狀態
  - 查看 Runtime Logs 確認應用程式啟動
  - 確認看到 "Application is running on port XXXX" 訊息

- [x] 5. 驗證部署結果
  - 測試部署後的 API 端點
  - 確認所有功能正常運作
  - _需求：7.1, 7.2, 7.3_

- [x] 5.1 取得部署網址
  - 在 Zeabur 控制台找到 API Service 的網址
  - 記錄網址（例如：https://xxx.zeabur.app）

- [x] 5.2 測試根路徑
  - 使用瀏覽器或 curl 存取 `https://your-domain/`
  - 確認回應為 "Hello World from NestJS!"
  - _需求：7.2_

- [x] 5.3 測試健康檢查端點
  - 使用瀏覽器或 curl 存取 `https://your-domain/health`
  - 確認回應包含 `"status": "ok"` 和 `"db": "connected"`
  - 確認回應包含 timestamp 和 env 欄位
  - _需求：7.3_

- [x] 5.4 檢查部署日誌
  - 在 Zeabur 控制台查看 Runtime Logs
  - 確認沒有錯誤訊息
  - 確認應用程式正常運行
  - _需求：7.4_

- [x] 5.5 測試回應時間
  - 多次存取 / 和 /health 端點
  - 確認回應時間 < 2 秒
  - _需求：5.3_

- [x] 6. 文件更新和清理
  - 更新專案文件
  - 記錄部署資訊
  - 清理臨時檔案

- [x] 6.1 更新 README.md
  - 加入部署網址
  - 更新部署狀態為「已成功部署」
  - 加入 API 端點文件

- [x] 6.2 更新 TODO.md
  - 標記 Zeabur 部署任務為完成
  - 更新下一步計畫

- [x] 6.3 記錄部署資訊
  - 在 DEPLOYMENT_CHECKLIST.md 記錄部署日期和版本
  - 記錄 Zeabur 專案和服務名稱
  - 記錄部署網址

- [x] 6.4 清理不需要的文件
  - 檢查是否有臨時檔案或測試檔案需要刪除
  - 確認 .gitignore 正確排除 dist/ 和 node_modules/

## 檢查點

- [x] 檢查點 1：本地驗證完成
  - 完成任務 1.1-1.4
  - 確認本地建置、啟動、API 端點都正常
  - 如有問題，先解決再繼續

- [x] 檢查點 2：API 測試完成
  - 完成任務 2.1-2.5
  - 確認所有端點和錯誤處理正常
  - 如有問題，先解決再繼續

- [x] 檢查點 3：Zeabur 部署完成
  - 完成任務 3.1-4.5
  - 確認應用程式在 Zeabur 上成功運行
  - 如有問題，查看日誌並修正

- [x] 檢查點 4：部署驗證完成
  - 完成任務 5.1-5.5
  - 確認所有端點在生產環境正常運作
  - 記錄任何發現的問題

## 故障排除指南

### 本地建置失敗
1. 檢查 Node.js 版本是否 >= 18
2. 刪除 node_modules 和 package-lock.json，重新執行 npm install
3. 檢查 TypeScript 編譯錯誤訊息

### 本地啟動失敗
1. 檢查 DATABASE_URL 是否正確設定
2. 檢查 PostgreSQL 是否正在運行
3. 檢查 PORT 是否已被佔用

### Zeabur 建置失敗
1. 查看 Build Logs 的具體錯誤訊息
2. 確認 package.json scripts 正確
3. 確認 zbpack.json 配置正確

### Zeabur 啟動失敗
1. 查看 Runtime Logs 的錯誤訊息
2. 確認 DATABASE_URL 環境變數已設定
3. 確認 PostgreSQL Service 正在運行

### 健康檢查回傳 disconnected
1. 檢查 DATABASE_URL 格式是否正確
2. 測試從本地連線到 Zeabur PostgreSQL
3. 確認網路連線正常

## 成功標準

部署成功的判斷標準：
1. ✅ Zeabur 控制台顯示 "Running" 狀態
2. ✅ 可以存取 `https://your-domain/` 並看到歡迎訊息
3. ✅ 可以存取 `https://your-domain/health` 並看到 `"db": "connected"`
4. ✅ Runtime Logs 沒有錯誤訊息
5. ✅ 回應時間 < 2 秒

## 下一步

部署成功後，可以開始實作業務功能：
1. 建立 PrismaModule 和 PrismaService
2. 擴展資料庫 Schema（根據 spec/erm.dbml）
3. 實作席位認領 API
4. 實作學生自評 API
5. 實作教練評量 API
