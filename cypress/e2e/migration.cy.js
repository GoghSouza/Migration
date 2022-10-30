import './function.cy';

let nomeProduto;
let categoriaProduto;
let tipoProduto;
let descProduto;
let descCartao;
let telefoneSuporte;
let comissaoAfiliado;
let termosAfiliado;
let descricaoAfiliado;
let tipoAprovacao;
let nomeOferta;

let nomeProdutoDashAPI = [];
let categoriaProdutoDashAPI = [];
let tipoProdutoDashAPI = [];
let descProdutoDashAPI = [];;
let descCartaoDashAPI = [];;
let telefoneSuporteDashAPI = [];
let emailSuporteDashAPI = [];
let idProdutoDashAPI = [];
let comissaoAfiliadoDashAPI = [];
let termosAfiliadoDashAPI = [];
let descricaoAfiliadoDashAPI = [];
let tipoAprovacaoDashAPI = [];
let tipoComissaoDashAPI = [];

let produtosErro = [];
let descricaoErro = [];

function Dicionario(dados){
  if(dados == "Produto Físico" || dados == "physical") return "Físico"
  else if (dados == "Eventos" || dados == "events") return "Evento"
  else if (dados == "Curso Online"|| dados == "course") return "Curso"
  else if (dados == "ebook") return "E-books"
  else if (dados == "Serviço de Assinatura"|| dados == "subscription") return "Assinatura"
  else if (dados == "Outros"|| dados == "Instagram" || dados =="other" ) return "Outro"
  else return dados
}

function ProdutosLegado(){

  //cy.legadoLogin();
  cy.legadoLoginAdmin()
  //cy.get('button[id="btnOwnerProducts"]').click()
  //cy.get('#modalOwnerProducts > form > .form-group > .row > :nth-child(1) > #status').select(1)
  //cy.get('#modalOwnerProducts > form > .col-12 > .d-md-flex > :nth-child(2) > .btn').click({force: true})
  //cy.get('tbody > tr > [data-title="Nome"]').its('length')
  cy.get('.active > .label').invoke('text').then((indice)=>{
    //cy.log("Indice " + indice)
    for(let i = 0;i<indice;i++){
      //cy.visit("https://app.ticto.com.br/product#/");
      //cy.visit("https://app.qa2.ticto.com.br/product#/");
      cy.get('tbody > tr > [data-title="Nome"]').eq(i).invoke('text').then((nome)=>{
        nomeProduto = nome
      })
      cy.get('tbody > tr > [data-title="Tipo"]').eq(i).invoke('text').then((tipo)=>{
        tipoProduto = tipo
      })
      cy.get('tbody > tr > [data-title="Categoria"]').eq(i).invoke('text').then((categoria)=>{
        categoriaProduto = categoria
      })
      cy.log("Numero de Produtos: "+(i+1))
      cy.get('tbody > tr > [data-title="Código"]').eq(i).invoke('text').then((id)=>{
        //InformacaoOferta(id)
        InformacaoBasica(id)
        ProgramaAfiliado(id)
        cy.visit("https://app.poc.ticto.com.br/product#/").wait(500);
      })
    }
    cy.log(produtosErro);
    cy.log(descricaoErro);
  })
}

function InformacaoBasica(id){
  cy.visit(`https://app.poc.ticto.com.br/product/${id}/manage/info#/`).wait(500)
  cy.get('[id="description"]').invoke('val').then((descricao)=>{
    descProduto = descricao;
  })
  cy.get('[id="soft_descriptor"]').invoke('val').then((descCartaoL)=>{
    descCartao = descCartaoL;
  })
  cy.get('[id="suport_phone"]').invoke('val').then((telSuporte)=>{
    telefoneSuporte = telSuporte
  })
  cy.get('[id="suport_email"]').invoke('val').then((emailSuporte)=>{
    VerificaDados(nomeProduto,tipoProduto,categoriaProduto,descProduto,descCartao,telefoneSuporte,emailSuporte)
  })
}

