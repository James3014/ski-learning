# UI 規格與 TDD 對應

本文件把 `教學評量ui/` 中現有畫面對應到資料結構、依賴來源，以及必須在 TDD 循環中保證的行為。每次新增畫面前，先在這裡補足欄位、資料模型與 fallback 的測試。

## 約定
- 所有畫面都應回應 Linus 的三個問題 + 五層思考：資料結構是否清楚、special case 是否消除、是否不破壞 userspace。
- TDD 測試至少涵蓋：正常資料、空資料/缺欄, API error（表現 fallback），現有 data model 不變情況下返還原 UI。

## 學生視角畫面
1. **學生席位認領**
   - 顯示欄位：席位清單、狀態（已認領/未認領）、過期提醒、教練/課程標籤。
   - 資料模型：`SeatSlot { id, slotType, status, deadline, coachId }`。
   - 依賴來源：報名 API、排位服務、課程模板。
   - TDD 測試：
     1. 有效資料：列出所有席位且按 deadline 排序。
     2. 無資料：顯示 empty state，不 throw。
     3. API error：保持既有資料、顯示 retry banner，回退原始 layout。
   - Linus 檢查：確保只有一個 data structure（`SeatSlot`）提供所有欄位，不在 UI 加 if/else。

2. **學生能力進度趨勢**
   - 顯示欄位：技能指標時間線、趨勢曲線、與標準值比較、狀態 chips。
   - 資料模型：`ProgressPoint { metric, value, timestamp, referenceValue }`。
   - 依賴來源：能力評量 API。
   - TDD 測試：
     1. 測試有 timeline 並 render 多點數據。
     2. 測試缺 timestamp：helper 應補預設值再 render。
     3. 測試 empty trend：UI 顯示提示，不改變 layout。

3. **學生評量結果詳情**
   - 顯示欄位：指標、得分、分數區間、教練評論、建議行動。
   - 資料模型：`AssessmentResult { metricId, score, range, comments[], recommendation }`。
   - 依賴來源：歷史評量 API。
   - TDD 測試：缺欄時 fallback default comment、分數超出時 clamp、API error 只顯示 banner。

4. **學生課前自評**
   - 顯示欄位：問題、選項、說明、日期、提交狀態。
   - 資料模型：`PreClassSelfReport { questionId, answer, note, submittedAt }`。
   - 依賴來源：自評 API。
   - TDD 測試：測試提交流程（紅：強制 fail 需 answer，綠：補足、重構後 extract validator）。

5. **學生課程歷史列表**
   - 顯示欄位：課程名稱、完成日期、評價、狀態標籤。
   - 資料模型：`CourseHistory { courseId, status, rating, completedAt }`。
   - 依賴來源：課程紀錄服務。
   - TDD 測試：狀態 switch 渲染、無資料 empty state、API timeout 退回原資料。

## 教練視角畫面
1. **教練今日課程儀表板**
   - 顯示欄位：今日課程清單、學生提醒、即時 alert、analytics headline。
   - 資料模型：`CourseSummary { courseId, title, startTime, coachStatus, studentHighlights[], analytics }`。
   - 依賴來源：課程 API、alert service、analytics service。
   - TDD 測試：
     1. 正常資料 render。
     2. `studentHighlights` 空陣列顯示 placeholder。
     3. API error 只顯示 banner、UI 不變。
   - Linus 重點：將 alert/analytics 抽成 helper，剩下 UI 只 render data model。

2. **教練學生列表**
   - 顯示欄位：學生名稱、狀態、最近評量、關注標籤、快速導航。
   - 資料模型：`StudentProfile { id, readiness, lastAssessment, tags[] }`。
   - 依賴來源：CRM、評量 DB。
   - TDD 測試：測試 tag filter、API return 500 fallback to cached list。

3. **教練教學紀錄表單**
   - 顯示欄位：課程紀錄欄位 (summary, plan), 附件、行動計畫。
   - 資料模型：`TeachingRecord { courseId, summary, plan, attachments[] }`。
   - 依賴來源：Log service。
   - TDD 測試：欄位驗證 (必填), 上傳失敗提示但不清空 field。

4. **教練歷史教學紀錄**
   - 顯示欄位：授課列表, 日期, 成效指標, 搜尋 filter。
   - 資料模型：`TeachingSummary { courseId, date, impactMetrics }`。
   - 依賴來源：歷史 log store。
   - TDD 測試：filter 變更, API error Retry indicator, search returns subset.

5. **教練課程基本資料選擇**
   - 顯示欄位：模板、教室、設備、時間區段、確認按鈕。
   - 資料模型：`CourseSetup { templateId, roomId, equipment[], timeSlot }`。
   - 依賴來源：Config service、room availability service。
   - TDD 測試：選擇變更、invalid slot prevents submit, fallback to default template.

## 管理員視角畫面
1. **管理員儀表板**
   - 顯示欄位：KPIs、報表摘要、系統狀態、alert counts。
   - 資料模型：`AdminDashboard { kpis[], alerts[], healthStatus }`。
   - 依賴來源：Analytics API。
   - TDD 測試：Health check fail banner, KPI update re-renders, empty data shows placeholder.

2. **管理員報表與分析**
   - 顯示欄位：篩選條件、圖表資料、匯出按鈕、日期範圍。
   - 資料模型：`ReportPayload { dateRange, metrics[], exportUrl }`。
   - 依賴來源：BI service。
   - TDD 測試：filter change, export link available, API error uses cache data.

3. **管理員字典維護**
   - 顯示欄位：字典條目、狀態、更新時間、新增/刪除按鈕。
   - 資料模型：`DictionaryEntry { key, value, updatedAt }`。
   - 依賴來源：Dictionary store + cache invalidation service。
   - TDD 測試：delete rollback, add new key ensures uniqueness, update default fallback.

4. **管理員課程管理**
   - 顯示欄位：課程列表、編輯按鈕、狀態切換、導出連結。
   - 資料模型：`CourseManagement { courseId, status, metadata }`。
   - 依賴來源：Course service。
   - TDD 測試：status change revert if API fails, metadata update triggers recalculation, empty list placeholder.

## 實作指引
- 將每張畫面的 UI 與資料模型對應到 `tests/fixtures/<畫面名>`，UIs 透過 fixture 取得 data model 來 render。
- TDD gate 要有三階段記錄：哪個測試先 fail（輸入資料），實作後通過，重構後 helper 也測試。
- 所有 fallback handler（empty state、error banner）都放在 shared component，有單元測試保障不破壞 layout。
