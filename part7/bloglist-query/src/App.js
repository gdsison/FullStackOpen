import { useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { useQuery } from 'react-query'
import { useUserDispatch, useUserValue } from './UserContext'

const App = () => {
  const user = useUserValue()
  const setUser = useUserDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser({ type: 'REMOVE_USER' })
  }

  const result = useQuery('blogs', blogService.getAll)

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  if (user === null) {
    return (
      <div>
        <LoginForm>
          <Notification />
        </LoginForm>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />

      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <h2>create new</h2>

      <Togglable buttonLabel={'new blog'}>
        <BlogForm />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} userName={user.username} />
        ))}
    </div>
  )
}

export default App
