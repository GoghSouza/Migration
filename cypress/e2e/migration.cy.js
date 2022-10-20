import './function.cy'
import produtosJson from "./produtos.json"

let nomeProduto = [];
let tipoProduto = [];
let categoriaProduto = [];
let ofertaProduto = [];
let nomeOferta = [];

let nomeProdutoDashAPI = [];
let tipoProdutoDashAPI = [];
let categoriaProdutoDashAPI = [];
let ofertaProdutoDashAPI = [];
let nomeOfertaDashAPI = [];

let nomeProdutoDash = [];
let tipoProdutoDash = [];
let categoriaProdutoDash = [];
let ofertaProdutoDash = [];
let nomeOfertaDash = [];

function Dicionario(dados){
  if(dados == "Produto Físico" || dados == "physical") return "Físico"
  else if (dados == "Eventos" || dados == "events") return "Evento"
  else if (dados == "Curso Online"|| dados == "course") return "Curso"
  else if (dados == "E-books") return "E-book"
  else if (dados == "Serviço de Assinatura"|| dados == "subscription") return "Assinatura"
  else if (dados == "Outros"|| dados == "Instagram" || dados =="other" ) return "Outro"
  else return dados
}

function comparar(apiNome,apiTipo,apiCategoria,nomeLegado,tipoLegado,categoriaLegado){

  for(let i = 0;i < nomeLegado.length;i++){
  const indice = apiNome.indexOf(nomeLegado[i]);
  expect(apiNome[indice]).to.include(nomeLegado[i]);
  expect(Dicionario(apiTipo[indice])).to.include(Dicionario(tipoLegado[i]));
  expect(apiCategoria[indice]).to.include(categoriaLegado[i]);
  
  /*const apiNomeOferta = apiOferta[indice];
  const nomeLegado = ofertaLegado[i];
  for(let i = 0;i<nomeLegado.length;i++){
    expect(apiNomeOferta).to.include(nomeLegado[i]);
  }*/
  }
}

function produtosLegado(email,senha){
  cy.visit("https://app.ticto.com.br/login/?5ebe2294ecd0e0f08eab7690d2a6ee69=13621569c04c27dde4aa00c3ef3ddbac");
  cy.get('#col-sm').type(email);
  cy.get('#senha').type(senha);
  cy.get('.login-password > .btn').click().wait(2000);
  cy.visit("https://app.ticto.com.br/product#/");
  cy.get('tbody > tr > [data-title="Nome"]').its('length').then((indice)=>{
    for(let i = 0;i<indice;i++){
      //cy.visit("https://app.ticto.com.br/product#/");
      cy.get('tbody > tr > [data-title="Nome"]').eq(i).invoke('text').then((nome)=>{
        nomeProduto.push(nome)
      })
      cy.get('tbody > tr > [data-title="Tipo"]').eq(i).invoke('text').then((tipo)=>{
        tipoProduto.push(tipo)
      })
      cy.get('tbody > tr > [data-title="Categoria"]').eq(i).invoke('text').then((categoria)=>{
        categoriaProduto.push(categoria)
      })
      /*cy.get('tbody > tr > [data-title="Código"]').eq(i).invoke('text').then((id)=>{
        cy.visit(`https://app.ticto.com.br/product/${id}/manage/offers#/`)
        cy.get('.text-left').its('length').then((indiceOferta)=>{
          for(let i = 0;i<indiceOferta;i++){
            cy.get('.text-left > .btn').eq(i).wait(500).click({force:true});
            cy.get('a:contains(Editar)').eq(i+1).click({force:true})
            cy.get('#name').invoke('val').then((nome)=>{
              cy.log("for"+nome)
              nomeOferta.push(nome)
            })
            cy.log("fora for"+nomeOferta[i]);
            ofertaProduto = nomeOferta;
            cy.get('#linkProductOffers').click().wait(500);
          }
          //ofertaProduto.push(nomeOferta);
          //nomeOferta = [];
        })
          cy.log(nomeOferta[0]);
          cy.log(ofertaProduto[0]);
      })*/
    }
  })
}

