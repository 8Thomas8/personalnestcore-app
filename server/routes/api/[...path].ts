export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''
  const backendUrl = `${process.env.API_URL}${path}`

  const response = await $fetch.raw(backendUrl, {
    method: event.node.req.method,
    headers: getRequestHeaders(event),
    body: event.node.req.method !== 'GET' ? await readRawBody(event) : undefined,
  })

  for (const [key, value] of Object.entries(response.headers)) {
    setResponseHeader(event, key, value as string)
  }

  return response._data
})
