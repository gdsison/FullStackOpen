import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotfication } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick}) => (
    <div>
        <div>
            {anecdote.content}
        </div>
        <div>
            has {anecdote.votes}
            <button onClick={handleClick}>vote</button>
        </div>
    </div>
)

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter) {
            return state.anecdotes.filter(anaecdote => anaecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
        } else {
            return state.anecdotes
        }
    })

    const dispatch = useDispatch()

    const vote = async (anecdote) => {
        dispatch(voteAnecdote(anecdote))
        dispatch(setNotfication(`you voted '${anecdote.content}'`, 1000))
    }

    return (
        <div>
            {anecdotes.slice().sort((a,b) => b.votes - a.votes).map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => vote(anecdote)} />
            )}
        </div>
    )
}

export default AnecdoteList