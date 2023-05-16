import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification === null) {
    return null
  }
  return <div className="error">{notification}</div>
}

export default Notification
