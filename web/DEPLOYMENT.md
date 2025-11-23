# Frontend 部署指南

## 🌐 Backend API

**URL**: https://ski-learning.zeabur.app

## 📦 Zeabur 部署步驟

### 1. 登入 Zeabur
訪問: https://zeabur.com

### 2. 建立新 Service
1. 選擇現有專案或建立新專案
2. 點擊 "Add Service"
3. 選擇 "Git"
4. 選擇 `ski-learning` repository
5. 選擇 `zeabur-simple-structure` 分支

### 3. 設定 Root Directory
**重要**: 在 Service 設定中，設定 Root Directory 為 `web`

### 4. 設定環境變數
在 Zeabur Dashboard 中設定:
- **變數名稱**: `NEXT_PUBLIC_API_URL`
- **值**: `https://ski-learning.zeabur.app`

### 5. 部署
點擊 "Deploy" 開始自動建置和部署

### 6. 取得網址
部署完成後，Zeabur 會提供一個網址，例如:
- `https://web-xxx.zeabur.app`

---

## 🧪 本地測試

```bash
# 1. 進入 web 目錄
cd web

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

訪問: http://localhost:3000

---

## ✅ 驗證部署

### 測試席位認領
1. 訪問 `/claim`
2. 輸入邀請碼: `INVITE100`
3. 查看席位資訊
4. 填寫 Email 並認領
5. 填寫身份表單

### 測試能力清單
1. 訪問 `/abilities`
2. 查看 179 項能力
3. 測試篩選功能

---

## 🔧 故障排除

### 問題 1: API 連線失敗
**檢查**: 環境變數 `NEXT_PUBLIC_API_URL` 是否正確設定

### 問題 2: 建置失敗
**檢查**: Root Directory 是否設定為 `web`

### 問題 3: 頁面空白
**檢查**: 瀏覽器 Console 是否有錯誤訊息
