'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api, ApiError } from '@/lib/api'

export default function IdentityFormPage() {
  const router = useRouter()
  const params = useParams()
  const seatId = params.seatId as string

  const [formData, setFormData] = useState({
    studentDisplayName: '',
    birthDate: '',
    contactEmail: '',
    contactPhone: '',
    isMinor: false,
    guardianEmail: '',
    hasExternalInsurance: false,
    insuranceProvider: '',
    note: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await api.submitIdentity(seatId, formData)
      router.push('/claim/success')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('提交失敗，請稍後再試')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
        <button
          onClick={() => router.back()}
          className="text-slate-800 dark:text-white flex size-12 shrink-0 items-center justify-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          填寫身份資料
        </h2>
        <div className="size-12"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 pb-24">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div>
            <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
              學生姓名 *
            </label>
            <input
              type="text"
              name="studentDisplayName"
              value={formData.studentDisplayName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
              出生日期 *
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
              聯絡 Email *
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
              聯絡電話 *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isMinor"
              checked={formData.isMinor}
              onChange={handleChange}
              className="w-5 h-5 text-primary bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-primary"
            />
            <label className="text-slate-800 dark:text-white text-sm">
              未成年人（需填寫監護人資料）
            </label>
          </div>

          {formData.isMinor && (
            <div>
              <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
                監護人 Email
              </label>
              <input
                type="email"
                name="guardianEmail"
                value={formData.guardianEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="hasExternalInsurance"
              checked={formData.hasExternalInsurance}
              onChange={handleChange}
              className="w-5 h-5 text-primary bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-primary"
            />
            <label className="text-slate-800 dark:text-white text-sm">
              已有外部保險
            </label>
          </div>

          {formData.hasExternalInsurance && (
            <div>
              <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
                保險公司
              </label>
              <input
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-800 dark:text-white text-sm font-bold mb-2">
              備註
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent focus:border-primary focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      </form>

      {/* Submit Button */}
      <div className="px-4 py-3 sticky bottom-0 bg-background-light dark:bg-background-dark">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 mx-auto"
        >
          <span className="truncate">
            {submitting ? '提交中...' : '提交'}
          </span>
        </button>
      </div>
    </div>
  )
}
