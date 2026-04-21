import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const RESOURCE_TYPES = [
  'LECTURE_HALL',
  'LAB',
  'MEETING_ROOM',
  'EQUIPMENT',
]

export const RESOURCE_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE']

export async function fetchResources() {
  const { data } = await client.get('/resources')
  return data
}

export async function searchResources(filters) {
  const params = {}
  if (filters.type) params.type = filters.type
  if (filters.location?.trim()) params.location = filters.location.trim()
  if (filters.minCapacity !== '' && filters.minCapacity != null) {
    params.minCapacity = Number(filters.minCapacity)
  }
  const { data } = await client.get('/resources/search', { params })
  return data
}

export async function createResource(payload) {
  const { data } = await client.post('/resources', payload)
  return data
}

export async function updateResource(id, payload) {
  const { data } = await client.put(`/resources/${id}`, payload)
  return data
}

export async function deleteResource(id) {
  await client.delete(`/resources/${id}`)
}

export async function getResourceById(id) {
  const { data } = await client.get(`/resources/${id}`)
  return data
}
