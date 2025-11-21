# Zeabur 部署指南（正確版）

## 問題診斷
當前失敗原因：Zeabur 混淆了 Monorepo 的結構，同時嘗試用 Node.js 和 Docker 兩種模式部署，導致 Runtime 找不到編譯檔案。

## 解決方案：明確分離部署

### 刪除舊服務
1. 在 Zeabur 刪除所有現有的 `api` 和 `web` Service

### 重新建立 API Service（Docker 模式）
1. **新增 Service** → 選擇 Git Repository
2. **重要設定**：
   - **部署類型**：選擇 **Dockerfile**
   - **Root Directory**：留空（保持根目錄）
   - **Dockerfile Path**：`apps/api/Dockerfile`
   - **Port**：`3001`
3. **環境變數**：
   - `DATABASE_URL`：從 PostgreSQL Service 複製連線字串
4. **儲存並部署**

### 重新建立 Web Service（Next.js 模式）
1. **新增 Service** → 選擇 Git Repository  
2. **重要設定**：
   - **框架**：Next.js
   - **Root Directory**：`apps/web`
   - **Build Command**：`cd ../.. && pnpm install && pnpm run build --filter=web`
   - **Start Command**：`pnpm start`
3. **儲存並部署**

## 驗證
- API：訪問 `https://<api-domain>/health` → 應回傳 `{"status":"ok","db":"connected"}`
- Web：訪問 `https://<web-domain>/` → 應顯示首頁

## 為什麼這樣做（Linus 原則）
1. **Good Taste**：明確分離部署邊界，避免混合模式的特殊情況
2. **Pragmatism**：Docker 確保 Build Artifacts 被正確保存和執行
3. **Portability**：Docker Image 可遷移到任何平台，不依賴 Zeabur 特定行為
