# DIY Ski Assessment System - Frontend

Next.js 14 前端應用程式

## 功能

### ✅ 已完成
- 學生席位認領流程
  - 邀請碼輸入（8位，自動跳轉）
  - 席位資訊查詢
  - 席位認領
  - 身份表單提交
- 能力清單頁面
  - 顯示 179 項能力
  - 按運動類型篩選（SKI/SNOWBOARD）
  - 按級別篩選（Level 1-5）

## 技術棧

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Material Symbols Icons

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置
npm run build

# 生產模式
npm run start
```

## 環境變數

建立 `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 頁面路由

- `/` - 首頁
- `/claim` - 席位認領
- `/claim/[seatId]/identity` - 身份表單
- `/claim/success` - 認領成功
- `/abilities` - 能力清單

## API 整合

所有 API 呼叫透過 `lib/api.ts` 統一管理：

- `api.getSeat(code)` - 查詢席位
- `api.claimSeat(data)` - 認領席位
- `api.submitIdentity(seatId, data)` - 提交身份表單
- `api.getAbilities(params)` - 查詢能力清單

## 設計特點

- Dark Mode 支援
- 響應式設計
- Material Design 風格
- 自動表單驗證
- 錯誤處理和 Loading 狀態
