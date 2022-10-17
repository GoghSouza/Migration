Cypress.Commands.add("teste",(nome)=>{
    const email = "mateus.souza@ticto.com.br";
    const senha = "GoghSouza1@";

    cy.log(nome);
    cy.visit('dash.ticto.com.br')
    cy.get(':nth-child(3) > .styles_input__481p7 > input').type(email)
    cy.get(':nth-child(4) > .styles_input__481p7 > input').type(senha)
    cy.get('button').click().wait(5000)
    cy.visit("https://dash.ticto.com.br/product")
    cy.get(':nth-child(6) > .styles_description__5DLnq > strong').invoke('text').then((nome2)=>{
        cy.log("teste then" + nome2);
    })
})

Cypress.Commands.add('token',()=>{
    cy.request({
        method: 'POST',
        url: ('https://phoenix.ticto.io/api/v1/private/login'),
        body:
          {
            "email": "mateus.souza@ticto.com.br",
            "password": "GoghSouza1@"
          },
      failOnStatusCode: false,  
      })
})

Cypress.Commands.add('produto',(token)=>{
    const token2 = "Bearer " + token
    cy.request({
        method: 'GET',
        url: ('https://phoenix.ticto.io/api/v1/private/products'),
        headers: 
        {
            "Authorization": `${token2}`
        },
      failOnStatusCode: false,  
      })
})

