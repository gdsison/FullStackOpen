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

    it('A blog can be created', function() {
      cy.contains('Lays Stax logged in')
      cy.contains('new blog').click()
      cy.get('#title').type('Wonderful Blog')
      cy.get('#author').type('Cool Author')
      cy.get('#url').type('Long url')
      cy.get('#create-button').click()

      cy.get('.error').should('contain', 'a new blog Wonderful Blog by Cool Author added')
      cy.contains('Wonderful Blog Cool Author')
    })

    it('A blog can be liked', function() {
      cy.createBlog({
        title: 'Wonderful Blog',
        author: 'Cool Author',
        url: 'Long url'
      })

      cy.contains('view').click()
      cy.contains('likes: 0')
      cy.contains('like').click()
      cy.contains('likes: 1')
      cy.contains('likes: 0').should('not.exist')
    })

    it.only('A blog can be deleted by the creator', function() {
      cy.createBlog({
        title: 'Wonderful Blog',
        author: 'Cool Author',
        url: 'Long url'
      })

      cy.contains('Wonderful Blog Cool Author')
      cy.contains('view').click()
      cy.contains('delete').click()
      cy.contains('Wonderful Blog Cool Author').should('not.exist')
    })
  })
})