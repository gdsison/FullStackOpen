import { useState, useEffect, useSyncExternalStore } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newNotification, setNewNotification] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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

  const addBlog = async (event) => {
    event.preventDefault()
    
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

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

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username: 
          <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password: 
          <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const notification = () => <div className='error'>{newNotification}</div>

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {newNotification && notification()}
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      
      {newNotification && notification()}

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>

      <Togglable buttonLabel={'new blog'}>
        <form onSubmit={addBlog}>
          <div>title: <input value={newTitle} onChange={({target}) => setNewTitle(target.value)} /></div>
          <div>author: <input value={newAuthor} onChange={({target}) => setNewAuthor(target.value)} /></div>
          <div>url: <input value={newUrl} onChange={({target}) => setNewUrl(target.value)} /></div>
          <div><button type='submit'>create</button></div>
        </form>
      </Togglable>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App