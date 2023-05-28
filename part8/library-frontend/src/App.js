import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client'
import Recommendation from './components/Recommendation'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} added!`)
    }
  })

  useEffect(() => {
    if (!token) {
      setToken(localStorage.getItem('phonenumbers-user-token'))
    }
  }, []) //eslint-disable-line

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendation')}>recommendation</button>
            <button onClick={logout}>logout</button>
          </>
        )
        : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />
      
      { token ? (
        <>
          <NewBook show={page === 'add'} />
          <Recommendation show={page === 'recommendation'} />
        </>
      )
      : <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />
      }
      

    </div>
  )
}

export default App
