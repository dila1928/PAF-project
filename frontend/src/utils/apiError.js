/**
 * User-facing message for failed API calls (backend down, proxy refused, etc.).
 */
export function getApiErrorMessage(err) {
  if (!err?.response) {
    const code = err?.code
    const msg = err?.message ?? ''
    if (
      code === 'ERR_NETWORK' ||
      code === 'ECONNREFUSED' ||
      msg === 'Network Error' ||
      msg.includes('ECONNREFUSED')
    ) {
      return (
        'Cannot reach the API. Start the Spring Boot backend first (port 8080): ' +
        'open a terminal in backend\\backend and run .\\mvnw spring-boot:run, ' +
        'then refresh this page.'
      )
    }
  }
  const data = err?.response?.data
  if (data?.message != null) {
    return typeof data.message === 'string' ? data.message : JSON.stringify(data.message)
  }
  return err?.message ?? 'Request failed'
}
