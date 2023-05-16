import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { voteBlog } from '../reducers/blogReducer'

const Blog = () => {
  const dispatch = useDispatch()
  const id = useParams().id

  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === id)

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(voteBlog(updatedBlog))
  }

  if (!blog) {
    return null
  }
  console.log(blog)

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      <h3>comments</h3>
      <ul>
        {blog.comments.map((comment, i) => <li key={i}>{comment}</li>)}
      </ul>
    </div>
  )
}

export default Blog
