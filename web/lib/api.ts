const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(
        error.message || 'API request failed',
        response.status,
        error
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error', 0, error)
  }
}

export const api = {
  // Seats
  getSeat: (code: string) =>
    fetchApi<{
      code: string
      seat: { id: string; seatNumber: number; status: string }
      lesson: { id: number; date: string; resort: string }
      expiresAt: string
    }>(`/seats/${code}`),

  claimSeat: (data: { code: string; studentEmail: string }) =>
    fetchApi<{
      message: string
      seatId: string
      studentId: string
    }>('/seats/claim', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitIdentity: (
    seatId: string,
    data: {
      studentDisplayName: string
      birthDate: string
      contactEmail: string
      contactPhone: string
      isMinor: boolean
      guardianEmail?: string
      hasExternalInsurance: boolean
      insuranceProvider?: string
      note?: string
    }
  ) =>
    fetchApi<{
      message: string
      formId: string
    }>(`/seats/${seatId}/identity`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Abilities
  getAbilities: (params?: { sportType?: string; skillLevel?: number }) => {
    const query = new URLSearchParams()
    if (params?.sportType) query.set('sportType', params.sportType)
    if (params?.skillLevel) query.set('skillLevel', params.skillLevel.toString())
    
    return fetchApi<{
      total: number
      data: Array<{
        id: number
        name: string
        category: string
        sportType: string
        skillLevel: number
        sequenceInLevel: number
        description: string
      }>
    }>(`/abilities${query.toString() ? `?${query}` : ''}`)
  },
}
