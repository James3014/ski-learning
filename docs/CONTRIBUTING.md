# CONTRIBUTING

## 目標
維持 Linus 好品味：先弄清資料，消除特殊 case、不破壞 userspace。任何變更都要和 `linus-principles.md`、`test-strategy.md` 對齊。

## 開發流程
1. **Issue 分析**：回覆三個問題，列出五層思考；若仍有疑慮先討論再動手。
2. **分支命名**：`feat/<owner>/<description>`、`fix/<owner>/<short>`，保持簡潔。
3. **TDD 實作**：先寫測試再寫 code，測試需涵蓋資料處理的 default path。
4. **重構與清理**：功能通過後，重構 helper 確保 ≤3 層縮排。

## 程式碼風格
- **縮排**：4 spaces，函數不能超過 3 個 if/else 層級。
- **命名**：Data Structure 用名詞，action function 用動詞，例如 `CourseSummaryBuilder`、`retryFetchCourse`。
- **註解**：只在複雜邏輯/資料契約處加入簡短註解，避免 obvious comment。
- **資料結構**：如果 UI 需要 3 個欄位，資料模型就直接定三個欄位；不要在 UI 再額外組合。

## Git 流程
- `main` 為穩定線，PR 前 rebase 最新 `main`。
- commit message：`<scope>: <why>`，例如 `coach-dashboard: ensure retry flag`。
- Pull request template需填：目的、資料模型、測試、Linus 三問與五層回答。

## PR Checklist
- [ ] ✅ Three Linus questions answered in PR description.
- [ ] ✅ Five-layer checklist filled (data structure, special case, complexity, risk, practicality).
- [ ] ✅ Tests exist for every new behavior and reflect TDD cycle (紅、綠、重構 steps).
- [ ] ✅ Architecture changes referenced in `docs/architecture-overview.md` or spec files.
- [ ] ✅ Manual verification for UI flows with actual data (or fixture) noted.

## 互評 expectations
- Review comments must cite data structure or special case; no vague "this is wrong".
- If review triggers new requirement, update spec doc first, then adjust tests/code.
- When approving, confirm tests run and no JSON schema breaking change introduced.
