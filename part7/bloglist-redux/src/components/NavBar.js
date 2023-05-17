import {
  AppBar,
  Button,
  CssBaseline,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'

/* const navItems = ['Home', 'About', 'Contact'] */

const NavBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  return (
    <AppBar position="sticky">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Blog App - {user.name}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button color="inherit" onClick={() => navigate('/')}>
            Blogs
          </Button>
          <Button color="inherit" onClick={() => navigate('/users')}>
            Users
          </Button>
          <Button color="inherit" onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
