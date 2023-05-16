import { useEffect } from 'react'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'

import { useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { checkLogin, logout } from './reducers/userReducer'
import { useSelector } from 'react-redux'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { useState } from 'react'
import userService from './services/users'


const App = () => {
  const dispatch = useDispatch()

  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const users = await userService.getAll()
      setUsers(users)
    }
    fetchUser()
  }, [])

  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(checkLogin())
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

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
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <Router>
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path='/blogs/:id' element={<Blog />} />
          <Route path="/users" element={<Users users={users} />} />
          <Route path='/users/:id' element={<User users={users} />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
