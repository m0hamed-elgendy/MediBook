import { useState, useEffect, useCallback } from 'react'
import appointmentService from '../services/appointment.service'

export function useAppointments(fetchFn = 'getAll', initialParams = {}) {
  const [appointments, setAppointments] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [params, setParams] = useState(initialParams)

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const serviceFn = appointmentService[fetchFn]
      if (!serviceFn) throw new Error(`Invalid fetch function: ${fetchFn}`)
      const res = await serviceFn({
        page: currentPage,
        limit: 10,
        ...params,
      })
      setAppointments(res.data || [])
      setTotal(res.total || 0)
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, params, fetchFn])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

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
    appointments,
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
