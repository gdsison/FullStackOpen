import { Typography } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (notification === null) {
    return null
  }
  return (
    <div className="error">
      <Typography>{notification}</Typography>
    </div>
  )
}

export default Notification
