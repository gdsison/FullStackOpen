import { useState } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { useUserValue } from '../UserContext'
import blogService from '../services/blogs'

const BlogForm = () => {
  const queryclient = useQueryClient()
  const user = useUserValue()
  const setNotification = useNotificationDispatch()

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryclient.getQueryData('blogs')
      newBlog.user = {
        id: newBlog.user,
        name: user.name,
        username: user.username,
      }
      queryclient.setQueryData('blogs', blogs.concat(newBlog))
      setNotification({
        type: 'CREATE',
        payload: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      })
      setTimeout(() => {
        setNotification({ type: 'REMOVE' })
      }, 5000)
    },
    onError: () => {
      setNotification({ type: 'CREATE', payload: 'error' })
      setTimeout(() => {
        setNotification({ type: 'REMOVE' })
      }, 5000)
    },
  })

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    newBlogMutation.mutate({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder="write blog title here"
          id="title"
        />
      </div>
      <div>
        author:
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder="write blog author here"
          id="author"
        />
      </div>
      <div>
        url:
        <input
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder="write blog url here"
          id="url"
        />
      </div>
      <div>
        <button id="create-button" type="submit">
          create
        </button>
      </div>
    </form>
  )
}

export default BlogForm