//TODO: Invocar valores dos campos
function ProgramaAfiliado(id){
  cy.visit(`https://app.poc.ticto.com.br/product/${id}/manage/affiliates#/`).wait(500)
  cy.get('#comission').invoke('val').then((comissao)=>{
    comissaoAfiliado = comissao;
    cy.log(comissao)
  })
  cy.get('#terms_of_affiliate_view').invoke('val').then((termos)=>{
    termosAfiliado = termos;
    cy.log(termos)
  })
  cy.get('#description_affiliate_view').invoke('val').then((descricao)=>{
    descricaoAfiliado = descricao;
    cy.log(descricao)
  })
  cy.get('#select2-aproveType-container').its('val').then((aprovacao)=>{
    tipoAprovacao = aprovacao
    cy.log(aprovacao)
  })
  cy.get('#select2-typeComission-container').its('val').then((tipoComissao)=>{
    cy.log(tipoComissao)
    VerificaProgAfiliado(nomeProduto,tipoProduto,comissaoAfiliado,termosAfiliado,descricaoAfiliado,tipoAprovacao,tipoComissao)
  })
}

function InformacaoOferta(id){
        //cy.visit(`https://app.ticto.com.br/product/${id}/manage/offers#/`)
        //cy.visit(`https://app.qa2.ticto.com.br/product/${id}/manage/offers#/`)
        //TODO: Ofertas
        cy.visit(`https://app.poc.ticto.com.br/product/${id}/manage/offers#/`)
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
            cy.get('#linkProductOffers').click({force:true}).wait(1500);
            
          }
          //cy.visit("https://app.qa2.ticto.com.br/product#/");
          cy.visit("https://app.poc.ticto.com.br/product#/");
          cy.get('button[id="btnOwnerProducts"]').click();
          cy.get('#modalOwnerProducts > form > .form-group > .row > :nth-child(1) > #status').select(1)
          cy.get('#modalOwnerProducts > form > .col-12 > .d-md-flex > :nth-child(2) > .btn').click({force: true}).wait(2000)
        })
}

function VerificaNome (nome,tipo,categoria,nomeOffer,valorOffer){
  cy.produto2().then((response)=>{
    nomeProdutoDashAPI = response.body.data.map(nome => nome.name);
    idProdutoDashAPI = response.body.data.map(id => id.id);
    categoriaProdutoDashAPI = response.body.data.map(categoria => categoria.category);
    tipoProdutoDashAPI = response.body.data.map(tipo => tipo.type);

    if(response.body.links.first != response.body.links.last){
    cy.produto3(response.body.links.next).then((response)=>{
      nomeProdutoDashAPI = nomeProdutoDashAPI.concat(response.body.data.map(nome => nome.name))
      idProdutoDashAPI = idProdutoDashAPI.concat(response.body.data.map(id => id.id))
      categoriaProdutoDashAPI = categoriaProdutoDashAPI.concat(response.body.data.map(categoria => categoria.category))
      tipoProdutoDashAPI = tipoProdutoDashAPI.concat(response.body.data.map(tipo => tipo.type))
      Comparar(nomeProdutoDashAPI,tipoProdutoDashAPI,categoriaProdutoDashAPI,nome,tipo,categoria,idProdutoDashAPI,nomeOffer,valorOffer)
    })}else Comparar(nomeProdutoDashAPI,tipoProdutoDashAPI,categoriaProdutoDashAPI,nome,tipo,categoria,idProdutoDashAPI,nomeOffer,valorOffer)
  })
}

