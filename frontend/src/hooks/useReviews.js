import { useState, useEffect, useCallback } from 'react'
import reviewService from '../services/review.service'

export function useReviews(fetchFn = 'getDoctorOwnReviews', initialParams = {}) {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 })
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [params, setParams] = useState(initialParams)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const serviceFn = reviewService[fetchFn]
      if (!serviceFn) throw new Error(`Invalid fetch function: ${fetchFn}`)
      const res = await serviceFn({
        page: currentPage,
        limit: 10,
        ...params,
      })
      setReviews(res.data || [])
      setTotal(res.total || 0)
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, params, fetchFn])

  const fetchSummary = useCallback(async (summaryFn = 'getDoctorOwnSummary') => {
    try {
      const serviceFn = reviewService[summaryFn]
      if (serviceFn) {
        const res = await serviceFn()
        setSummary(res || { averageRating: 0, totalReviews: 0 })
      }
    } catch {
      // silently fail for summary
    }
  }, [])

  useEffect(() => {
    fetchReviews()
    fetchSummary()
  }, [fetchReviews, fetchSummary])

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }))
    setCurrentPage(1)
  }, [])

  const resetParams = useCallback(() => {
    setParams({})
    setCurrentPage(1)
  }, [])

  const refetch = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    reviews,
    summary,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,
    refetch,
    updateParams,
    resetParams,
  }
}
