import { useState } from 'react'


const BlogForm = ({ createBlog }) =>
{
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }



  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>title:
          <input value={newTitle} onChange={({ target }) => setTitle(target.value)} placeholder='title here'/>
        </div>
        <div>author:
          <input value={newAuthor} onChange={({ target }) => setAuthor(target.value)} placeholder='author here'/>
        </div>
        <div>url:
          <input value={newUrl} onChange={({ target }) => setUrl(target.value)} placeholder='url here'/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}


export default BlogForm