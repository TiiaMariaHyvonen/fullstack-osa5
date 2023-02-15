const Blog = ({ blog, updateLikes, username, removeBlog }) => {

  const addLike = () => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateLikes(blog.id, blogObject)
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?` )){
      removeBlog(blog.id)
    }
  }

  const deleteToShow = () => {
    if (blog.added || (typeof blog.user !== 'undefined' && blog.user.username === username)) {
      return (<button id="delete-button" onClick={deleteBlog}>delete</button>)
    }
    return null
  }

  return (
    <div>
      <div>{blog.title}</div>
      <div>{blog.url}</div>
      <div>{blog.likes} <button id="like-button" onClick={addLike}>like</button></div>
      <div>{blog.author}</div>
      {deleteToShow()}
    </div>
  )
}

export default Blog