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
    const raw = typeof data.message === 'string' ? data.message : JSON.stringify(data.message)
    if (
      err?.response?.status === 404 &&
      typeof data.message === 'string' &&
      data.message.includes('No static resource')
    ) {
      return (
        `${raw} ` +
        'Usually this means the backend on port 8080 is an old build without the booking API. ' +
        'Stop the running Java process, then from the backend folder run: .\\mvnw.cmd spring-boot:run'
      )
    }
    return raw
  }
  return err?.message ?? 'Request failed'
}
