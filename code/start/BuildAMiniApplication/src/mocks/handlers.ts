import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/todos', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('_page') ?? 1)
    const limit = Number(url.searchParams.get('_limit') ?? 6)
    const start = (page - 1) * limit
    return HttpResponse.json(Array.from({ length: limit }, (_, index) => ({ id: start + index + 1, title: `Todo item ${start + index + 1}`, completed: (start + index) % 2 === 0, userId: 1 })))
  }),
]