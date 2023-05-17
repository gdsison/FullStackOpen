import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useNavigate } from 'react-router-dom'
import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material'

import { useSelector } from 'react-redux'

const Blog = ({ blog }) => {
  const navigate = useNavigate()
  return (
    <>
      <ListItemButton onClick={() => navigate(`/blogs/${blog.id}`)}>
        <ListItemText primary={blog.title} secondary={blog.author} />
      </ListItemButton>
      <Divider />
    </>
  )
}

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)

  return (
    <div>
      <Typography variant="h3">Blogs</Typography>
      <Divider />
      <Togglable buttonLabel="create new">
        <BlogForm />
      </Togglable>

      <List>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
      </List>
    </div>
  )
}

export default Blogs
