import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const input1 = screen.getByPlaceholderText('title here')
  const input2 = screen.getByPlaceholderText('author here')
  const input3 = screen.getByPlaceholderText('url here')

  const sendButton = screen.getByText('create')

  await user.type(input1, 'testing a form title')
  await user.type(input2, 'testing a form author')
  await user.type(input3, 'testing a form url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(JSON.stringify(createBlog.mock.calls[0][0])).toContain('testing a form title')
  expect(JSON.stringify(createBlog.mock.calls[0][0])).toContain('testing a form author')
  expect(JSON.stringify(createBlog.mock.calls[0][0])).toContain('testing a form url')
})