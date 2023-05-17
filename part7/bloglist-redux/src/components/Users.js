import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  return (
    <div>
      <Typography variant="h4">Users</Typography>

      <Table sx={{ maxWidth: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>Users</TableCell>
            <TableCell>Blogs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Users
