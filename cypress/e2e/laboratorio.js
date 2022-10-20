function Dicionario(tipoDado, parametro1){
    if(parametro1 == "Produto Físico") return "Físico"
    else if (parametro1 == "Eventos") return "Evento"
    else if (parametro1 == "Curso Online") return "Curso"
    else if (parametro1 == "E-books") return "E-book"
    else if (parametro1 == "Serviço de Assinatura") return "Assinatura"
    else if (parametro1 == "Outros"|| parametro1 == "Instagram" ) return "Outro"
}