import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, handleUsername, password, handlePassword, children }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      {children}
      <form onSubmit={handleLogin}>
        <div>
            username:
          <input
            type='text'
            value={username}
            name='Username'
            onChange={handleUsername}
            id='username'
          />
        </div>
        <div>
           password:
          <input
            type='password'
            value={password}
            name='Password'
            onChange={handlePassword}
            id='password'
          />
        </div>
        <button id='login-button' type="submit">Login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