function VerificaProgAfiliado(nome,tipo,comissaoAfiliado,termosAfiliado,descricaoAfiliado,tipoAprovacao,tipoComissao){
  cy.produto2().then((response)=>{
    nomeProdutoDashAPI = response.body.data.map(nome => nome.name);
    tipoProdutoDashAPI = response.body.data.map(tipo => tipo.type);
    comissaoAfiliadoDashAPI = response.body.data.map(comissao => comissao.affiliate_percentage);
    termosAfiliadoDashAPI = response.body.data.map(termos => termos.affiliation_terms);
    descricaoAfiliadoDashAPI = response.body.data.map(desc => desc.affiliation_description);
    tipoAprovacaoDashAPI = response.body.data.map(aprov => aprov.has_auto_affiliation);
    tipoComissaoDashAPI = response.body.data.map(comiss => comiss.affiliate_commission_type);

    if(response.body.links.first != response.body.links.last){
    cy.produto3(response.body.links.next).then((response)=>{
      nomeProdutoDashAPI = nomeProdutoDashAPI.concat(response.body.data.map(nome => nome.name))
      tipoProdutoDashAPI = tipoProdutoDashAPI.concat(response.body.data.map(tipo => tipo.type))
      comissaoAfiliadoDashAPI = comissaoAfiliadoDashAPI.concat(response.body.data.map(comissao => comissao.affiliate_percentage));
      termosAfiliadoDashAPI = termosAfiliadoDashAPI.concat(response.body.data.map(termos => termos.affiliation_terms));
      descricaoAfiliadoDashAPI = descricaoAfiliadoDashAPI.concat(response.body.data.map(desc => desc.affiliation_description));
      tipoAprovacaoDashAPI = tipoAprovacaoDashAPI.concat(response.body.data.map(aprov => aprov.has_auto_affiliation));
      tipoComissaoDashAPI = tipoComissaoDashAPI.concat(response.body.data.map(comiss => comiss.affiliate_commission_type));
      VerificaConfigAfiliado(nomeProdutoDashAPI,tipoProdutoDashAPI,comissaoAfiliadoDashAPI,termosAfiliadoDashAPI,descricaoAfiliadoDashAPI,tipoAprovacaoDashAPI,tipoComissaoDashAPI,nome,tipo,comissaoAfiliado,termosAfiliado,descricaoAfiliado,tipoAprovacao,tipoComissao)
    })}else VerificaConfigAfiliado(nomeProdutoDashAPI,tipoProdutoDashAPI,comissaoAfiliadoDashAPI,termosAfiliadoDashAPI,descricaoAfiliadoDashAPI,tipoAprovacaoDashAPI,tipoComissaoDashAPI,nome,tipo,comissaoAfiliado,termosAfiliado,descricaoAfiliado,tipoAprovacao,tipoComissao)
  })
}

function Comparar(apiNome,apiTipo,apiCategoria,nomeLegado,tipoLegado,categoriaLegado,idProduto,nomeOferta,valorOferta){
  let indice = apiNome.indexOf(nomeLegado);
     if((Dicionario(apiTipo[indice]) != Dicionario(tipoLegado))){
      indice = apiNome.indexOf(nomeLegado , indice + 1);
    }
    if(indice === -1){
      produtosErro.push(nomeLegado);
    }else{
      expect(apiNome[indice]).to.include(nomeLegado);
      expect(Dicionario(apiTipo[indice])).to.include(Dicionario(tipoLegado));
      
      cy.ofertas2(idProduto[indice]).then((response)=>{
        let jsonOferta = response.body.data;
        let nomeOfertasAPI = jsonOferta.map(nome => nome.name);
        let valorOfertasAPI = jsonOferta.map(nome => nome.price);
        const ind = nomeOfertasAPI.indexOf(nomeOferta);
        const sempontoevirgula = valorOferta.replace(/,/g, "").replace(/\./g, "").replace("R$", "").replace(/\s/g, '');
        
        if(ind === -1){
          produtosErro.push("Produto: "+ nomeLegado + "Oferta: "+ nomeOferta);
        }else{
        expect(nomeOfertasAPI[ind]).to.include(nomeOferta);
        expect((valorOfertasAPI[ind].toString())).to.include(sempontoevirgula);
        }
      })
    }  
}

