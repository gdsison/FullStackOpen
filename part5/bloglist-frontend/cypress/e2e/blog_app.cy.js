describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Lays Stax',
      username: 'ilovechips',
      password: 'potato'

    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
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

    it('fails with wrong crendentials', function() {
      cy.get('#username').type('ilovechips')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When Logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'ilovechips', password: 'potato' })
    })

    it.only('A blog can be created', function() {
      cy.contains('Lays Stax logged in')
      cy.contains('new blog').click()
      cy.get('#title').type('Wonderful Blog')
      cy.get('#author').type('Cool Author')
      cy.get('#url').type('Long url')
      cy.get('#create-button').click()

      cy.get('.error').should('contain', 'a new blog Wonderful Blog by Cool Author added')
      cy.contains('Wonderful Blog Cool Author')
    })
  })
})