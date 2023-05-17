import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { loginUser } from '../reducers/userReducer'
import { TextField, Button, Typography } from '@mui/material'

const LoginForm = ({ children }) => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({ username, password }))
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <Typography variant="h4">Log in to application</Typography>
      {children}
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            id="username"
            name="Username"
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            id="password"
            name="Password"
            type="password"
            label="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button id="login-button" type="submit" variant="contained">
          Login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
