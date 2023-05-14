import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let createBlog
  beforeEach(() => {
    createBlog = jest.fn()
    render(<BlogForm createBlog={createBlog} />)
  })

  test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const titleInput = screen.getByPlaceholderText('write blog title here')
    const authorInput = screen.getByPlaceholderText('write blog author here')
    const urlInput = screen.getByPlaceholderText('write blog url here')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'amazing title')
    await user.type(authorInput, 'smart author')
    await user.type(urlInput, 'long url')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('amazing title')
    expect(createBlog.mock.calls[0][0].author).toBe('smart author')
    expect(createBlog.mock.calls[0][0].url).toBe('long url')
  })
})
