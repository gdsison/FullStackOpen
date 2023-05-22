import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
    }
  }, [result.data]) //eslint-disable-line

  if (!props.show) {
    return null
  }
  
  const handleLogin = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
    props.setPage('authors')
  }

  return (
    <form onSubmit={handleLogin}>
        <div>
            username:
            <input 
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password:
            <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type='password' 
            />
        </div>
        <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm