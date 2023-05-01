const listHelper = require('../utils/list_helper')
const blogs = require('./blogs')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of a empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(Array(blogs[0]))
    expect(result).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of a empty list is a empty object', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('when list has only one blog, equals the likes of that', () => {
    const favoriteBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    }
    const result = listHelper.favoriteBlog(Array(blogs[0]))
    expect(result).toEqual(favoriteBlog)
  })

  test('of a bigger list is calculated right', () => {
    const favoriteBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(favoriteBlog)
  })
})