function VerificaDados(nome,tipo,categoria,descricao,descricaoCartao,telefone,email){
  cy.produto2().then((response)=>{
    nomeProdutoDashAPI = response.body.data.map(nome => nome.name);
    idProdutoDashAPI = response.body.data.map(id => id.id);
    categoriaProdutoDashAPI = response.body.data.map(categoria => categoria.category);
    tipoProdutoDashAPI = response.body.data.map(tipo => tipo.type);
    descProdutoDashAPI = response.body.data.map(desc => desc.description);
    descCartaoDashAPI = response.body.data.map(desc => desc.soft_descriptor);
    emailSuporteDashAPI = response.body.data.map(email => email.support_email);
    telefoneSuporteDashAPI = response.body.data.map(tel => tel.support_phone);
    
    if(response.body.links.first != response.body.links.last){
    cy.produto3(response.body.links.next).then((response)=>{
      nomeProdutoDashAPI = nomeProdutoDashAPI.concat(response.body.data.map(nome => nome.name));
      idProdutoDashAPI = idProdutoDashAPI.concat(response.body.data.map(id => id.id));
      categoriaProdutoDashAPI = categoriaProdutoDashAPI.concat(response.body.data.map(categoria => categoria.category));
      tipoProdutoDashAPI = tipoProdutoDashAPI.concat(response.body.data.map(tipo => tipo.type));
      descProdutoDashAPI = descProdutoDashAPI.concat(response.body.data.map(desc => desc.description));
      descCartaoDashAPI = descCartaoDashAPI.concat(response.body.data.map(descCart => descCart.soft_descriptor));
      emailSuporteDashAPI = emailSuporteDashAPI.concat(response.body.data.map(email => email.support_email));
      telefoneSuporteDashAPI = telefoneSuporteDashAPI.concat(response.body.data.map(tel => tel.support_phone));
      VerificaProduto(nomeProdutoDashAPI,tipoProdutoDashAPI,categoriaProdutoDashAPI,descProdutoDashAPI,descCartaoDashAPI,emailSuporteDashAPI,telefoneSuporteDashAPI,nome,tipo,categoria,descricao,descricaoCartao,telefone,email)
    })}else VerificaProduto(nomeProdutoDashAPI,tipoProdutoDashAPI,categoriaProdutoDashAPI,descProdutoDashAPI,descCartaoDashAPI,emailSuporteDashAPI,telefoneSuporteDashAPI,nome,tipo,categoria,descricao,descricaoCartao,telefone,email)
  })
}

function VerificaProduto(apiNome,apiTipo,apiCategoria,apidDescricaoProd,apiDescricaoCartao,apiEmailSuporte,apiTelefoneSuporte,nomeLegado,tipoLegado,categoriaLegado,descricaoLegado,descricaoCartaoLegado,telefoneLegado,emailLegado){
  let indice = apiNome.indexOf(nomeLegado);
  if((Dicionario(apiTipo[indice]) != Dicionario(tipoLegado))){
   indice = apiNome.indexOf(nomeLegado , indice + 1);
   }
  if(indice === -1){
    produtosErro.push(nomeLegado);
  }else{
    expect(apiNome[indice]).to.include(nomeLegado);
    expect(Dicionario(apiTipo[indice])).to.include(Dicionario(tipoLegado));
    //expect(apiCategoria[indice]).to.include(categoriaLegado);
    if((apidDescricaoProd[indice] ? apidDescricaoProd[indice] : "") == descricaoLegado){
    expect(apidDescricaoProd[indice] ? apidDescricaoProd[indice] : "").to.include(descricaoLegado);}
    else descricaoErro.push("Produto: "+nomeLegado + " Descrição: " + descricaoLegado)
    expect(apiDescricaoCartao[indice] ? apiDescricaoCartao[indice] : "").to.include(descricaoCartaoLegado);
    expect(apiEmailSuporte[indice] ? apiEmailSuporte[indice] : "").to.include(emailLegado);
    expect(apiTelefoneSuporte[indice] ? apiTelefoneSuporte[indice] : "").to.include(Dicionario(telefoneLegado));
  }
}

