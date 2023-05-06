import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newNotification, setNewNotification] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ( event ) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)

    } catch (exception) {
      setNewNotification('wrong password or username')
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)
    }

    setUsername('')
    setPassword('')
  }

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))

      setNewNotification(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)

    } catch (exception) {
      setNewNotification(exception.message)
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)
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
          handleUsername={({target}) => setUsername(target.value)}
          password={password}
          handlePassword={({target}) => setPassword(target.value)}
        >
          <Notification message={newNotification} />
        </LoginForm>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      
      <Notification message={newNotification} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>

      <Togglable buttonLabel={'new blog'}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App