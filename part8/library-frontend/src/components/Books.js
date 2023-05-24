import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState, useEffect } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS, {
    variables: { genre }
  })

  useEffect(() => {
    if (result.data) {
      if (genres.length === 0) {
        setGenres([...new Set(result.data.allBooks.map(b => b.genres).flat())])
      }
    }
  }, [result.data , genres])


  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

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
