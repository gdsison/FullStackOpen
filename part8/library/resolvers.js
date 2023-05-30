const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(), 
      allBooks: async (root, args) => {
          let books = await Book.find({}).populate('author', { name: 1, born: 1 })
          books = args.author ? books.filter(book => book.author.name === args.author) : books
          books = args.genre ? books.filter(book => book.genres.includes(args.genre)) : books
          return books
      },
      allAuthors: async () => {
        const authors = await Author.find({}).populate('books')
        return authors
      },
      me: (root, args, context) => {
        return context.currentUser
      }
    },
    Author: {
      bookCount: async (root) => {
        return root.books.length
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
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
            if (error.name === 'ValidationError') {
              throw new GraphQLError(error.message, {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: Object.values(error.errors)[0].value,
                  error
                }
              })
            }
            throw new GraphQLError(error)
          }
        }
        const book = new Book({ ...args, author })
        try {
          await book.save()
          await Author.findByIdAndUpdate(author._id, { books : author.books.concat(book._id)})
        } catch (error) {
          if (error.name === 'ValidationError') {
            throw new GraphQLError(error.message, {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: Object.values(error.errors)[0].value,
                error
              }
            })
          }
          throw new GraphQLError(error)
        }
  
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
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
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      }
    }
  }

  module.exports = resolvers