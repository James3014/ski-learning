# 部署平台建議

## 現狀
經過多次嘗試，Zeabur 持續失敗，原因：
- 即使重命名 Dockerfile，Zeabur 仍使用 Docker 模式
- 可能的 Build Cache 或自動偵測邏輯問題
- Monorepo 支援不夠完整

## 建議方案

### 方案 A：換 Railway（推薦）
**優點**：
- Monorepo 原生支援
- 部署邏輯透明
- 5 分鐘內可完成

**步驟**：
1. 註冊 Railway.app
2. 連接 GitHub Repository
3. 選擇 Root Directory
4. 設定 Start Command: `node index.js`

### 方案 B：本地先驗證
**優點**：
- 確保程式邏輯正確
- 之後再處理部署

**步驟**：
1. `pnpm install`
2. `pnpm dev`
3. 測試 API endpoints

### 方案 C：繼續 Zeabur
不推薦，已浪費過多時間在平台特定問題上。
