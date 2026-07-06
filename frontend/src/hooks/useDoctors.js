import { useState, useEffect, useCallback } from 'react'
import doctorService from '../services/doctor.service'

export function useDoctors(initialParams = {}) {
  const [doctors, setDoctors] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [params, setParams] = useState(initialParams)

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await doctorService.getDoctors({
        page: currentPage,
        limit: 10,
        ...params,
      })
      setDoctors(res.data || [])
      setTotal(res.total || 0)
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, params])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

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
    doctors,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,
    refetch,
    updateParams,
    resetParams,
    params,
  }
}
