describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Superuser',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.get('#username').type('root')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()
      })

      it('A blog can be created', function() {
        cy.contains('create blog').click()
        cy.get('#title').type('Go To Statement Considered Harmful')
        cy.get('#author').type('Edsger W. Dijkstra')
        cy.get('#url').type('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
        cy.get('#create-button').click()
        cy.contains('Go To Statement Considered Harmful')
      })

      describe('When also a blog exists', function() {
        beforeEach(function() {
          cy.contains('create blog').click()
          cy.get('#title').type('Go To Statement Considered Harmful')
          cy.get('#author').type('Edsger W. Dijkstra')
          cy.get('#url').type('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
          cy.get('#create-button').click()
        })

        it('it can be liked', function () {
          cy.contains('Go To Statement Considered Harmful')
          cy.get('#view-button').click()
          cy.get('#like-button').click()
          cy.contains('Go To Statement Considered Harmful has 1 likes')
        })

        it('it can be deleted', function () {
          cy.contains('Go To Statement Considered Harmful')
          cy.get('#view-button').click()
          cy.get('#delete-button').click()
          cy.contains('blog deleted')
          cy.get('html').should('not.contain', 'Go To Statement Considered Harmful')
        })

        it('only user who added blog can see delete button', function () {
          cy.contains('Go To Statement Considered Harmful')
          cy.get('#view-button').click()
          cy.get('#delete-button')
          cy.get('#logout-button').click()
          const user = {
            name: 'Testuser',
            username: 'test',
            password: 'salainen'
          }
          cy.request('POST', 'http://localhost:3003/api/users/', user)

          cy.get('#username').type('test')
          cy.get('#password').type('salainen')
          cy.get('#login-button').click()
          cy.get('#view-button').click()
          cy.get('html').should('not.contain', '#delete-button')
        })

        it('order of blogs is based on likes', function () {
          cy.get('#view-button').click()
          cy.get('#like-button').click()
          cy.get('#hide-button').click()

          cy.contains('create blog').click()
          cy.get('#title').type('First class tests')
          cy.get('#author').type('Robert C. Martin')
          cy.get('#url').type('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
          cy.get('#create-button').click()

          cy.contains('create blog').click()
          cy.get('#title').type('TDD harms architecture')
          cy.get('#author').type('Robert C. Martin')
          cy.get('#url').type('http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html')
          cy.get('#create-button').click()

          cy.contains('TDD harms architecture')
            .contains('view')
            .click()

          cy.contains('TDD harms architecture').parent().find('#like-button').click().click()

          cy.get('.blog').eq(0).should('contain', 'TDD harms architecture')
          cy.get('.blog').eq(1).should('contain', 'Go To Statement Considered Harmful')
          cy.get('.blog').eq(2).should('contain', 'First class tests')


        })

      })
    })
  })
})