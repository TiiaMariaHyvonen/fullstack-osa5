const Blog = ({blog, updateLikes}) => {

  const addLike = (event) => {
    event.preventDefault()
    const blogObject = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
      updateLikes(blog.id, blogObject)
    }

  return (
  <div>
    <div>{blog.title}</div>
    <div>{blog.url}</div>
    <div>{blog.likes} <button onClick={addLike}>like</button></div>
   <div>{blog.author}</div>
  </div>  
)
}

export default Blog