import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    await createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} placeholder='write blog title here' /></div>
      <div>author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} placeholder='write blog author here' /></div>
      <div>url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} placeholder='write blog url here' /></div>
      <div><button type='submit'>create</button></div>
    </form>
  )
}

BlogForm.propType = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm





