import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
 

  const result = useQuery(ALL_BOOKS, {
    variables: { genre }
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const genres = [...new Set(books.map(b => b.genres).flat())]

  return (
    <div>
      <h2>books</h2>
      {genre && <div>in genre: <b>{genre}</b></div>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(g => <button key={g} onClick={() => setGenre(g)}>{g}</button>)}
      <button onClick={() => setGenre(null)}>all genres</button> 
    </div>
  )
}

export default Books
