import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
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
  const [createVisible, setCreateVisible] = useState(false)

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
    setCreateVisible(false)
    setTimeout(() => {
      setMessage(null)
    }, 5000)

  }

  const blogForm = () => {
    const hideWhenVisible = { display: createVisible ? 'none' : '' }
    const showWhenVisible = { display: createVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateVisible(true)}>create blog</button>
        </div>
        <div style={showWhenVisible}>
      <BlogForm addBlog={addBlog} 
        newTitle={newTitle} 
        newAuthor={newAuthor} 
        newUrl={newUrl} 
        handleTitleChange={({ target }) => setTitle(target.value)} 
        handleAuthorChange={({ target }) => setAuthor(target.value)} 
        handleUrlChange={({ target }) => setUrl(target.value)}/>
          <button onClick={() => setCreateVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
 

  if (user === null) {
    return (
    <div>
      <Notification message={errorMessage} messageType='error' />
      <LoginForm handleLogin={handleLogin} 
                 username={username} 
                 handleUsernameChange={({ target }) => setUsername(target.value)} 
                 password={password} 
                 handlePasswordChange={({ target }) => setPassword(target.value)} />
      </div>
    )
  }
  
  return (
    <div>
      {user.name} logged in   
      <button onClick={() => logOut()}>
          logout
      </button>

      <Notification message={message} messageType='message' />
      {blogForm()}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      
    </div>
  )
}


export default App