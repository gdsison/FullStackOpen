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
    console.log(result)
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

describe('most blogs', () => {
  test('of a empty list is a empty object', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('when list has only one blog, equals the likes of that', () => {
    const mostBlogs = {
      author: 'Michael Chan',
      blogs: 1
    }
    const result = listHelper.mostBlogs(Array(blogs[0]))
    expect(result).toEqual(mostBlogs)
  })

  test('of a bigger list is calculated right', () => {
    const mostBlogs = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(mostBlogs)
  })
})

describe('most likes', () => {
  test('of a empty list is a empty object', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

  test('when list has only one blog, equals the likes of that', () => {
    const mostLikes = {
      author: 'Michael Chan',
      likes: 7
    }
    const result = listHelper.mostLikes(Array(blogs[0]))
    expect(result).toEqual(mostLikes)
  })

  test('of a bigger list is calculated right', () => {
    const mostLikes = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(mostLikes)
  })
})