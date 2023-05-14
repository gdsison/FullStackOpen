import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return null
    }
  }
})

export const { createNotification, removeNotification } = notificationSlice.actions

export const setNotification = (notification) => {
  return async dispatch => {
    dispatch(createNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 1000)
  }
}

export default notificationSlice.reducer