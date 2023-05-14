describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Lays Stax',
      username: 'ilovechips',
      password: 'potato',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    const user2 = {
      name: 'Aqua Marine',
      username: 'ilovewater',
      password: 'watah',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username:')
    cy.get('#username')
    cy.contains('password')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('ilovechips')
      cy.get('#password').type('potato')
      cy.get('#login-button').click()
      cy.contains('Lays Stax logged in')
    })

    it('fails with wrong crendentials', function () {
      cy.get('#username').type('ilovechips')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When Logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'ilovechips', password: 'potato' })
    })

    it('A blog can be created', function () {
      cy.contains('Lays Stax logged in')
      cy.contains('new blog').click()
      cy.get('#title').type('Wonderful Blog')
      cy.get('#author').type('Cool Author')
      cy.get('#url').type('Long url')
      cy.get('#create-button').click()

      cy.get('.error').should(
        'contain',
        'a new blog Wonderful Blog by Cool Author added'
      )
      cy.contains('Wonderful Blog Cool Author')
    })

    it('A blog can be liked', function () {
      cy.createBlog({
        title: 'Wonderful Blog',
        author: 'Cool Author',
        url: 'Long url',
      })

      cy.contains('view').click()
      cy.contains('likes: 0')
      cy.contains('like').click()
      cy.contains('likes: 1')
      cy.contains('likes: 0').should('not.exist')
    })

    it('A blog can be deleted by the creator', function () {
      cy.createBlog({
        title: 'Wonderful Blog',
        author: 'Cool Author',
        url: 'Long url',
      })

      cy.contains('Wonderful Blog Cool Author')
      cy.contains('view').click()
      cy.contains('delete').click()
      cy.contains('Wonderful Blog Cool Author').should('not.exist')
    })

    it('Blog delete button can only be seen by creator', function () {
      cy.createBlog({
        title: 'Wonderful Blog',
        author: 'Cool Author',
        url: 'Long url',
      })

      cy.contains('Wonderful Blog Cool Author')
      cy.contains('view').click()
      cy.contains('delete')

      cy.login({ username: 'ilovewater', password: 'watah' })

      cy.contains('view').click()
      cy.contains('delete').should('not.exist')
    })

    it.only('Blogs are ordered according to likes with most likes being first', function () {
      cy.createBlog({
        title: 'least liked blog',
        author: 'poor author',
        url: 'cryurl',
      })
      cy.createBlog({
        title: 'second most liked blog',
        author: 'meh author',
        url: 'mehurl',
      })
      cy.createBlog({
        title: 'most liked blog',
        author: 'rich author',
        url: 'happyurl',
      })

      cy.contains('most liked blog rich author').contains('view').click()
      cy.contains('most liked blog rich author').get('#like-button').click()
      cy.contains('most liked blog rich author').get('#like-button').click()
      cy.contains('most liked blog rich author').contains('view').click()
      cy.contains('second most liked blog meh author').contains('view').click()
      cy.contains('second most liked blog meh author')
        .get('#like-button')
        .click()

      cy.get('.blog').eq(0).should('contain', 'most liked blog')
      cy.get('.blog').eq(1).should('contain', 'second most liked blog')
      cy.get('.blog').eq(2).should('contain', 'least liked blog')
    })
  })
})
