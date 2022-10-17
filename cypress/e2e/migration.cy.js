import './function.cy'

describe("Teste",()=>{
  const email = "mateus.souza@ticto.com.br";
  const senha = "GoghSouza1@";
  
  it('API',()=>{
    cy.token().then((response)=>{
      expect(response.status).to.eq(200);
      cy.produto(response.body.accessToken.token);
    })
  })

})
