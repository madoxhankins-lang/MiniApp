import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import App from './App'
import { server } from './mocks/server'

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>)
}

describe('Todo ledger', () => {
  it('shows loading state and then renders the first page', async () => {
    renderApp()
    expect(screen.getByRole('status', { name: 'Loading todos' })).toBeInTheDocument()
    expect(await screen.findByText('Todo item 1')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Todo pages' })).toHaveTextContent('Page 1 of 34')
  })

  it('navigates pages and returns to cached data', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Todo item 1')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Todo item 7')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(await screen.findByText('Todo item 1')).toBeInTheDocument()
  })

  it('offers a retry action when the API fails', async () => {
    server.use(http.get('https://jsonplaceholder.typicode.com/todos', () => HttpResponse.error()))
    const user = userEvent.setup()
    renderApp()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText("Couldn't load this page.")).toBeInTheDocument()
    server.use(http.get('https://jsonplaceholder.typicode.com/todos', () => HttpResponse.json([{ id: 1, title: 'Recovered todo', completed: false, userId: 1 }])))
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(screen.getByText('Recovered todo')).toBeInTheDocument())
  })
})