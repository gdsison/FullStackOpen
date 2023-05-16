import { useState } from 'react'
import PropTypes from 'prop-types'
import { voteBlog, deleteBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const Blog = ({ blog, userName }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  /* const showWhenVisible = { display: visible ? '' : 'none' } */

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleView = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(voteBlog(updatedBlog))
  }

  const handleDelete = () => {
    const blogDelete = { id: blog.id, title: blog.title, author: blog.author }
    dispatch(deleteBlog(blogDelete))
  }

  const viewInformation = () => (
    <div className="viewBlog">
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes}{' '}
        <button id="like-button" onClick={handleLike}>
          like
        </button>
      </div>
      <div>{blog.user.name}</div>
      {userName === blog.user.username && (
        <button onClick={handleDelete}>delete</button>
      )}
    </div>
  )

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={handleView}>view</button>
      </div>
      {visible && viewInformation()}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
