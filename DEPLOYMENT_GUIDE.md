# Zeabur 部署指南

## ✅ 本地驗證已完成

所有本地測試已通過：
- ✅ 建置成功（npm run build）
- ✅ 應用程式啟動成功
- ✅ PORT 環境變數處理正確
- ✅ 配置檔案驗證測試通過（11/11）
- ✅ API 端點測試通過
- ✅ 健康檢查端點正常
- ✅ CORS 設定正確
- ✅ 回應時間 < 2 秒

## 📋 Zeabur 部署步驟

### 步驟 1：登入 Zeabur

1. 前往 https://zeabur.com
2. 登入你的帳號
3. 選擇或建立專案

### 步驟 2：建立 PostgreSQL Service

1. 點擊 "Add Service" → "Database" → "PostgreSQL"
2. 等待部署完成（約 1-2 分鐘）
3. 確認狀態顯示 "Running"
4. 點擊 PostgreSQL Service → "Variables" → 複製 `DATABASE_URL`

**重要**：請記錄 DATABASE_URL，格式類似：
```
postgresql://username:password@host:port/database
```

### 步驟 3：建立 API Service

1. 點擊 "Add Service" → "Git"
2. 選擇 Repository：`James3014/ski-learning`（或你的 repo 名稱）
3. 選擇分支：`main`
4. 等待 Zeabur 自動偵測（應該偵測為 Node.js）

### 步驟 4：設定環境變數

在 API Service 的 "Variables" 頁面添加：

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `DATABASE_URL` | `postgresql://...` | 從步驟 2 複製的值 |
| `NODE_ENV` | `production` | 生產環境標記 |

**注意**：`PORT` 不需要手動設定，Zeabur 會自動注入

### 步驟 5：確認建置和啟動指令

檢查以下設定（通常會自動偵測）：
- Build Command: `npm run build`
- Start Command: `npm run start:prod`

如果不正確，手動修改。

### 步驟 6：觸發部署

1. 點擊 "Redeploy" 或等待自動部署
2. 監控 Build Logs，確認以下訊息：
   ```
   ✓ Installing dependencies...
   ✓ Running postinstall: prisma generate
   ✓ Building application...
   ✓ Application is running on port XXXX
   ```

### 步驟 7：驗證部署

1. 取得 Zeabur 提供的網址（例如：`https://xxx.zeabur.app`）

2. 測試根路徑：
   ```bash
   curl https://your-domain.zeabur.app/
   ```
   預期回應：`Hello World from NestJS!`

3. 測試健康檢查：
   ```bash
   curl https://your-domain.zeabur.app/health
   ```
   預期回應：
   ```json
   {
     "status": "ok",
     "db": "connected",
     "timestamp": "2025-11-22T...",
     "env": "production"
   }
   ```

## ✅ 部署成功標準

- [ ] Zeabur Dashboard 顯示 "Running" 狀態
- [ ] 可以訪問 `https://your-domain/` 並看到歡迎訊息
- [ ] 可以訪問 `https://your-domain/health` 並看到 `"db": "connected"`
- [ ] Runtime Logs 沒有錯誤訊息
- [ ] 回應時間 < 2 秒

## 🐛 常見問題排查

### 問題 1：Build 失敗

**檢查**：
- 查看 Build Logs 的具體錯誤
- 確認 package.json 的 scripts 正確
- 確認 Node.js 版本設定為 18

**解決**：
- 檢查 zbpack.json 配置
- 確認所有依賴都在 dependencies（不是 devDependencies）

### 問題 2：啟動失敗

**檢查**：
- 查看 Runtime Logs
- 確認 DATABASE_URL 已設定
- 確認 PostgreSQL Service 正在運行

**解決**：
- 重新複製 DATABASE_URL
- 確認環境變數沒有多餘的空格
- 重新部署

### 問題 3：健康檢查回傳 disconnected

**檢查**：
- DATABASE_URL 格式是否正確
- PostgreSQL Service 是否正在運行
- 網路連線是否正常

**解決**：
- 測試 DATABASE_URL 連線
- 重啟 PostgreSQL Service
- 檢查 Zeabur 網路設定

### 問題 4：404 Not Found

**檢查**：
- Service 是否正在運行
- Domain 是否正確
- Port 綁定是否正確（應該是 0.0.0.0）

**解決**：
- 確認 main.ts 使用 `process.env.PORT`
- 確認綁定到 `0.0.0.0`
- 重新部署

## 📝 部署後任務

### 立即任務
- [ ] 記錄部署網址
- [ ] 更新 README.md
- [ ] 測試所有 API 端點
- [ ] 監控日誌和效能

### 文件更新
- [ ] 更新 TODO.md 標記部署完成
- [ ] 記錄部署日期和版本
- [ ] 更新 DEPLOYMENT_CHECKLIST.md

## 🚀 下一步

部署成功後，可以開始實作業務功能：
1. 建立 PrismaModule 和 PrismaService
2. 擴展資料庫 Schema（根據 spec/erm.dbml）
3. 實作席位認領 API
4. 實作學生自評 API
5. 實作教練評量 API

---

**建立時間**: 2025-11-22  
**狀態**: 準備部署
