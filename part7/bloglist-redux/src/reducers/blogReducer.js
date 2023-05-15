import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      return state.map(blog => blog.id !== action.payload.id ? blog : action.payload)
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject, userObject) => {
  return async dispatch => {
    const blog = await blogService.create(blogObject)
    blog.user = {
      ...userObject,
      id: blog.user.id
    }
    dispatch(appendBlog(blog))
  }
}

export const voteBlog = (blogObject) => {
  return async dispatch => {
    try {
      const blog = await blogService.update(blogObject.id, blogObject)
      blog.user = {
        id: blog.user,
        name: blogObject.user.name,
        username: blogObject.user.username
      }
      dispatch(updateBlog(blog))
      dispatch(setNotification(`voted for ${blog.title}`))
    } catch (exception) {
      dispatch(setNotification(exception.message))
    }
  }
}

export const deleteBlog = (blogObject) => {
  return async dispatch => {
    if (window.confirm(`delete ${blogObject.title} by ${blogObject.author}`)) {
      try {
        dispatch(removeBlog(blogObject.id))
        await blogService.remove(blogObject.id)
        dispatch(setNotification(`blog ${blogObject.title} by ${blogObject.author} deleted`))
      } catch (exception) {
        dispatch(setNotification(exception.message))
      }
    }
  }
}

export default blogSlice.reducer
