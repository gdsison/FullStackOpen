import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let container, mockHandlerLike

beforeEach(() => {
  const blog = {
    id: 456,
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
  mockHandlerLike = jest.fn()
  const mockHandlerDelete = jest.fn()
  container = render(<Blog blog={blog} addLike={mockHandlerLike} deleteBlog={mockHandlerDelete}/>).container
})

test('renders blog title and author but not render url and number of likes', () => {
  /* const element = screen.getByText('btitle bauthor')
  screen.debug(element)
  expect(element).toBeDefined() */

  const blog = container.querySelector('.blog')
  expect(blog).toHaveTextContent('btitle')
  expect(blog).toHaveTextContent('bauthor')
  expect(blog).not.toHaveTextContent('burl.com')
  expect(blog).not.toHaveTextContent('23')
})

test('blog url and likes are shown when view button clicked', async () => {
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  let viewBlog = container.querySelector('.viewBlog')
  expect(viewBlog).not.toBeInTheDocument()

  await user.click(viewButton)

  viewBlog = container.querySelector('.viewBlog')
  expect(viewBlog).toBeInTheDocument()
  expect(viewBlog).toHaveTextContent('burl.com')
  expect(viewBlog).toHaveTextContent('23')
})

test('clicking like button twice activate event handler twice ', async () => {
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')

  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)

  expect(mockHandlerLike.mock.calls).toHaveLength(1)

  await user.click(likeButton)

  expect(mockHandlerLike.mock.calls).toHaveLength(2)
})