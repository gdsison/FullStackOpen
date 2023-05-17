import { Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find((user) => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant="h3">{user.name}</Typography>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
