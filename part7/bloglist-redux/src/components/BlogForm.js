import { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { Box, Typography, TextField, Button } from '@mui/material'

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
      <Box
        sx={{
          '.MuiTextField-root': { m: 1 },
        }}
      >
        <Typography variant="h5">Create New</Typography>
        <TextField
          size="small"
          label="Title"
          placeholder="write blog title here"
          value={newTitle}
          id="title"
          onChange={({ target }) => setNewTitle(target.value)}
        />
        <TextField
          size="small"
          label="Author"
          placeholder="write blog author here"
          value={newAuthor}
          id="author"
          onChange={({ target }) => setNewAuthor(target.value)}
        />
        <TextField
          size="small"
          label="Url"
          placeholder="write blog url here"
          value={newUrl}
          id="url"
          onChange={({ target }) => setNewUrl(target.value)}
        />
        <div>
          <Button variant="contained" id="create-button" type="submit">
            Create
          </Button>
        </div>
      </Box>
    </form>
  )
}

export default BlogForm
