# Zeabur 部署指南（簡化版）

## ✅ 專案已重構完成！

**變更內容**：
- ✅ 移除 Monorepo 複雜結構
- ✅ 改用標準 Node.js + NestJS 單一 Repository
- ✅ 所有檔案在根目錄一目瞭然
- ✅ 本地 Build 測試通過

## Zeabur 部署步驟

### 步驟 1：連接新分支
1. 進入 Zeabur Dashboard
2. 建立**新的 Service**
3. 選擇 Repository: `James3014/ski-learning`
4. **Branch**: 選擇 `zeabur-simple-structure`

### 步驟 2：設定部署參數
**框架**: Node.js (會自動偵測)

**Build Command**:
```
npm run build
```

**Start Command**:
```
npm run start:prod
```

**Port**: `3000` (NestJS 預設)

### 步驟 3：環境變數
新增以下環境變數：

| Key | Value |
|-----|-------|
| `DATABASE_URL` | 從 PostgreSQL Service 複製連線字串 |
| `NODE_ENV` | `production` |

### 步驟 4：部署
點擊「Deploy」，等待 2-3 分鐘。

## 驗證
部署成功後，訪問：
- `https://<your-domain>/` → 應回傳 `"Hello World from NestJS!"`
- `https://<your-domain>/health` → 應回傳 `{"status":"ok","db":"connected"}`

## 為什麼這次會成功？
1. **無 Dockerfile**：Zeabur 不會混淆部署模式
2. **無 Turborepo**：沒有複雜的 Monorepo cache 問題
3. **標準結構**：Zeabur 完全按標準 Node.js 方式處理
4. **已測試**：本地 Build 成功，確保沒有程式碼錯誤

---

**分支資訊**：
- Branch: `zeabur-simple-structure`
- Latest Commit: 已包含所有重構

請按照上述步驟在 Zeabur 部署，這次應該會順利成功！
