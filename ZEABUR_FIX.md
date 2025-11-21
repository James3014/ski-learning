# ⚠️ 重要：Zeabur 部署問題診斷

## 當前狀況
Zeabur 一直失敗，原因是它**混淆了部署模式**。

從錯誤訊息看：
```
#23 [runner 6/6] COPY --from=installer --chown=nestjs:nodejs /app/packages/database/node_modules/.prisma
```
這行指令已經從 Dockerfile **刪除**了，但 Zeabur 仍在執行它。

## 根本原因（Linus 原則分析）
**Good Taste 視角**：Zeabur 自動偵測時產生「特殊情況」
- 根目錄有 `package.json`（Monorepo）
- `apps/api` 有 Dockerfile
- Zeabur 不知道該用哪個模式，導致混用

**Never Break Userspace**：這不是程式碼問題，是部署設定問題

## 解決方案（已驗證可行）

### 方案 A：簡化 Dockerfile（推薦）
使用最簡單、可靠的 Dockerfile：

```dockerfile
FROM node:22-slim AS base
WORKDIR /app

# 安裝 pnpm 和依賴
FROM base AS deps
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/database/package.json ./packages/database/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# 複製所有程式碼並 Build
FROM base AS builder
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter=database run db:generate
RUN pnpm --filter=api run build

# 產生 Runtime Image
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "dist/main"]
```

### 方案 B：暫時方案（快速驗證）
如果 Docker 一直有問題，先用 **單純的 Node.js 部署**驗證邏輯：

1. **修改 `apps/api/package.json`**：
   ```json
   "start": "pnpm run build && node dist/main"
   ```
2. 在 Zeabur 選擇 **Node.js** 模式
3. Root Directory: `apps/api`
4. Start Command: `pnpm start`

這樣可以先讓系統跑起來，確認邏輯正確後，再回來優化 Docker。

## 我的建議
1. **先用方案 B** 跑起來（5 分鐘內見效）
2. 確認 API 邏輯正確後
3. 再回來優化方案 A 的 Dockerfile

這符合 Linus 的 **Pragmatism（實用主義）**：先解決問題，再追求完美。
