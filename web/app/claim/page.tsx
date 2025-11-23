'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InviteCodeInput from '@/components/InviteCodeInput'
import { api, ApiError } from '@/lib/api'

export default function ClaimPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seatInfo, setSeatInfo] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [claiming, setClaiming] = useState(false)

  const handleCodeComplete = async (inviteCode: string) => {
    setCode(inviteCode)
    setLoading(true)
    setError('')

    try {
      const data = await api.getSeat(inviteCode)
      setSeatInfo(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('無法連接到伺服器')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!email || !code) return

    setClaiming(true)
    setError('')

    try {
      const result = await api.claimSeat({ code, studentEmail: email })
      // Navigate to identity form
      router.push(`/claim/${result.seatId}/identity`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('認領失敗，請稍後再試')
      }
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
        <button
          onClick={() => router.back()}
          className="text-slate-800 dark:text-white flex size-12 shrink-0 items-center justify-center"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          認領課程席位
        </h2>
        <div className="size-12"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-center pb-16">
        {!seatInfo ? (
          <>
            <h2 className="text-slate-800 dark:text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              請輸入您的8位課程邀請碼以加入課程
            </h2>
            <div className="flex justify-center px-4 py-3">
              <InviteCodeInput onComplete={handleCodeComplete} disabled={loading} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              邀請碼已透過Email或簡訊發送給您，請檢查您的信箱。
            </p>
            {error && (
              <p className="text-red-500 text-sm text-center px-4">{error}</p>
            )}
            {loading && (
              <p className="text-slate-500 text-sm text-center px-4">查詢中...</p>
            )}
          </>
        ) : (
          <>
            <div className="px-4 py-6">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mb-6">
                <h3 className="text-slate-800 dark:text-white text-xl font-bold mb-4">
                  課程資訊
                </h3>
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <p><strong>雪場：</strong>{seatInfo.lesson.resort}</p>
                  <p><strong>日期：</strong>{new Date(seatInfo.lesson.date).toLocaleDateString('zh-TW')}</p>
                  <p><strong>席位號碼：</strong>{seatInfo.seat.seatNumber}</p>
                  <p><strong>狀態：</strong>{seatInfo.seat.status}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
                  學生 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
                  placeholder="your@email.com"
                  disabled={claiming}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}
            </div>

            <div className="px-4 py-3 sticky bottom-0 bg-background-light dark:bg-background-dark">
              <button
                onClick={handleClaim}
                disabled={!email || claiming}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400"
              >
                <span className="truncate">
                  {claiming ? '認領中...' : '認領席位'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
