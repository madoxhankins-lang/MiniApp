export interface Todo { id: number; title: string; completed: boolean; userId: number }

export async function fetchTodos(page: number, limit: number): Promise<Todo[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${limit}`)
  if (!response.ok) throw new Error(`Request failed with status ${response.status}.`)
  return response.json() as Promise<Todo[]>
}