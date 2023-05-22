import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query AllAuthors {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query AllBooks {
  allBooks {
    title
    published
    author {
      name
    }
  }
}
`

export const CREATE_BOOK = gql`
mutation Mutation($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    author
    genres
    published
    title
  }
}
`

export const EDIT_BIRTHYEAR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
    bookCount
  }
}
`

export const LOGIN = gql`
mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`