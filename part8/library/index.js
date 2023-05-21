const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB', error.message)
  })

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }
  
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ) : Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ) : Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(), 
    allBooks: async (root, args) => {
        let books = await Book.find({}).populate('author', { name: 1, born: 1 })
        console.log(books)
        books = args.author ? books.filter(book => book.author.name === args.author) : books
        books = args.genre ? books.filter(book => book.genres.includes(args.genre)) : books
        return books
    },
    allAuthors: async () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return Book.count({ author: root._id })
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (error) {
          if (error.name === 'ValidationError')
            throw new GraphQLError(error.message, {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: Object.values(error.errors)[0].value,
                error
              }
            })
          throw new GraphQLError(error)
        }
      }
      
      const book = new Book({ ...args, author })
      try {
        await book.save()
      } catch (error) {
        if (error.name === 'ValidationError')
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: Object.values(error.errors)[0].value,
              error
            }
          })
        throw new GraphQLError(error)
      }

      return book
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, {new: true})
      return author
    },
    createUser: async (root, args, context) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      try {
        await user.save()
      } catch (error) {
        if (error.name === 'ValidationError')
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: Object.values(error.errors)[0].value,
              error
            }
          })
        throw new GraphQLError(error)
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})