function VerificaConfigAfiliado(apiNome,apiTipo,apiComissaoAfiliado,apiTermosAfiliado,apiDescricaoAfiliado,apiTipoAprovacao,apiTipoComissao,nomeLegado,tipoLegado,comissaoAfiliadoLegado,termosAfiliadoLegado,descricaoAfiliadoLegado,tipoAprovacaoLegado,tipoComissaoLegado){
  let indice = apiNome.indexOf(nomeLegado);
  cy.log("Legado "+nomeLegado);
  cy.log("API "+apiNome[indice])
  if((Dicionario(apiTipo[indice]) != Dicionario(tipoLegado))){
   indice = apiNome.indexOf(nomeLegado , indice + 1);
   }
  if(indice === -1){
    produtosErro.push(nomeLegado);
  }else{
    cy.log("API: "+apiComissaoAfiliado[indice]);
    cy.log("Legado: "+comissaoAfiliadoLegado);
    expect(apiNome[indice]).to.include(nomeLegado);
    expect(Dicionario(apiTipo[indice])).to.include(Dicionario(tipoLegado));
    //expect(apiCategoria[indice]).to.include(categoriaLegado);
    //expect(apiComissaoAfiliado[indice]).to.include(apiComissaoAfiliado[indice]);
    expect(apiTermosAfiliado[indice] ? apiTermosAfiliado[indice]:"").to.include(termosAfiliadoLegado ? termosAfiliadoLegado:"");
    expect(apiDescricaoAfiliado[indice] ? apiDescricaoAfiliado[indice]:"").to.include(descricaoAfiliadoLegado ? descricaoAfiliadoLegado:"");
    //expect(apiTipoAprovacao[indice]).to.include(tipoAprovacaoLegado);
    //expect(apiTipoComissao[indice]).to.include(tipoComissaoLegado)
  }
}

