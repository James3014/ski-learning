# 滑雪教學評量系統：重構實作計畫

參考規格：`sdd-T-spec_20251002.md`

---

## 1. 開發哲學與策略 (Linus Principles)

### 核心原則
- **Good Taste (好品味)**：
  - **資料結構優先**：在寫任何 code 之前，先定義清楚 Data Structure。爛程式碼是為了掩蓋爛資料結構。
  - **消除特殊情況**：不要在 UI 或 Service 層寫一堆 `if (student.hasAccount)`。設計統一的介面來處理不同狀態。
- **Walking Skeleton (走路骨架)**：
  - **部署優先**：第一天就打通 Zeabur 部署。任何無法部署的程式碼都是無效的。
  - **增量交付**：每次只做一個垂直切片 (Vertical Slice)，例如「僅席位認領」，從 DB 到 UI 全通。
- **TDD (測試驅動開發)**：
  - **Red-Green-Refactor**：先寫會失敗的測試 (Red)，實作最簡單的邏輯讓它通過 (Green)，然後用 Good Taste 重構 (Refactor)。
  - **整合測試為主**：單元測試 mock 太多會失真。我們使用 **Testcontainers** (Postgres) 進行真實的 Service/Repository 測試。

---

## 2. Phase 0: 走路骨架 (The Foundation)
**目標**：建立一個「空的」但「活著」的系統。
- **Monorepo 架構** (Turborepo + pnpm)：
  - `apps/api`: NestJS (Backend)
  - `apps/web`: Next.js (Frontend)
  - `packages/database`: Prisma Schema & Client (Shared)
  - `packages/config`: Shared TSConfig, ESLint
- **基礎設施 (Infrastructure)**：
  - **Docker**: 多階段建置 (Multi-stage build)，優化 Image 大小。
  - **Zeabur**: 設定 `zeabur.json` (若需)，確認環境變數注入 (DATABASE_URL, REDIS_URL)。
  - **CI/CD**: GitHub Actions 確保每次 Push 都能 Build 通過。
- **驗證標準**：
  - 網址可訪問，API 回傳 `{ status: 'ok', db: 'connected' }`。

---

## 3. Phase 1: 資料核心 (The Soul)
**目標**：將 CSV 轉化為強型別的資料庫結構。
- **Schema 設計 (Prisma)**：
  - `User`: 增加 `booking_system_id` (Nullable) 以對應訂課平台。
  - `Ability`: 定義能力矩陣 (Sport -> Level -> Ability)。
  - `LessonRecord` / `Assessment`: 核心業務表。
- **資料種子 (Seeding)**：
  - 來源：`abilitylist.csv` (不直接讀檔，而是作為 Seed Source)。
  - 策略：撰寫冪等 (Idempotent) 的 Seed Script，每次部署自動執行，確保 DB 資料與 CSV 一致。
- **TDD 重點**：
  - 測試 Seed Script：確保匯入後筆數正確、關聯正確。
  - 測試 Schema Constraint：確保不能建立違反業務邏輯的資料。

---

## 4. Phase 2: 垂直切片 - 席位認領 (First Feature)
**目標**：學生輸入邀請碼 -> 系統識別 -> 綁定/建立帳號。
- **Backend (NestJS)**：
  - `SeatService.claim(code, studentInfo)`
  - 邏輯：驗證 Code -> 檢查 `booking_system_id` -> 建立/更新 User -> 寫入 `SeatClaim`。
- **Frontend (Next.js)**：
  - 認領頁面 (Wizard Form)：輸入代碼 -> 確認資訊 -> 填寫個資 -> 完成。
- **TDD 重點**：
  - **Case 1 (Happy Path)**: 有效代碼 -> 成功綁定。
  - **Case 2 (Edge Case)**: 代碼過期/無效 -> 錯誤訊息 (不准 Crash)。
  - **Case 3 (Integration)**: 模擬訂課平台帳號已存在 -> 自動關聯。

---

## 5. Phase 3: 垂直切片 - 教練評量 (Core Value)
**目標**：教練快速對學生進行能力打分。
- **Backend**：
  - `AssessmentService.submit(coachId, studentId, ratings[])`
  - 邏輯：檢查權限 -> 寫入評量 -> 計算進度 (Progress)。
- **Frontend**：
  - 評量矩陣 UI：支援批次打分、繼承上一次評量。
- **TDD 重點**：
  - 測試「繼承邏輯」：確保繼承的是「最近一次」且「同一運動」的紀錄。

---

## 6. 測試與發布策略
- **測試層級**：
  - **E2E (Playwright)**: 模擬真實使用者操作 (部署後驗證)。
  - **Integration (Jest + Testcontainers)**: 驗證 API 與 DB 的互動 (開發中驗證)。
- **部署流程**：
  - Dev: Push to `main` -> Zeabur 自動部署。
  - Prod: Tag Release -> Zeabur Promote (未來規劃)。
