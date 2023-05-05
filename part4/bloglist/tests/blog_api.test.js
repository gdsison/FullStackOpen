const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})


  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  const passwordHash2 = await bcrypt.hash('sekret2', 10)
  const user2 = new User({ username: 'root2', name: 'Superuser2', passwordHash: passwordHash2 })
  await user2.save()
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const blogs = await api.get('/api/blogs')

    expect(blogs.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs unique identifier (id) is defined', async () => {
    const blogs = await api.get('/api/blogs')

    expect(blogs.body[0].id).toBeDefined()
  })
})

describe('addition of new blog', () => {
  test('succeeds with valid data', async () => {
    const loginCredential = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(loginCredential)
      .expect(200)

    const newBlog = {
      title: 'Facebook',
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Facebook')
  })

  test('succeeds without likes and likes default into 0', async () => {
    const loginCredential = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(loginCredential)
      .expect(200)

    const newBlog = {
      title: 'Facebook',
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogAtEnd = await helper.newBlogInDb()
    expect(newBlogAtEnd.likes).toEqual(0)
  })

  test('fails with proper status code (401) and error message if token is missing', async() => {
    const newBlog = {
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com',
      likes: 3
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    expect(result.body.error).toContain('jwt must be provided')
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with proper status code (400) and error message if title is missing ', async () => {
    const loginCredential = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(loginCredential)
      .expect(200)

    const newBlog = {
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com',
      likes: 3
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(400)

    expect(result.body.error).toContain('`title` is required.')
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with proper status code (400) and error message if url is missing', async () => {
    const loginCredential = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(loginCredential)
      .expect(200)

    const newBlog = {
      title: 'Facebook',
      author: 'Mark Zuckerberg',
      likes: 3
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(400)

    expect(result.body.error).toContain('`url` is required.')
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const loginCredential = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(loginCredential)
      .expect(200)

    const newBlog = {
      title: 'Facebook',
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  })

  test('fails with proper status code (401) and error message if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    expect(result.body.error).toContain('jwt must be provided')
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('fails with proper status code (401) and error message if token (user) is unauthorized',async () => {
    const loginCredential = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(loginCredential)
      .expect(200)

    const newBlog = {
      title: 'Facebook',
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newLoginCredential = {
      username: 'root2',
      password: 'sekret2'
    }

    const wrongLogin = await api
      .post('/api/login')
      .send(newLoginCredential)
      .expect(200)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${wrongLogin.body.token}`)
      .expect(401)

    expect(result.body.error).toContain('user invalid')

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('fails with proper status code (400) and error message if id is invalid', async () => {
    const loginCredential = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(loginCredential)
      .expect(200)

    const randomId = '21332'
    const result = await api
      .delete(`/api/blogs/${randomId}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(400)

    expect(result.body.error).toContain('malformatted id')
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {
      title: 'Facebook',
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com',
      likes: 3
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].title).toBe(newBlog.title)
    expect(blogsAtEnd[0].author).not.toBe(blogToUpdate.title)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const randomId = 12345

    const newBlog = {
      title: 'Facebook',
      author: 'Mark Zuckerberg',
      url: 'https://facebook.com',
      likes: 3
    }

    await api
      .put(`/api/blogs/${randomId}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain('Facebook')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})