import { useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryClient, useMutation } from 'react-query'
import blogService from '../services/blogs'
import { useUserValue } from '../UserContext'
import { useNotificationDispatch } from '../NotificationContext'

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()
  const user = useUserValue()
  const setNotification = useNotificationDispatch()

  const likeBlogMutation = useMutation(blogService.update, {
    onSuccess: (votedBlog, blogObject) => {
      votedBlog.user = {
        id: votedBlog.user,
        name: blogObject.user.name,
        username: blogObject.user.username,
      }
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData(
        'blogs',
        blogs.map((blog) => (blog.id !== votedBlog.id ? blog : votedBlog))
      )
    },
    onError: () => {
      setNotification({ type: 'CREATE', payload: 'error' })
      setTimeout(() => {
        setNotification({ type: 'REMOVE' })
      }, 5000)
    },
  })

  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: (data, blogId) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData(
        'blogs',
        blogs.filter((blog) => blog.id !== blogId)
      )
    },
    onError: () => {
      setNotification({ type: 'CREATE', payload: 'error' })
      setTimeout(() => {
        setNotification({ type: 'REMOVE' })
      }, 5000)
    },
  })

  const [visible, setVisible] = useState(false)

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
    likeBlogMutation.mutate(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`delete ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id)
    }
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
      {user.username === blog.user.username && (
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
