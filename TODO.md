# 滑雪教學評量系統 - TODO

**最後更新**: 2025-11-22  
**當前狀態**: 本地驗證完成，準備 Zeabur 部署

---

## ✅ 已完成 (2025-11-22)

### 本地驗證
- [x] 本地建置測試通過
- [x] 配置檔案驗證測試通過（11/11）
- [x] PORT 環境變數處理測試通過
- [x] API 端點測試通過
- [x] 健康檢查端點測試通過
- [x] CORS 設定測試通過
- [x] 回應時間測試通過（< 2 秒）

### 測試檔案
- [x] 建立配置檔案驗證測試
- [x] 建立 API 端點整合測試
- [x] 設定 Jest 測試框架

### 文件
- [x] 建立 DEPLOYMENT_GUIDE.md
- [x] 更新 README.md
- [x] 建立 Zeabur 部署 spec

---

## 🔥 立即執行 (今天)

### 1. Zeabur 部署
請參考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 進行部署

- [ ] 登入 Zeabur Dashboard
- [ ] 建立 PostgreSQL Service
- [ ] 複製 DATABASE_URL
- [ ] 建立 API Service
- [ ] 設定環境變數（DATABASE_URL, NODE_ENV）
- [ ] 觸發部署
- [ ] 監控部署日誌

### 2. 驗證測試
- [ ] 訪問 `https://your-domain/`
- [ ] 訪問 `https://your-domain/health`
- [ ] 確認資料庫連線正常（db: "connected"）
- [ ] 確認回應時間 < 2 秒

---

## 📅 本週任務 (Phase 0 完成)

### 資料庫 Schema
- [ ] 擴展 User model (role, booking_system_id)
- [ ] 建立 Ability model
- [ ] 建立 LessonRecord model
- [ ] 建立 Assessment model
- [ ] 執行 migration

### Prisma Service
- [ ] 建立 PrismaModule
- [ ] 建立 PrismaService
- [ ] 整合到 AppModule
- [ ] 測試連線

---

## 📅 下週任務 (Phase 1)

### 資料種子
- [ ] 建立 seed.ts
- [ ] 匯入能力清單資料
- [ ] 測試 seeding

### API 基礎
- [ ] User CRUD API
- [ ] Ability 查詢 API
- [ ] 錯誤處理中介層

---

## 📅 未來規劃

### Phase 2: 席位認領
- [ ] SeatService
- [ ] SeatController
- [ ] 測試

### Phase 3: 學生自評
- [ ] AssessmentService
- [ ] 自評 API
- [ ] 測試

### Phase 4: 教練評量
- [ ] 教練評量 API
- [ ] 繼承邏輯
- [ ] 測試

### Phase 5: 前端
- [ ] Next.js 專案
- [ ] UI 實作
- [ ] 整合測試

---

## 🐛 已知問題

### 已解決
- ✅ PORT 綁定問題 (已改為動態)
- ✅ Prisma Client 生成問題 (已添加 postinstall)
- ✅ 健康檢查端點改善

### 待解決
- ⏳ Zeabur 實際部署驗證
- ⏳ 資料庫 Schema 完整設計
- ⏳ 前端專案初始化

---

## 📝 備註

### Zeabur 部署要點
1. 使用 `process.env.PORT` (動態)
2. 綁定到 `0.0.0.0` (允許外部訪問)
3. `postinstall` 執行 `prisma generate`
4. `build` 包含 `prisma generate`
5. 環境變數必須設定 `DATABASE_URL`

### 開發原則
1. 先部署再開發 (Walking Skeleton)
2. 每個功能都要有測試
3. 資料結構優先於程式碼
4. 增量交付,垂直切片

---

**下一步**: 執行 Zeabur 部署
