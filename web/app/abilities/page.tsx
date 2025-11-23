'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiError } from '@/lib/api'

type Ability = {
  id: number
  name: string
  category: string
  sportType: string
  skillLevel: number
  sequenceInLevel: number
  description: string
}

export default function AbilitiesPage() {
  const router = useRouter()
  const [abilities, setAbilities] = useState<Ability[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sportType, setSportType] = useState<string>('')
  const [skillLevel, setSkillLevel] = useState<number | undefined>()

  useEffect(() => {
    loadAbilities()
  }, [sportType, skillLevel])

  const loadAbilities = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await api.getAbilities({
        sportType: sportType || undefined,
        skillLevel,
      })
      setAbilities(data.data)
      setTotal(data.total)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('無法載入能力清單')
      }
    } finally {
      setLoading(false)
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
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          能力清單 ({total})
        </h2>
        <div className="size-12"></div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setSportType('')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              sportType === ''
                ? 'bg-primary text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setSportType('ski')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              sportType === 'ski'
                ? 'bg-primary text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            SKI
          </button>
          <button
            onClick={() => setSportType('snowboard')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              sportType === 'snowboard'
                ? 'bg-primary text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            SNOWBOARD
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSkillLevel(undefined)}
            className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${
              skillLevel === undefined
                ? 'bg-primary text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            所有級別
          </button>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setSkillLevel(level)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${
                skillLevel === level
                  ? 'bg-primary text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
              }`}
            >
              Level {level}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">載入中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={loadAbilities}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold"
            >
              重試
            </button>
          </div>
        ) : abilities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">沒有找到能力項目</p>
          </div>
        ) : (
          <div className="space-y-3">
            {abilities.map((ability) => (
              <div
                key={ability.id}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-slate-800 dark:text-white font-bold text-lg">
                    {ability.name}
                  </h3>
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                    L{ability.skillLevel}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                  {ability.description}
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                    {ability.category}
                  </span>
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded uppercase">
                    {ability.sportType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
