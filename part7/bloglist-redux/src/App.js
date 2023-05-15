import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'

import { useSelector } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
    } catch (exception) {
      dispatch(setNotification('wrong username or password'))
    }

    setUsername('')
    setPassword('')
  }

  const addBlog = async (blogObject) => {
    try {
      const userObject = { name: user.name, username: user.username }
      dispatch(createBlog(blogObject, userObject))
      dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`))
    } catch (exception) {
      dispatch(setNotification(exception.message))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          handleUsername={({ target }) => setUsername(target.value)}
          password={password}
          handlePassword={({ target }) => setPassword(target.value)}
        >
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
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            userName={user.username}
          />
        ))}
    </div>
  )
}

export default App