describe("Teste",()=>{
  const email = "mateus.souza@ticto.com.br";
  const senha = "GoghSouza1@";
  
  it('Verificar API',()=>{
    produtosLegado(email,senha);

    cy.token().then((response)=>{
      cy.produto(response.body.accessToken.token).then((response)=>{
        let produtos = response.body.data;

        const itens = [
          [produtos.map(nome => nome.name)],
          [produtos.map(nome => nome.id)],
          [produtos.map(nome => nome.category)],
          [produtos.map(nome => nome.type)]
        ]

        comparar(
        produtos.map(nome => nome.name),
        produtos.map(nome => nome.type),
        produtos.map(nome => nome.category),
        nomeProduto,
        tipoProduto,
        categoriaProduto)
      });
    })
  })
  it('Verificar Nova Dash API',()=>{

    produtosLegado(email,senha);

    cy.visit('dash.ticto.com.br')
    cy.get(':nth-child(3) > .styles_input__481p7 > input').type(email)
    cy.get(':nth-child(4) > .styles_input__481p7 > input').type(senha)
    cy.get('button').click().wait(5000)
    cy.visit("https://dash.ticto.com.br/product")
    cy.get('.styles_description__5DLnq').its('length').then((indice)=>{
      cy.log("Indice " + indice)
      for(let i = 0;i<indice;i++){
        cy.get('.styles_description__5DLnq > strong').eq(i).invoke('text').then((nome)=>{
          nomeProdutoDashAPI.push(nome)
        })
        cy.get('#react-tabs-1 > div.styles_products__cd_hR > div.styles_body__G78fU > div > div:nth-child(4)').eq(i).invoke('text').then((tipo)=>{
          tipoProdutoDashAPI.push(tipo)
          cy.log(tipo)
        })
        cy.get('#react-tabs-1 > div.styles_products__cd_hR > div.styles_body__G78fU > div > div:nth-child(5)').eq(i).invoke('text').then((categoria)=>{
          categoriaProdutoDashAPI.push(categoria)
        })
        /*cy.get('tbody > tr > [data-title="Código"]').eq(i).invoke('text').then((id)=>{
        cy.visit(`https://app.ticto.com.br/product/${id}/manage/offers#/`)
        cy.get('.text-left').its('length').then((indiceOferta)=>{
          for(let i = 0;i<indiceOferta;i++){
            cy.get('.text-left > .btn').eq(i).click();
            //cy.get("#linkEditOffer_7750_53688").click({ force: true });
            cy.get('a:contains(Editar)').eq(i+1).click()
            cy.get('#name').invoke('text').then((nome)=>{
              nomeOferta.push(nome);
            })
            cy.get('#linkProductOffers').click().wait(500);
          }
          ofertaProduto.push([nomeProduto[i]],nomeOferta);
          nomeOferta = [];
        })
      })*/
      }})

    cy.token().then((response)=>{
      cy.produto(response.body.accessToken.token).then((response)=>{
        let produtos = response.body.data;
    
        comparar(
        produtos.map(nome => nome.name),
        produtos.map(nome => nome.type),
        produtos.map(nome => nome.category),
        nomeProduto,
        tipoProduto,
        categoriaProduto)
      });
    })
  })

  it('Legado',()=>{
    produtosLegado(email,senha);

    cy.log("1 "+nomeOferta[0]);
    cy.log("1 " + nomeOferta[1]);
    cy.log("1 " + nomeOferta[2]);
  })

  it('Verificar Nova Dash Front',()=>{

    //produtosLegado(email,senha);

    cy.visit('dash.ticto.com.br')
    cy.get(':nth-child(3) > .styles_input__481p7 > input').type(email)
    cy.get(':nth-child(4) > .styles_input__481p7 > input').type(senha)
    cy.get('button').click().wait(5000)
    cy.visit("https://dash.ticto.com.br/product")
    cy.get('.styles_description__5DLnq').its('length').then((indice)=>{
      cy.log("Indice " + indice)
      for(let i = 0;i<indice;i++){
        cy.get('.styles_description__5DLnq > strong').eq(i).invoke('text').then((nome)=>{
          nomeProdutoDash.push(nome)
        })
        cy.get('.styles_body__G78fU >  > :nth-child(4) > div').eq(i).invoke('text').then((tipo)=>{
          tipoProdutoDash.push(tipo)
          cy.log(tipo)
        })
        cy.get('#react-tabs-1 > div.styles_products__cd_hR > div.styles_body__G78fU > div > div:nth-child(5)').eq(i).invoke('text').then((categoria)=>{
          categoriaProdutoDash.push(categoria)
        })
        /*cy.get('.styles_body__G78fU >').eq(i).contains("Ações").click();
        cy.get('.dropdown-menu > :nth-child(2)').click();
        cy.get('[data-title="Ações"] > .small').its('length').then((indiceOferta)=>{
          cy.log(indiceOferta)
          for(let i =0;i<indiceOferta;i++){
            cy.get('[data-title="Ações"] > .small').eq(i).click();
            cy.get(':nth-child(2) > .styles_input__481p7 > input').invoke('text').then((nome)=>{
              nomeOfertaDash.push(nome);
            })
            cy.get('.styles_active__CwOAK').click();
          }
        ofertaProdutoDash.push(nomeOfertaDash);
        nomeOfertaDash = [];
        cy.visit("https://dash.ticto.com.br/product")
        })*/

        /*cy.get('tbody > tr > [data-title="Código"]').eq(i).invoke('text').then((id)=>{
          cy.visit(`https://app.ticto.com.br/product/${id}/manage/offers#/`)
          cy.get('.text-left').its('length').then((indiceOferta)=>{
            for(let i = 0;i<indiceOferta;i++){
              cy.get('.text-left > .btn').eq(i).click();
              //cy.get("#linkEditOffer_7750_53688").click({ force: true });
              cy.get('a:contains(Editar)').eq(i+1).click()
              cy.get('#name').invoke('text').then((nome)=>{
                nomeOferta.push(nome);
              })
              cy.get('#linkProductOffers').click().wait(500);
            }
            ofertaProduto.push([nomeProduto[i]],nomeOferta);
            nomeOferta = [];
          })
        })*/
      }

    })     
    cy.log("Comparar").then(()=>{
      comparar(
        nomeProdutoDash,
        tipoProdutoDash,
        categoriaProdutoDash,
        nomeProduto,
        tipoProduto,
        categoriaProduto)
    })
  })
})
