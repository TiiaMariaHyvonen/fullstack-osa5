import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import TogglableBlog from './components/TogglableBlog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
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

  const blogFormRef = useRef()
  const blogRef = useRef()

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

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    blogFormRef.current.toggleVisibility()
    setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setBlogs(blogs.concat(returnedBlog))
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateLikes = async (blogId, blogObject) => {
    const returnedBlog = await blogService.update(blogId, blogObject)
    setMessage(`${returnedBlog.title} has ${returnedBlog.likes} likes`)
    setBlogs(blogs.map(blog => blog.id !== blogId ? blog : returnedBlog))
    setTimeout(() => {
      setMessage(null)
    }, 3000)
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
      <h2>blogs</h2>
      <Togglable buttonLabel='create blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map(blog =>
      <div key={blog.id}>
      <TogglableBlog buttonLabel='view' blogTitle={blog.title}>
          <Blog blog={blog} updateLikes={updateLikes} />
      </TogglableBlog>
      </div>
      )}
      
    </div>
  )
}


export default App