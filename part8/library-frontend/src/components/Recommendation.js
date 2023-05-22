import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

const Recommendation = (props) => {
  const meQuery = useQuery(ME)

  const genre = meQuery.data?.me?.favoriteGenre

  const allBooksQuery = useQuery(ALL_BOOKS, {
    skip: !genre,
    variables: { genre }
  })

  if (!props.show) {
    return null
  }

  if (allBooksQuery.loading) {
    return <div>Loading....</div>
  }

  
  
  const books = allBooksQuery.data.allBooks

  return (
    <div>
        <h2>recommendations</h2>
        <div>books in your favorite genre: <b>{genre}</b> </div>
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
    </div>
  )
}

export default Recommendation