const LoginForm = ({handleLogin, username, handleUsername, password, handlePassword, children}) => {
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
                    />
               </div>
               <div>
               password: 
                    <input 
                        type='password'
                        value={password}
                        name='Password'
                        onChange={handlePassword}
                    />
               </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm
