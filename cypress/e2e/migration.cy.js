import './function.cy';

let categoriaProduto;
let nomeProduto;
let tipoProduto;
let nomeOferta;

let nomeProdutoDashAPI = [];
let tipoProdutoDashAPI = [];
let categoriaProdutoDashAPI = [];
let idProdutoDashAPI = [];

function Dicionario(dados){
  if(dados == "Produto Físico" || dados == "physical") return "Físico"
  else if (dados == "Eventos" || dados == "events") return "Evento"
  else if (dados == "Curso Online"|| dados == "course") return "Curso"
  else if (dados == "E-books") return "E-book"
  else if (dados == "Serviço de Assinatura"|| dados == "subscription") return "Assinatura"
  else if (dados == "Outros"|| dados == "Instagram" || dados =="other" ) return "Outro"
  else return dados
}

function ProdutosLegado(){

  cy.legadoLogin();
  cy.get('tbody > tr > [data-title="Nome"]').its('length').then((indice)=>{
    for(let i = 0;i<indice;i++){
      cy.visit("https://app.ticto.com.br/product#/");
      cy.get('tbody > tr > [data-title="Nome"]').eq(i).invoke('text').then((nome)=>{
        nomeProduto = nome
      })
      cy.get('tbody > tr > [data-title="Tipo"]').eq(i).invoke('text').then((tipo)=>{
        tipoProduto = tipo
      })
      cy.get('tbody > tr > [data-title="Categoria"]').eq(i).invoke('text').then((categoria)=>{
        categoriaProduto = categoria
      })
      cy.get('tbody > tr > [data-title="Código"]').eq(i).invoke('text').then((id)=>{
        cy.visit(`https://app.ticto.com.br/product/${id}/manage/offers#/`)
        cy.get('.text-left').its('length').then((indiceOferta)=>{
          for(let i = 0;i<indiceOferta;i++){
            cy.get('.text-left > .btn').eq(i).wait(500).click({force:true});
            cy.get('a:contains(Editar)').eq(i+1).click({force:true})
            cy.get('#name').invoke('val').then((nomeFor)=>{
              nomeOferta = nomeFor
            })
            cy.get('#price').invoke('val').then((valorFor)=>{
              VerificaNome(nomeProduto,tipoProduto,categoriaProduto,nomeOferta,valorFor);
            })
            cy.get('#linkProductOffers').click().wait(500);
          }
        })
      })
    }
  })
}

function VerificaNome (nome,tipo,categoria,nomeOffer,valorOffer){
  cy.produto().then((response)=>{
    nomeProdutoDashAPI = response.body.data.map(nome => nome.name);
    idProdutoDashAPI = response.body.data.map(id => id.id);
    categoriaProdutoDashAPI = response.body.data.map(categoria => categoria.category);
    tipoProdutoDashAPI = response.body.data.map(tipo => tipo.type);
    
    Comparar(nomeProdutoDashAPI,tipoProdutoDashAPI,categoriaProdutoDashAPI,nome,tipo,categoria,idProdutoDashAPI,nomeOffer,valorOffer)
  })
}

function Comparar(apiNome,apiTipo,apiCategoria,nomeLegado,tipoLegado,categoriaLegado,idProduto,nomeOferta,valorOferta){
  const indice = apiNome.indexOf(nomeLegado);
  expect(apiNome[indice]).to.include(nomeLegado);
  expect(Dicionario(apiTipo[indice])).to.include(Dicionario(tipoLegado));
  expect(apiCategoria[indice]).to.include(categoriaLegado);
  
  cy.ofertas(idProduto[indice]).then((response)=>{
    let jsonOferta = response.body.data;
    let nome2Ofertas = jsonOferta.map(nome => nome.name);
    let valor2Ofertas = jsonOferta.map(nome => nome.price);
    const ind = nome2Ofertas.indexOf(nomeOferta);
    const sempontoevirgula = valorOferta.replace(/,/g, "").replace(/\./g, "").replace("R$", "").replace(/\s/g, '');

    expect(nome2Ofertas[ind]).to.include(nomeOferta);
    expect((valor2Ofertas[ind].toString())).to.include(sempontoevirgula);
  })
}

describe("Teste",()=>{
  it('OK Verificar Produto(Nome, Tipo e Categoria) e Oferta (Nome e Valor) (Front Legado/API Nova Dash)',()=>{
    ProdutosLegado();
  })
  it.only('Verificar Nova Dash API',()=>{

    cy.dashLogin().wait(3000);
    cy.get('.styles_description__5DLnq').its('length').then((indice)=>{
      for(let i = 0;i<indice;i++){
        cy.get('.styles_description__5DLnq > strong').eq(i).invoke('text').then((nome)=>{
          nomeProduto = nome
        })
        cy.get('#react-tabs-1 > div.styles_products__cd_hR > div.styles_body__G78fU > div > div:nth-child(4)').eq(i).invoke('text').then((tipo)=>{
          tipoProduto = tipo
        })
        cy.get('#react-tabs-1 > div.styles_products__cd_hR > div.styles_body__G78fU > div > div:nth-child(5)').eq(i).invoke('text').then((categoria)=>{
          categoriaProduto = categoria
        })
        cy.get('.styles_description__5DLnq > :nth-child(2)').eq(i).invoke('text').then((idBruto)=>{
        const id = idBruto.replace(/ID/g, "").replace(/\./g, "");
        cy.visit(`https://dash.ticto.com.br/product/${id}/offers`).wait(3000)
        cy.get('.styles_tbody__8Cc_I > ').its('length').then((indiceOferta)=>{
          for(let i = 0;i<indiceOferta;i++){
            cy.visit(`https://dash.ticto.com.br/product/${id}/offers`).wait(3000);
            cy.get('[data-title="Ações"] > .small').eq(i).click({force:true}).wait(3000);
            cy.get(':nth-child(2) > .styles_input__481p7 > input').invoke('val').then((nome)=>{
              nomeOferta = nome
            })
            cy.get(':nth-child(4) > .styles_input__481p7 > input').invoke('val').then((valor)=>{
              //TODO:Comentar essa linha para não verificar e descomentar a linha 120 e comentar 119
              VerificaNome(nomeProduto,tipoProduto,categoriaProduto,nomeOferta,valor);
            })
            cy.dashLogin().wait(2000);
            //cy.get('.styles_active__CwOAK').click().wait(3000)
          }
        cy.visit("https://dash.ticto.com.br/product").wait(3000);
        })
      })
    }})
  })

  it("Logar Back",()=>{
    cy.token().then((response)=>{
      const token = response.body.accessToken.token
    cy.request({
      method: 'POST',
      url: (`https://dash.ticto.com.br/_next/data/${token}/dashboard.json`),
      body:
        {
          "email": "mateus.souza@ticto.com.br",
          "password": "GoghSouza1@"
        },
    failOnStatusCode: false,  
    })
  })
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
        cy.get('.styles_body__G78fU >').eq(i).contains("Ações").click();
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
        cy.log("Nome Oferta " + nomeOferta)
        cy.log("Nome Oferta Dash " + nomeOfertaDash)
        ofertaProdutoDash.push(nomeOfertaDash);
        nomeOfertaDash = [];
        cy.visit("https://dash.ticto.com.br/product")
        })

        cy.log(ofertaProdutoDash);
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
