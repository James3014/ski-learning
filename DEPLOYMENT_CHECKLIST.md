# Zeabur 部署檢查清單

## ✅ 已完成的修正

### 程式碼修正
- [x] 修正 `main.ts` - 支援動態 PORT (`process.env.PORT`)
- [x] 修正 `main.ts` - 綁定到 `0.0.0.0` (允許外部訪問)
- [x] 更新 `package.json` - 添加 `postinstall` script
- [x] 更新 `package.json` - 優化 `build` script (包含 prisma generate)
- [x] 改善 `app.controller.ts` - 增強健康檢查端點
- [x] 更新 `zbpack.json` - 完整的 build command
- [x] 確認 `prisma/schema.prisma` - 包含 Linux binary targets

### 配置檔案
- [x] `package.json` - engines 指定 Node >= 18
- [x] `tsconfig.json` - 輸出到 dist/
- [x] `.gitignore` - 排除 dist/ 和 node_modules/

---

## 📋 Zeabur 部署步驟

### Step 1: 提交程式碼變更
```bash
cd /Users/jameschen/Downloads/diyski/評量2

# 查看變更
git status

# 添加變更
git add .

# 提交
git commit -m "fix: 修正 Zeabur 部署配置 - 支援動態 PORT 和 Prisma 生成"

# 推送到 GitHub
git push origin main
```

### Step 2: 在 Zeabur 建立 PostgreSQL
1. 登入 [Zeabur Dashboard](https://zeabur.com)
2. 選擇或建立專案
3. 點擊 "Add Service" → "Database" → "PostgreSQL"
4. 等待部署完成 (約 1-2 分鐘)
5. 點擊 PostgreSQL Service → "Variables" → 複製 `DATABASE_URL`

### Step 3: 建立或更新 API Service
#### 如果是新建:
1. 點擊 "Add Service" → "Git"
2. 選擇 Repository: `James3014/ski-learning` (或你的 repo)
3. 選擇分支: `main` 或 `zeabur-simple-structure`
4. 等待自動偵測 (應該偵測為 Node.js)

#### 如果已存在:
1. 點擊現有的 API Service
2. 點擊 "Redeploy" 或等待自動部署

### Step 4: 設定環境變數
在 API Service 的 "Variables" 頁面添加:

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `DATABASE_URL` | `postgresql://...` | 從 PostgreSQL Service 複製 |
| `NODE_ENV` | `production` | 生產環境標記 |

**注意**: `PORT` 不需要手動設定,Zeabur 會自動注入

### Step 5: 監控部署
查看 "Logs" 頁面,確認以下訊息:
```
✓ Installing dependencies...
✓ Running postinstall: prisma generate
✓ Building application...
✓ Application is running on port XXXX
```

### Step 6: 驗證部署
取得 Zeabur 提供的網址 (例如: `https://xxx.zeabur.app`)

```bash
# 測試根路徑
curl https://your-domain.zeabur.app/

# 測試健康檢查
curl https://your-domain.zeabur.app/health
```

預期回應:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2025-11-22T03:23:47.274Z",
  "env": "production"
}
```

---

## 🐛 常見問題排查

### 問題 1: Build 失敗
**檢查**:
- [ ] 查看 Build Logs 的具體錯誤
- [ ] 確認 `package.json` 的 scripts 正確
- [ ] 本地執行 `npm run build` 測試

**解決**:
```bash
# 本地測試 build
npm install
npm run build

# 檢查 dist/ 是否生成
ls -la dist/
```

### 問題 2: 啟動失敗 (Port 錯誤)
**症狀**: `Error: listen EADDRINUSE`
**原因**: 未使用 `process.env.PORT`
**解決**: 已在 `main.ts` 修正

### 問題 3: Prisma Client 找不到
**症狀**: `Cannot find module '@prisma/client'`
**原因**: 未執行 `prisma generate`
**解決**: 已添加 `postinstall` script

### 問題 4: 資料庫連線失敗
**檢查**:
- [ ] DATABASE_URL 是否正確設定
- [ ] PostgreSQL Service 是否正在運行
- [ ] 網路連線是否正常

**測試**:
```bash
# 本地測試連線
DATABASE_URL="<zeabur-url>" npx prisma db push
```

### 問題 5: 404 Not Found
**檢查**:
- [ ] Service 是否正在運行 (狀態顯示 "Running")
- [ ] Domain 是否正確
- [ ] Port 綁定是否正確 (0.0.0.0)

---

## 📊 部署成功標準

- [ ] Zeabur Dashboard 顯示 "Running" 狀態
- [ ] 可以訪問 `https://your-domain/` 並看到 "Hello World from NestJS!"
- [ ] 可以訪問 `https://your-domain/health` 並看到 `"db": "connected"`
- [ ] Logs 中沒有錯誤訊息
- [ ] 回應時間 < 2 秒

---

## 🚀 部署後的下一步

### 立即任務
- [ ] 測試所有 API 端點
- [ ] 設定自訂網域 (可選)
- [ ] 設定 HTTPS (Zeabur 自動提供)
- [ ] 監控日誌和效能

### 開發任務
- [ ] 實作 Prisma Service Module
- [ ] 實作 User CRUD API
- [ ] 實作 Ability 查詢 API
- [ ] 建立資料種子 (Seeding)
- [ ] 實作席位認領功能

### 文件更新
- [ ] 更新 README.md 加入部署網址
- [ ] 記錄 API 端點文件
- [ ] 更新 ZEABUR_DEPLOY_SIMPLE.md

---

## 📝 部署記錄

### 部署歷史
| 日期 | 版本 | 狀態 | 備註 |
|------|------|------|------|
| 2025-11-22 | 0.1.0 | 本地驗證完成 | 所有本地測試通過，準備部署 |

### 環境資訊
- Node.js: >= 18.0.0
- NestJS: 10.x
- Prisma: 5.22.0
- TypeScript: 5.1.3
- Jest: 30.2.0
- PostgreSQL: 由 Zeabur 提供

### 測試結果
- ✅ 配置檔案驗證：11/11 通過
- ✅ 本地建置：成功
- ✅ 本地啟動：成功
- ✅ API 端點：正常
- ✅ 健康檢查：正常
- ✅ CORS：正常
- ✅ 回應時間：< 0.1 秒

---

**建立時間**: 2025-11-22  
**最後更新**: 2025-11-22  
**下一步**: 執行 Zeabur 部署（參考 DEPLOYMENT_GUIDE.md）
