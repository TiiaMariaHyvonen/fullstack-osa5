describe('Blog ', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function() {
    cy.contains('Login')
  })
  it('user can login', function () {
    cy.get('#username').type('root')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()
  })
})