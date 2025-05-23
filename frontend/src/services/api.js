const BASE = 'https://crud-api.backendvilla.workers.dev'

export default {
  getAll: async () => (await fetch(BASE)).json(),
  create: async (data) =>
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: async (data) =>
    await fetch(`${BASE}/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: async (id) =>
    await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
    }),
}
