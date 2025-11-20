# Test Strategy

## 核心原則
採用 TDD（紅→綠→重構）的循環、Linus 的數據導向與不破壞使用者空間。任何新功能先寫 Failing Test，再實作、最後重構與清理 data model。

## TDD 循環
```
  1. 紅：寫出最簡的測試場景（例如：CourseSummary 內有 readiness score），先看到失敗。
  2. 綠：最笨、最直的方式通過測試，保證行為。Error handling 先用 default data，UI 不崩。
  3. 重構：抽 helper、移除重複、保證 ≤3 層縮排，並為 helper 寫 unit test。
```
這個循環要在每個 PR 裡寫清楚：PR 描述需列出每個測試的預期行為、失敗時的 fallback。若測試還沒寫就不能 merge。

## 測試金字塔
```
    ┌──────────────┐
    │ System Tests  │ － 使用者流程、非功能
    ├──────────────┤
    │ Integration   │ － 多個 service/資料流
    ├──────────────┤
    │ Unit Tests    │ － 資料組裝、helper
    └──────────────┘
``` 
- **單元測試**：聚焦資料型別轉換、Linus 的 default filler、每個 Linus 判斷的邏輯分支。先寫資料驗證 helper，再選擇 UI/Controller。
- **整合測試**：測試 API Gateway 與 Coach Service 之間的 payload，一但資料缺欄位仍能 fallback。UI 測試只關注 render，不做 business logic。
- **系統測試**：驗證 end-to-end flow（例如教練儀表板 fetch + render + retry），以確保不破壞 userspace。

## 命名與測試資料
- 命名：`module.unit.test.ts` 針對 module，`scenario` 需描述 expected behavior。
- Fixture：每個畫面的 JSON sample 保存在 `tests/fixtures/<畫面名>/`，便於重複使用。
- 特殊 case：若 API 回傳部分缺欄，測試資料要精準補 default，避免 UI 端再加 if/else。

## CI / Gatekeeping
1. **Pre-merge hook**：必須有 lint + `npm test -- --runInBand`（或 equivalent）先跑。若測試漏掉會 fail gate。
2. **TDD proof**：PR template 要包含「Tests added」欄位、列出 why/how 的 TDD steps。
3. **回溯問題**：如果測試跑不到某片段，記錄在 issue 內並 link，保持 traceability。

## 失敗處理與風險
- 所有測試 failure 先 stop，不要 moderate, 直接退給作者。原因要寫在 test log 上。
- 若測試環境與 production 差距太大，要備註『差異』並在 production checklist 裡列出 potential regressions。
- Risk: UI 端用測試資料以外 payload（Missing field），測試要模擬 fallback path。
