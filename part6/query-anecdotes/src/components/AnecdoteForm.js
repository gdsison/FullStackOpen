import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../request'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
      dispatch({type: 'CREATE', payload: `anecdote '${newAnecdote.content}' created`})
    },
    onError: (error) => {
<<<<<<< HEAD
      dispatch({type: 'CREATE', payload: error.response.data.error})
=======
      dispatch({type: 'CREATE', payload: 'too short anecdote, must have length 5 or more'})
>>>>>>> 78f5ee94c5b51e1c85f129ccbc28260a00d47c8e
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})

    setTimeout(() => {
      dispatch({type: 'REMOVE'})
    }, 1000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
