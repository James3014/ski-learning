# Architecture Overview

## 一句話使命
以 Linus 的好品味與實用主義，建立一套不破壞既有使用者空間的線上教學評量系統，讓學生、教練與管理員都可以在乾淨的資料結構上快速做決策。

## 視角分層（Student → Coach → Admin）
```
Student Layer ─► Data Capture ─► Insight Generation ─► Governance ─► Admin Layer
          │                │                        │
          ▼                ▼                        ▼
      互動紀錄          教練策略                  系統政策
```
這個分層強調資料只應該被撈一次、轉一次、呈現一次，以防止多重特殊 case。

## UI ↔ 資料結構映射
### 學生視角畫面
┌──────────────┬────────────────────────────┬────────────────────────────┬──────────────┐
│ 畫面           │ 顯示欄位                         │ 資料結構（Key fields）            │ 依賴來源       │
├──────────────┼────────────────────────────┼────────────────────────────┼──────────────┤
│ 學生席位認領       │ 席位清單、狀態、到期提醒                 │ SeatSlot { id, status, deadline } │ 報名 API、排位服務 │
│ 學生能力進度趨勢    │ 能力指標時間線、趨勢曲線、標準值             │ ProgressPoint { metric, value, timestamp } │ 評量 API         │
│ 學生評量結果詳情    │ 指標與分數、評論、行動建議                 │ AssessmentResult { metricId, score, advice } │ 評量 API         │
│ 學生課前自評       │ 問題、答案、補充文字、日期                 │ PreClassSelfReport { questionId, answer, note } │ 自評 API         │
│ 學生課程歷史列表    │ 課程摘要、評價、進度                      │ CourseHistory { courseId, status, rating } │ 課程紀錄服務       │
└──────────────┴────────────────────────────┴────────────────────────────┴──────────────┘

### 教練視角畫面
┌──────────────┬────────────────────────────┬────────────────────────────┬──────────────┐
│ 畫面           │ 顯示欄位                         │ 資料結構（Key fields）            │ 依賴來源       │
├──────────────┼────────────────────────────┼────────────────────────────┼──────────────┤
│ 教練今日課程儀表板   │ 今日課程清單、學生提醒、即時 alert           │ CourseSummary { courseId, students[], status } │ 課程 API、Alert service │
│ 教練學生列表       │ 學生姓名、狀態、最近評量、關注標籤            │ StudentProfile { id, readiness, lastAssessment } │ CRM / 評量 DB     │
│ 教練教學紀錄表單     │ 記錄欄位、附件、行動計畫                   │ TeachingRecord { courseId, summary, attachments[] } │ Log service      │
│ 教練歷史教學紀錄     │ 授課列表、趨勢、搜尋                       │ TeachingSummary { courseId, date, impactMetrics } │ Log storage      │
│ 教練課程基本資料選擇 │ 模板、教室、設備、時間                     │ CourseSetup { templateId, roomId, equipment[] } │ Config service   │
└──────────────┴────────────────────────────┴────────────────────────────┴──────────────┘

### 管理員視角畫面
┌──────────────┬────────────────────────────┬────────────────────────────┬──────────────┐
│ 畫面           │ 顯示欄位                         │ 資料結構（Key fields）            │ 依賴來源       │
├──────────────┼────────────────────────────┼────────────────────────────┼──────────────┤
│ 管理員儀表板      │ KPI、報表摘要、系統狀態                    │ AdminDashboard { kpis[], alerts[] } │ Analytics API  │
│ 管理員報表與分析    │ 篩選條件、圖表資料、匯出連結                 │ ReportPayload { dateRange, metrics[], exportUrl } │ BI service     │
│ 管理員字典維護     │ 字典列表、新增/刪除、變更時間                 │ DictionaryEntry { key, value, updatedAt } │ Dictionary store │
│ 管理員課程管理     │ 課程列表、狀態切換                         │ CourseManagement { courseId, status, metadata } │ Course service │
└──────────────┴────────────────────────────┴────────────────────────────┴──────────────┘

## 資料流程與依賴
```
Frontend Form → API Gateway → Coach Service → Persisted Store
        │              │                   │
        ▼              ▼                   ▼
    UI rendering   Data validation     Invariant check
```
- 所有輸入都經過 validation helpers，最多只有一層 if/else，避免複雜度超標。
- API Gateway 只從上層服務取得已標準化的 payload，減少前端特殊 case。

## Invariants 與 Linus 檢查清單
- 保持資料結構簡潔：每個 table/畫面只用一個 data model，避免 UI 端再重新 brick。
- 「三個問題Ｘ五層思考」：每次新 feature 前先問，是問題還是臆想、有無更簡方案、會不會破壞 userspace？
- “好品味”補丁：若有 missing field，直接 default 但不在 UI 加 if/else 分支；錯誤只透過 banner 告知，不重建整頁。
- 所有 API 變動需對應 TDD test case（紅、綠、重構）的清單。[可連至 test-strategy.md]

## 下一步
1. 把每張 UI 的資料結構、依賴與 TDD test case 寫成 specs，並把表格放在 docs/spec-kit 目錄。
2. 在 CI pipeline 加入 TDD gate：每次修改前先有測試、再重構。
3. 持續用 Linus 鼓勵的回饋機制：PR review 時先檢查資料結構，確保 @components 沒有額外 if/else。
