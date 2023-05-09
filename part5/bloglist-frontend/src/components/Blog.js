import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog , addLike, deleteBlog, userName }) => {
  const [visible, setVisible] = useState(false)

  /* const showWhenVisible = { display: visible ? '' : 'none' } */

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleView = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    addLike(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog.id, blog.title, blog.author)
  }

  const viewInformation = () => (
    <div className='viewBlog'>
      <div>{blog.url}</div>
      <div>likes: {blog.likes} <button onClick={handleLike}>like</button></div>
      <div>{blog.user.name}</div>
      {console.log(userName)}
      {(userName === blog.user.username) && <button onClick={handleDelete}>delete</button>}
    </div>
  )

  return (
    <div style={blogStyle} className='blog'>
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
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog