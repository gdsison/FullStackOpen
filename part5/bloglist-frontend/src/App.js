import { useState, useEffect, useSyncExternalStore } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

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
      console.log(exception.message)
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
    } catch (exception) {
      console.log(exception.message)
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>title: <input value={newTitle} onChange={({target}) => setNewTitle(target.value)} /></div>
        <div>author: <input value={newAuthor} onChange={({target}) => setNewAuthor(target.value)} /></div>
        <div>url: <input value={newUrl} onChange={({target}) => setNewUrl(target.value)} /></div>
        <div><button type='submit'>create</button></div>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App