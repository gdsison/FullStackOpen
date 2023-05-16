import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { voteBlog } from '../reducers/blogReducer'

const Blog = () => {
  const dispatch = useDispatch()
  const id = useParams().id

  const blogs = useSelector(state => state.blogs)
  const blog = blogs.find(blog => blog.id === id)

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(voteBlog(updatedBlog))
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h1>{blog.title} {blog.author}</h1>
      <div>{blog.url}</div>
      <div>{blog.likes} likes <button onClick={handleLike}>like</button></div>
      <div>added by {blog.user.name}</div>
    </div>
  )
}

export default Blog