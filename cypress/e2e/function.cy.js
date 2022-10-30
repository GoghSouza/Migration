import "./migration.cy"

Cypress.Commands.add('legadoLogin',()=>{
  const email = "mateus.souza@ticto.com.br";
  const senha = "GoghSouza1@";

  cy.visit("https://app.ticto.com.br/login/?5ebe2294ecd0e0f08eab7690d2a6ee69=13621569c04c27dde4aa00c3ef3ddbac");
  cy.get('#col-sm').type(email);
  cy.get('#senha').type(senha);
  cy.get('.login-password > .btn').click().wait(2000);
  cy.visit("https://app.ticto.com.br/product#/");
})

Cypress.Commands.add('legadoLoginAdmin',()=>{
  const email = "patricia.freitas@ticto.com.br";
  const senha = "mudar136587";
  const emailConsulta = "marinastella@hotmail.com";
  //"contato@lpnegociosdigitais.com.br";
  //Erro Não Produtor "paty.patricia.junqueira@gmail.com";
  //"diegomattoscoach@gmail.com";
  //"felipe@efeitodominacao.com.br";
  //"Vitor@bebedorminhoco.com.br";
  //"contato@especializei.com.br";
  //"joao@atmaeco.com.br";
  //"contato@infomakers.com.br";
  //"cervantes.gabrielle95@gmail.com"

  //cy.visit("https://app.ticto.com.br/login/?5ebe2294ecd0e0f08eab7690d2a6ee69=13621569c04c27dde4aa00c3ef3ddbac");
  //cy.visit("https://app.qa2.ticto.com.br/login")
  cy.visit("https://app.poc.ticto.com.br/login")
  cy.get('#col-sm').type(email);
  cy.get('#senha').type(senha);
  cy.get('.login-password > .btn').click().wait(2000);
  //cy.visit(`https://app.ticto.com.br/admin/user?search=${emailConsulta}&document=&userType=all&hasProduct=indifferently`);
  //cy.visit(`https://app.qa2.ticto.com.br/admin/user?search=${emailConsulta}&document=&userType=all&hasProduct=indifferently`);
  cy.visit(`https://app.poc.ticto.com.br/admin/user?search=${emailConsulta}&document=&userType=all&hasProduct=indifferently`);
  //cy.get('#button > ').eq('2').click({force:true});
  cy.get('[class="text-center"] >').eq('6').click({force:true});
  
  
  //cy.visit("https://app.ticto.com.br/product#/");
  //cy.visit("https://app.qa2.ticto.com.br/product#")
  cy.visit("https://app.poc.ticto.com.br/product#")
})

Cypress.Commands.add('dashLogin',()=>{
  const email = "mateus.souza@ticto.com.br";
  const senha = "GoghSouza1@";

    cy.visit('dash.ticto.com.br/signin')
    cy.get(':nth-child(3) > .styles_input__481p7 > input').type(email)
    cy.get(':nth-child(4) > .styles_input__481p7 > input').type(senha)
    cy.get('button').click().wait(5000)
    cy.wait(10000);
    cy.visit("https://dash.ticto.com.br/product")
})

Cypress.Commands.add('stagingLogin',()=>{
  const email = "mateus.souza@ticto.com.br";
  const senha = "GoghSouza1@";

    cy.visit('https://app-new-components.ticto.com.br/')
    cy.get(':nth-child(3) > .styles_input__481p7 > input').type(email)
    cy.get(':nth-child(4) > .styles_input__481p7 > input').type(senha)
    cy.get('button').click().wait(5000)
    cy.wait(10000);
    cy.visit("https://app-new-components.ticto.com.br/product")
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

Cypress.Commands.add('login',()=>{
    cy.request({
        method: 'POST',
        url: ('https://dash.ticto.com.br'),
        body:
          {
            "email": "mateus.souza@ticto.com.br",
            "password": "GoghSouza1@"
          },
      failOnStatusCode: false,  
      })
})

Cypress.Commands.add('produto',(token)=>{
  cy.token().then((response)=>{
    const token = "Bearer " + response.body.accessToken.token
    cy.request({
        method: 'GET',
        url: ('https://phoenix.ticto.io/api/v1/private/products'),
        headers: 
        {
            "Authorization": `${token}`
        },
      failOnStatusCode: false,  
      })
  })
})

Cypress.Commands.add('produto2',()=>{
  cy.request({
    method: 'POST',
    url: ('https://phoenix-staging.ticto.io/api/v1/private/login'),
    body:
      {
        "email": "mateus.souza@ticto.com.br",
        "password": "GoghSouza1@"
        //"email": "qa_produtor5@ticto.com.br",
        //"password": "password"
      },
  failOnStatusCode: false,  
  }).then((response)=>{
    const token = "Bearer " + response.body.accessToken.token
    cy.request({
      method: 'GET',
      url: ('https://phoenix-staging.ticto.io/api/v1/private/products/'),
      headers: 
      {
          "Authorization": `${token}`
      },
    failOnStatusCode: false, 
    })
  })
})

Cypress.Commands.add('produto3',(url)=>{
  cy.request({
    method: 'POST',
    url: ('https://phoenix-staging.ticto.io/api/v1/private/login'),
    body:
      {
        "email": "mateus.souza@ticto.com.br",
        "password": "GoghSouza1@"
        //"email": "qa_produtor5@ticto.com.br",
        //"password": "password"
      },
  failOnStatusCode: false,  
  }).then((response)=>{
    const token = "Bearer " + response.body.accessToken.token
    cy.request({
      method: 'GET',
      url: (url),
      headers: 
      {
          "Authorization": `${token}`
      },
    failOnStatusCode: false, 
    })
  })
})

Cypress.Commands.add('cookie',()=>{
  cy.token().then((response)=>{
    const token = response.body.accessToken.token
    const refreshtoken = response.body.refreshToken.token 

      //cy.setCookie( "phoenix.token",`${token}`)
      //cy.setCookie("phoenix.refreshtoken",`${refreshtoken}`)
      cy.setCookie("phoenix-staging.token",`${token}`)
      cy.setCookie("phoenix-staging.refreshtoken",`${refreshtoken}`)
  })
})

Cypress.Commands.add('ofertas2',(id)=>{
    cy.request({
    method: 'POST',
    url: ('https://phoenix-staging.ticto.io/api/v1/private/login'),
    body:
      {
        "email": "mateus.souza@ticto.com.br",
        "password": "GoghSouza1@"
      },
  failOnStatusCode: false,  
  }).then((response)=>{
    const token = "Bearer " + response.body.accessToken.token
    cy.request({
        method: 'GET',
        url: (`https://phoenix-staging.ticto.io/api/v1/private/products/${id}/manage/offers`),
        headers: 
        {
            "Authorization": `${token}`
        },
      failOnStatusCode: false,  
      })})
  })

  Cypress.Commands.add('ofertas',(id)=>{
    cy.token().then((response)=>{
      const token = "Bearer " + response.body.accessToken.token
      cy.request({
          method: 'GET',
          url: (`https://phoenix.ticto.io/api/v1/private/products/${id}/manage/offers`),
          headers: 
          {
              "Authorization": `${token}`
          },
        failOnStatusCode: false,  
        })
    })
})

