const LoginForm = ({handleLogin, username, handleUsernameChange, password, handlePasswordChange}) => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          //onChange={({ target }) => setUsername(target.value)}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          //onChange={({ target }) => setPassword(target.value)}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form> 
)


export default LoginForm