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

  /* useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []) */

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchData()
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
      
      blog.user = {
        id: blog.user,
        name: user.name,
        username: user.username
      }

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

  const addLike = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      
      updatedBlog.user = {
        id: updatedBlog.user,
        name: blogObject.user.name,
        username: blogObject.user.username
      }
      
      setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog))
    } catch (exception) {
      console.log(exception)
    }
  }

  const deleteBlog = async (id, title, author) => {
    if(window.confirm(`delete ${title} by ${author}`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id  !== id))
      } catch (exception) {
        console.log(exception)
      }
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
      
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App