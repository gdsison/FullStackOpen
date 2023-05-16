import { useState } from 'react'
import { useUserDispatch } from '../UserContext'
import { useNotificationDispatch } from '../NotificationContext'
import { useMutation } from 'react-query'
import loginService from '../services/login'

const LoginForm = ({ children }) => {
  const setUser = useUserDispatch()
  const setNotification = useNotificationDispatch()

  const loginMutation = useMutation(loginService.login, {
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser({ type: 'SET_USER', payload: user })
    },
    onError: () => {
      setNotification({ type: 'CREATE', payload: 'wrong username or password' })
      setTimeout(() => {
        setNotification({ type: 'REMOVE' })
      }, 5000)
    },
  })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    loginMutation.mutate({ username, password })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      {children}
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            id="username"
          />
        </div>
        <div>
          password:
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            id="password"
          />
        </div>
        <button id="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
