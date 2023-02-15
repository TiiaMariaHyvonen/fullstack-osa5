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
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    blogFormRef.current.toggleVisibility()
    setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    // This field is added temporarity to check if current user added this blog (is able to delete it)
    // it is checked in Blog component (./components/Blog.js)
    returnedBlog.added = true
    setBlogs(blogs.concat(returnedBlog))
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const removeBlog = async (blogId) => {
    await blogService.remove(blogId)
    setMessage('blog deleted')
    setBlogs(blogs.filter(blog => blog.id !== blogId))
    setTimeout(() => {
      setMessage(null)
    }, 3000)

  }

  const updateLikes = async (blogId, blogObject) => {
    const returnedBlog = await blogService.update(blogId, blogObject)
    setMessage(`${returnedBlog.title} has ${returnedBlog.likes} likes`)
    returnedBlog.added = true
    setBlogs(blogs.map(blog => blog.id !== blogId ? blog : returnedBlog))
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const sortedBlogs = (
    blogs.sort(
      (b1, b2) => (b1.likes < b2.likes) ? 1 : (b1.likes > b2.likes) ? -1 : 0
    )
  )

  if (user === null) {
    return (
      <div>
        <Notification message={message} messageType='error' />
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
      {sortedBlogs.map(blog =>
        <div key={blog.id}>
          <TogglableBlog buttonLabel='view' blogTitle={blog.title}>
            <Blog blog={blog} updateLikes={updateLikes} username={user.username} removeBlog={removeBlog}/>
          </TogglableBlog>
        </div>
      )}

    </div>
  )
}


export default App