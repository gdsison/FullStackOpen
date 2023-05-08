describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Lays Stax',
      username: 'ilovechips',
      password: 'potato'

    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username:')
    cy.get('#username')
    cy.contains('password')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('ilovechips')
      cy.get('#password').type('potato')
      cy.get('#login-button').click()
      cy.contains('Lays Stax logged in')
    })

    it.only('fails with wrong crendentials', function() {
      cy.get('#username').type('ilovechips')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})