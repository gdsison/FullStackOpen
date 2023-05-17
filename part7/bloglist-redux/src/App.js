import { useEffect } from 'react'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import NavBar from './components/NavBar'

import { useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { checkLogin } from './reducers/userReducer'
import { useSelector } from 'react-redux'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { useState } from 'react'
import userService from './services/users'

import { Container } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()

  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const users = await userService.getAll()
      setUsers(users)
    }
    fetchUser()
    console.log('1')
  }, [])

  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    console.log('2')
  }, [])

  useEffect(() => {
    dispatch(checkLogin())
    console.log('3')
  }, [])

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
      <Router>
        <NavBar />
        <Container>
          <Notification />

          <Routes>
            <Route path="/" element={<Blogs />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User users={users} />} />
          </Routes>
        </Container>
      </Router>
    </div>
  )
}

export default App
