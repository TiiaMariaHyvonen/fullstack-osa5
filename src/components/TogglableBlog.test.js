import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TogglableBlog from './TogglableBlog'
import Blog from './Blog'


test('renders content', () => {
  const blogTitle = 'Go To Statement Considered Harmful'

  render(<TogglableBlog blogTitle={blogTitle} />)

  screen.getByText('Go To Statement Considered Harmful')
})



describe('Show all content after clicking view button', () => {
  let container

  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: { username: 'root' }
  }

  const fillerFunction = () => {console.log('function for testing')}
  const username = 'root'

  beforeEach(() => {
    container = render(
      <TogglableBlog buttonLabel="view...">
        <div className="testDiv" >
          <Blog blog={blog} updateLikes={fillerFunction} username={username} removeBlog={fillerFunction}/>
        </div>
      </TogglableBlog>
    ).container
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
    screen.getByText('Go To Statement Considered Harmful')
    screen.getByText('Edsger W. Dijkstra')
    screen.getByText('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
    screen.getByText(5)
  })
})