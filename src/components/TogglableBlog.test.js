import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import TogglableBlog from './TogglableBlog'


test('renders content', () => {
  const blogTitle = 'Go To Statement Considered Harmful'

  render(<TogglableBlog blogTitle={blogTitle} />)

  screen.getByText('Go To Statement Considered Harmful')
})