import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        createNotification(state, action) {
            return action.payload
        },
        removeNotification(state, action) {
            return null
        }
    }
})


export const { createNotification, removeNotification } = notificationSlice.actions

export const setNotfication = (notif, sec) => {
    return async dispatch => {
        dispatch(createNotification(notif))
        setTimeout(() => {
            dispatch(removeNotification())
        }, sec)

        
    }
}

export default notificationSlice.reducer