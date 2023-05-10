import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

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

    return (
        <div>
            {anecdotes.slice().sort((a,b) => b.votes - a.votes).map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => dispatch(voteAnecdote(anecdote.id))} />
            )}
        </div>
    )
}

export default AnecdoteList