import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'

import { useSelector } from 'react-redux'

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
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  )
}

export default Blogs
