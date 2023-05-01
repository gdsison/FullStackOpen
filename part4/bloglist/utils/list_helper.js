const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const returnedBlog = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, {})

  const favoriteBlog = {
    title: returnedBlog.title,
    author: returnedBlog.author,
    likes: returnedBlog.likes
  }

  return favoriteBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}