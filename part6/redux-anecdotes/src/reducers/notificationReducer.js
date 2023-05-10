import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'show',
    reducers: {
        createNotification(state, action) {
            return action.payload
        }
    }
})


export const { createNotification } = notificationSlice.actions
export default notificationSlice.reducer