import { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const BlogForm = () => {
  const dispatch = useDispatch()

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    dispatch(
      createBlog({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      })
    )

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h2>Create new</h2>
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