describe("Teste",()=>{
  it.only('OK Verificar Produto(Nome, Tipo e Categoria) e Oferta (Nome e Valor) (Front Legado/API Nova Dash)',()=>{
    ProdutosLegado();
  })
  it('OK Verificar Nova Dash API: Produto(Nome, Tipo e Categoria) e Oferta(Nome e Valor)',()=>{

    //cy.dashLogin().wait(3000);
    cy.stagingLogin().wait(3000)
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
        //cy.visit(`https://dash.ticto.com.br/product/${id}/offers`).wait(3000)
        cy.visit(`https://app-new-components.ticto.com.br/product/${id}/offers`).wait(3000)
        cy.get('.styles_tbody__8Cc_I > ').its('length').then((indiceOferta)=>{
          for(let i = 0;i<indiceOferta;i++){
            //cy.visit(`https://dash.ticto.com.br/product/${id}/offers`).wait(3000);
            cy.visit(`https://app-new-components.ticto.com.br/product/${id}/offers`).wait(3000)
            cy.get('[data-title="Ações"] > .small').eq(i).click({force:true}).wait(3000);
            cy.get(':nth-child(2) > .styles_input__481p7 > input').invoke('val').then((nome)=>{
              nomeOferta = nome
            })
            cy.get(':nth-child(4) > .styles_input__481p7 > input').invoke('val').then((valor)=>{
              VerificaNome(nomeProduto,tipoProduto,categoriaProduto,nomeOferta,valor);
            })
            //cy.dashLogin().wait(2000);
            cy.get('.styles_active__CwOAK').click().wait(3000)
          }
        //cy.visit("https://dash.ticto.com.br/product").wait(3000);
        cy.visit("https://app-new-components.ticto.com.br/product").wait(3000);
        })
      })
    }})
  })
  it('OK 2.0 (API) Verificar Nova Dash API: Produto(Nome, Tipo e Categoria) e Oferta(Nome e Valor)',()=>{

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

      const token = response.body.accessToken.token
      const refreshtoken = response.body.refreshToken.token 

      cy.setCookie("phoenix-staging.token",`${token}`)
      cy.setCookie("phoenix-staging.refreshtoken",`${refreshtoken}`)
      
      //cy.visit("https://dash.ticto.com.br/product");
      cy.stagingLogin().wait(3000)
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
          cy.wait(5000).get('.styles_description__5DLnq > :nth-child(2)').eq(i).invoke('text').then((idBruto)=>{
          const id = idBruto.replace(/ID/g, "").replace(/\./g, "");
          //cy.visit(`https://dash.ticto.com.br/product/${id}/offers`).wait(3000)
          cy.visit(`https://app-new-components.ticto.com.br/product/${id}/offers`)
          cy.get('.styles_tbody__8Cc_I > ').its('length').then((indiceOferta)=>{
            for(let i = 0;i<indiceOferta;i++){
              cy.get('[data-title="Ações"] > .small').eq(i).click({force:true}).wait(3000);
              cy.get(':nth-child(2) > .styles_input__481p7 > input').invoke('val').then((nome)=>{
                nomeOferta = nome
              })
              cy.get(':nth-child(4) > .styles_input__481p7 > input').invoke('val').then((valor)=>{
                VerificaNome(nomeProduto,tipoProduto,categoriaProduto,nomeOferta,valor,token);
              })
              //cy.dashLogin().wait(2000);
              //cy.get('.styles_active__CwOAK').click().wait(3000)
              cy.cookie();
              cy.stagingLogin().wait(3000)
              //cy.visit(`https://dash.ticto.com.br/product/${id}/offers`).wait(3000);
              cy.visit(`https://app-new-components.ticto.com.br/product/${id}/offers`).wait(3000);
            }
          cy.cookie();
          cy.stagingLogin().wait(3000)
          //cy.visit("https://dash.ticto.com.br/product").wait(3000);
          //cy.visit("https://app-new-components.ticto.com.br/product/").wait(3000);
          })
        })
      }})
    })
  })
    
  it("OK Logar Back",()=>{
    cy.legadoLoginAdmin();
    ProdutosLegado();
  })
  
  it("Logar Back Smaug",()=>{

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
        url: ('https://phoenix-staging.ticto.io/api/v1/private/products'),
        headers: 
        {
            "Authorization": `${token}`
        },
      failOnStatusCode: false, 
      }).then((resposta)=>{
        cy.log(resposta.body.data)
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
  it('Rel Vendas',()=>{
    const email = "patricia.freitas@ticto.com.br";
    const senha = "mudar136587";
    const emailConsulta = "cervantes.gabrielle95@gmail.com"
    
    cy.produto2().then((response)=>{
      nomeProdutoDashAPI = response.body.data.map(nome => nome.name);
      idProdutoDashAPI = response.body.data.map(id => id.id);
      categoriaProdutoDashAPI = response.body.data.map(categoria => categoria.category);
      tipoProdutoDashAPI = response.body.data.map(tipo => tipo.type);
      
      if(response.body.links.first != response.body.links.last){
      cy.produto3(response.body.links.next).then((response)=>{
        nomeProdutoDashAPI = nomeProdutoDashAPI.concat(response.body.data.map(nome => nome.name))
        idProdutoDashAPI = idProdutoDashAPI.concat(response.body.data.map(id => id.id))
        categoriaProdutoDashAPI = categoriaProdutoDashAPI.concat(response.body.data.map(categoria => categoria.category))
        tipoProdutoDashAPI = tipoProdutoDashAPI.concat(response.body.data.map(tipo => tipo.type))
        Comparar(nomeProdutoDashAPI,tipoProdutoDashAPI,categoriaProdutoDashAPI,nome,tipo,categoria,idProdutoDashAPI,nomeOffer,valorOffer,numOfertas)
      })}else Comparar(nomeProdutoDashAPI,tipoProdutoDashAPI,categoriaProdutoDashAPI,nome,tipo,categoria,idProdutoDashAPI,nomeOffer,valorOffer,numOfertas)
      
    })
  })
})
