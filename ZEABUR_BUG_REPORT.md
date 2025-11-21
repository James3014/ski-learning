# Zeabur Bug Report

## 問題描述
Zeabur 在處理 Monorepo 時，即使 Dockerfile 已被重命名/刪除，仍持續使用 Docker 部署模式，導致部署失敗。

## 重現步驟
1. 創建 Monorepo 結構（使用 pnpm + Turborepo）
2. 在 `apps/api/Dockerfile` 放置 Dockerfile
3. 推送到 GitHub 並連接 Zeabur
4. 部署失敗後，重命名 `Dockerfile` → `Dockerfile.backup`
5. 在根目錄創建 `index.js` 和 `package.json` 的 `start` script
6. 推送新 commit

## 預期行為
Zeabur 應偵測到 Dockerfile 不存在，改用 Node.js 部署模式執行 `pnpm start`。

## 實際行為
Zeabur 仍嘗試執行 Docker build，並報錯：
```
#23 ERROR: failed to calculate checksum of ref: "/app/packages/database/node_modules/.prisma": not found
```

這證明 Zeabur 在：
1. 使用舊的 build cache（忽略最新 commit）
2. 或是從 Git History 讀取 Dockerfile 路徑（而非當前檔案樹）

## 環境資訊
- Repository: https://github.com/James3014/ski-learning.git
- Branch: main
- Commit: `6be62de - fix: disable dockerfile to force nodejs deployment`
- Monorepo Structure: pnpm workspace + Turborepo
- 受影響的 Deployment IDs:
  - deployment-691fe2a02896cd688d4b8a29
  - deployment-691fe2332896cd688d4b8a18
  - deployment-691fdfd52896cd688d4b89ac

## 建議修復
1. 提供 "Force Rebuild from Scratch" 選項（清除所有 cache）
2. 改善 Dockerfile 檢測邏輯：只檢查當前 commit 的檔案樹
3. 允許用戶在 UI 手動選擇部署模式（強制 Node.js / 強制 Docker）

## 影響
這個 Bug 讓 Monorepo 用戶無法從 Docker 模式切換回 Node.js 模式，造成部署卡死。

---

**Repository 連結**：https://github.com/James3014/ski-learning.git
**聯絡方式**：（請您補充 Email）
