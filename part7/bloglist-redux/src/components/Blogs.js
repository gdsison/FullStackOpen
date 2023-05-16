import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)

  return (
    <div>
      <Togglable buttonLabel="create new">
        <BlogForm />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog => <Blog key={blog.id} blog={blog}/> )}
    </div>
  )
}

export default Blogs
