import { useState, useCallback } from 'react'
import { apiService } from '@/services/api'
import { Hotel, HotelListResponse } from '@/types'
import toast from 'react-hot-toast'

export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  })

  const fetchHotels = useCallback(
    async (page: number = 0, city?: string, minRating?: number) => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getHotels(page, 10, city, minRating)
        setHotels(response.data.content)
        setPagination({
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        })
      } catch (err) {
        const errorMessage = 'Failed to fetch hotels'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { hotels, loading, error, pagination, fetchHotels }
}

export const useHotel = (hotelId: number) => {
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHotel = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getHotelById(hotelId)
      setHotel(response.data)
    } catch (err) {
      const errorMessage = 'Failed to fetch hotel'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [hotelId])

  return { hotel, loading, error, fetchHotel }
}
