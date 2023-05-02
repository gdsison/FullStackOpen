const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const returnedBlog = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, {})

  const favoriteBlog = returnedBlog.title === undefined ? {} :
    {
      title: returnedBlog.title,
      author: returnedBlog.author,
      likes: returnedBlog.likes
    }

  return favoriteBlog
}

const mostBlogs = (blogs) => {

  const returnedBlog = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    acc = acc[blog.author] > acc.maxBlogs
      ? { maxBlogs : acc[blog.author], authorMaxBlogs: blog.author }
      : acc
    return acc
  }, { maxBlogs: 0, authorMaxBlogs: null })

  const mostBlogs = returnedBlog.authorMaxBlogs === null
    ? {}
    : {
      author: returnedBlog.authorMaxBlogs,
      blogs: returnedBlog.maxBlogs
    }

  return mostBlogs

}

const mostLikes = (blogs) => {

  const returnedBlog = blogs.reduce((acc, blog) => {
    acc[blog.author] = acc[blog.author] + blog.likes || blog.likes
    acc = acc[blog.author] > acc.maxLikes
      ? { maxLikes : acc[blog.author], authorMaxLikes: blog.author }
      : acc
    return acc
  }, { maxLikes: 0, authorMaxLikes: null })

  const mostBlogs = returnedBlog.authorMaxLikes === null
    ? {}
    : {
      author: returnedBlog.authorMaxLikes,
      likes: returnedBlog.maxLikes
    }

  return mostBlogs

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}