import { keepPreviousData, useQuery } from '@tanstack/react-query'
import './App.css'

import { useState } from 'react'
import { fetchTodos, type Todo } from './api'

const PAGE_SIZE = 6
const TOTAL_TODOS = 200
const TOTAL_PAGES = Math.ceil(TOTAL_TODOS / PAGE_SIZE)

function TodoRow({ todo }: { todo: Todo }) {
  return <li className={`todo-row ${todo.completed ? 'todo-row--complete' : ''}`}><span className="todo-status" aria-hidden="true">{todo.completed ? '✓' : '○'}</span><span>{todo.title}</span><span className="todo-label">{todo.completed ? 'Done' : 'Open'}</span></li>
}

function App() {
  const [page, setPage] = useState(1)
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery({ queryKey: ['todos', page], queryFn: () => fetchTodos(page, PAGE_SIZE), placeholderData: keepPreviousData, staleTime: 60_000 })
  const completedCount = data?.filter((todo) => todo.completed).length ?? 0

  return (
    <main className="app-shell">
      <header className="app-header"><div><p className="eyebrow">Daily systems / 04</p><h1>Todo ledger</h1><p className="intro">A calm, paginated view of the work in motion.</p></div><div className="header-mark" aria-label="Todo ledger mark">TL</div></header>
      <section className="summary-grid" aria-label="Todo summary"><div className="summary-card"><span className="summary-label">Showing page</span><strong>{page.toString().padStart(2, '0')}</strong></div><div className="summary-card"><span className="summary-label">Visible complete</span><strong>{completedCount.toString().padStart(2, '0')}</strong></div><div className="summary-card summary-card--accent"><span className="summary-label">Total pages</span><strong>{TOTAL_PAGES.toString().padStart(2, '0')}</strong></div></section>
      <section className="todo-panel" aria-labelledby="ledger-heading"><div className="panel-heading"><div><p className="eyebrow">Open loop</p><h2 id="ledger-heading">Your todos</h2></div>{isFetching && !isLoading && <span className="sync-indicator">Syncing...</span>}</div>
        {isLoading && <LoadingState />}
        {isError && <div className="message-state" role="alert"><span className="message-icon">!</span><h3>Couldn&apos;t load this page.</h3><p>{error instanceof Error ? error.message : 'Something unexpected happened.'}</p><button className="button button--dark" onClick={() => void refetch()}>Try again</button></div>}
        {data && data.length === 0 && <div className="message-state"><h3>No todos here yet.</h3><p>Try another page.</p></div>}
        {data && data.length > 0 && <><ul className="todo-list">{data.map((todo) => <TodoRow key={todo.id} todo={todo} />)}</ul><nav className="pagination" aria-label="Todo pages"><button className="button button--light" disabled={page === 1 || isFetching} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page <strong>{page}</strong> of {TOTAL_PAGES}</span><button className="button button--dark" disabled={page === TOTAL_PAGES || isFetching} onClick={() => setPage((current) => current + 1)}>Next</button></nav></>}
      </section><footer className="app-footer"><span>Built for a focused day</span><span>Data refreshes every minute</span></footer>
    </main>
  )
}

function LoadingState() { return <div className="loading-state" aria-label="Loading todos" role="status">{Array.from({ length: PAGE_SIZE }, (_, index) => <span className="skeleton-row" key={index} />)}</div> }

export default App
