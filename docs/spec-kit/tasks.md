# 滑雪教學評量系統：TDD 實作任務清單

## Phase 0: 走路骨架 (Walking Skeleton)
**目標**：建立可部署的空殼，驗證 CI/CD 與 DB 連線。

### 0.1 Monorepo 初始化
- [ ] 建立 `pnpm-workspace.yaml` 與根目錄 `package.json`。
- [ ] 初始化 `packages/database`:
  - [ ] 安裝 Prisma, TypeScript。
  - [ ] 建立基礎 `schema.prisma` (僅含 User 表作測試)。
  - [ ] 匯出 Prisma Client。
- [ ] 初始化 `apps/api` (NestJS):
  - [ ] 安裝 NestJS CLI 產生的基礎架構。
  - [ ] 設定 `docker-compose.yml` (Postgres)。
  - [ ] **TDD**: 寫一個測試，驗證能連線到 `packages/database` 的 Prisma Client。
- [ ] 初始化 `apps/web` (Next.js):
  - [ ] 安裝 Next.js 基礎架構。
  - [ ] 建立簡單首頁顯示 "DIY Ski Assessment System"。

### 0.2 部署管線 (Zeabur)
- [ ] 撰寫 `apps/api/Dockerfile`:
  - [ ] 使用 Multi-stage build。
  - [ ] 確保 `prisma generate` 在 build 階段執行。
- [ ] 建立 `zeabur.json` (Service Config)。
- [ ] **User Action**: 在 Zeabur 建立專案並綁定 GitHub。
- [ ] **Verification**:
  - [ ] API 回傳 Hello World。
  - [ ] API `/health` 端點回傳 DB 連線狀態。
  - [ ] Web 顯示首頁。

---

## Phase 1: 資料核心 (Data Core)
**目標**：實作核心資料結構與種子資料。

### 1.1 Schema 設計 (Prisma)
- [ ] 定義 `User` (含 `booking_system_id`)。
- [ ] 定義 `Ability`, `AbilityLevel`, `SportType`。
- [ ] 定義 `LessonRecord`, `Assessment`。
- [ ] 執行 `prisma migrate dev` 建立 Migration。

### 1.2 資料種子 (Seeding) - TDD
- [ ] **Red**: 撰寫測試 `seed.spec.ts`。
  - [ ] 預期：執行 seed 後，DB 應包含 179 項能力。
  - [ ] 預期：Sport Type 應包含 Ski 與 Snowboard。
- [ ] **Green**: 實作 `prisma/seed.ts`。
  - [ ] 讀取 `abilitylist.csv` (模擬或實際檔案)。
  - [ ] 解析並 Upsert 到 DB。
- [ ] **Refactor**: 優化 Seed 效能 (Batch Insert)。

---

## Phase 2: 席位認領 (Seat Claiming) - TDD
**目標**：學生輸入邀請碼綁定帳號。

### 2.1 Backend Service
- [ ] **Red**: `SeatService.spec.ts` (Integration Test with Testcontainers)。
  - [ ] Case: 有效 Code -> 回傳 Seat Info。
  - [ ] Case: 無效 Code -> Throw NotFoundException。
  - [ ] Case: Claim -> User created/linked -> Seat status updated.
- [ ] **Green**: 實作 `SeatService` 與 `SeatController`。
- [ ] **Refactor**: 確保 Error Handling 符合 API 規範。

### 2.2 Frontend UI
- [ ] **Red**: `ClaimPage.test.tsx` (React Testing Library)。
  - [ ] 測試輸入框存在。
  - [ ] 測試送出後顯示 Loading -> Success/Error。
- [ ] **Green**: 實作 UI Component。
- [ ] **Refactor**: 抽離 API Call 至 Custom Hook。

