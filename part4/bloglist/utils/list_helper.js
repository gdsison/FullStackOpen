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

  const returnedBlog = blogs.reduce((acc, blogs) => {
    acc[blogs.author] = (acc[blogs.author] || 0) + 1
    acc = acc[blogs.author] > acc.maxBlogs
      ? { maxBlogs : acc[blogs.author], authorMaxBlogs: blogs.author }
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}