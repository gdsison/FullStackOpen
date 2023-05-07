import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let container

beforeEach(() => {
  const blog = {
    title: 'btitle',
    author: 'bauthor',
    url: 'burl.com',
    likes: 23,
    user: {
      id: 123,
      username: 'busername',
      name: 'bname'
    }
  }
  const mockHandlerAdd = jest.fn()
  const mockHandlerDelete = jest.fn()
  container = render(<Blog blog={blog} addLike={mockHandlerAdd} deleteBlog={mockHandlerDelete}/>).container
})

test('renders blog title and author but not display url and number of likes', () => {
  /* const element = screen.getByText('btitle bauthor')
  screen.debug(element)
  expect(element).toBeDefined() */

  const blog = container.querySelector('.blog')
  expect(blog).toHaveTextContent('btitle')
  expect(blog).toHaveTextContent('bauthor')

  const viewBlog = container.querySelector('.viewBlog')
  expect(viewBlog).toHaveStyle('display: none')
})

test('blog url and likes are shown when view button clicked', async () => {
  const user = userEvent.setup()
  const button = screen.getByText('view')
  const viewBlog = container.querySelector('.viewBlog')

  expect(viewBlog).toHaveStyle('display: none')

  await user.click(button)

  expect(viewBlog).not.toHaveStyle
})