import { httpClient } from './httpClient'

export const BOOKING_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']

export async function createBooking(payload) {
  const { data } = await httpClient.post('/bookings', payload)
  return data
}

export async function fetchMyBookings() {
  const { data } = await httpClient.get('/bookings/mine')
  return data
}

export async function fetchAllBookings(filters = {}) {
  const params = {}
  if (filters.status) params.status = filters.status
  if (filters.resourceId?.trim()) params.resourceId = filters.resourceId.trim()
  if (filters.userId?.trim()) params.userId = filters.userId.trim()
  if (filters.fromDate) params.fromDate = filters.fromDate
  if (filters.toDate) params.toDate = filters.toDate
  const { data } = await httpClient.get('/bookings', { params })
  return data
}

export async function approveBooking(id) {
  const { data } = await httpClient.patch(`/bookings/${id}/approve`)
  return data
}

export async function rejectBooking(id, reason) {
  const { data } = await httpClient.patch(`/bookings/${id}/reject`, { reason })
  return data
}

export async function cancelBooking(id) {
  const { data } = await httpClient.patch(`/bookings/${id}/cancel`)
  return data
}
