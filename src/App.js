import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  

  const logOut = (event) => {
    window.localStorage.clear()
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const returnedBlog = await blogService.create(blogObject)
    setMessage(`a new blog ${newTitle} by ${newAuthor} added`)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    setTimeout(() => {
      setMessage(null)
    }, 5000)

  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>title: <input value={newTitle} onChange={({ target }) => setTitle(target.value)}/></div>
      <div>author: <input value={newAuthor} onChange={({ target }) => setAuthor(target.value)}/></div>
      <div>url: <input value={newUrl} onChange={({ target }) => setUrl(target.value)}/></div>
      <button type="submit">create</button>
    </form>  
  )

  if (user === null) {
    return (
    <div>
      <div><Notification message={errorMessage} messageType='error' /></div>
      { loginForm() }
      </div>
    )
  }
  
  return (
    <div>
            {user.name} logged in.  
      <button onClick={() => logOut()}>
          logout
        </button>
      <div><Notification message={message} messageType='message' /></div>
      <h2>create new</h2>
      { blogForm() }
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      
    </div>
  )
}


export default App