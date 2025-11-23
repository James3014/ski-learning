'use client'

import { useRef, KeyboardEvent, ChangeEvent } from 'react'

interface InviteCodeInputProps {
  length?: number
  onComplete: (code: string) => void
  disabled?: boolean
}

export default function InviteCodeInput({
  length = 8,
  onComplete,
  disabled = false,
}: InviteCodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleInput = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    e.target.value = value

    if (value.length > 0 && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }

    // Check if all inputs are filled
    const code = inputsRef.current
      .map((input) => input?.value || '')
      .join('')
    
    if (code.length === length) {
      onComplete(code)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  return (
    <fieldset className="relative flex gap-2 sm:gap-4" disabled={disabled}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          type="text"
          maxLength={1}
          className="flex h-14 w-10 sm:w-12 text-center text-slate-800 dark:text-white text-2xl font-bold bg-transparent focus:outline-0 focus:ring-0 border-0 border-b-2 border-slate-300 dark:border-slate-700 focus:border-primary disabled:opacity-50"
          onChange={(e) => handleInput(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
        />
      ))}
    </fieldset>
  )
}
