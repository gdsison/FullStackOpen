import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addBlogComment } from '../reducers/blogReducer'

export const CommentForm = ({ id }) => {
  const dispatch = useDispatch()
  const [newComment, setNewComment] = useState('')

  const addComment = async (event) => {
    event.preventDefault()
    dispatch(addBlogComment(id, newComment))

    setNewComment('')
  }

  return (
    <form onSubmit={addComment}>
      <input
        value={newComment}
        onChange={({ target }) => setNewComment(target.value)}
      />
      <button>add comment</button>
    </form>
  )
}
