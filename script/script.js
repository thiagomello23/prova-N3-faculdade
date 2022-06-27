
const imageContainer = document.querySelector(".image--container");
const btn = document.getElementById("btnEvent");
const contentContainer = document.querySelector(".content--container");
const simbolo = document.querySelector(".simbolo");

// Puxa os dados de uma API
async function dadosApi(){

    const requisicaoAnimal = await fetch("https://zoo-animal-api.herokuapp.com/animals/rand", {
        method: 'GET'
    });
    const respostaAnimal = await requisicaoAnimal.json();
    
    if(respostaAnimal){

        // Funcao para traduzir os dados
        // Apos traduzir ele tmb monta os dados
        traducao(respostaAnimal);

        // Muda a frase do botao apos o primeiro animal ser requisitado
        btn.textContent = 'Gerar Novo Animal';

        // Libera os dados na tela
        contentContainer.classList.remove("hidden");

        // Removendo o pre-loader
        preLoaderAnimation();

    }

}

// Monta os dados no html
function montaDados(dados){

    // ID's no HTML
    const name = document.getElementById("name");
    const animalType = document.getElementById("animalType");
    const maxLength = document.getElementById("maxLength");
    const minLength = document.getElementById("minLength");
    const habitat = document.getElementById("habitat");

    // Adiciona a Tag img dentro do container
    imageContainer.innerHTML = `<img class="image" src="${dados.image}" alt="">`;

    // Animal info
    name.textContent = dados.nome;
    animalType.textContent = dados.animalType;
    maxLength.textContent = dados.maxLength;
    minLength.textContent  = dados.minLength;
    habitat.textContent = dados.habitat;

}


function preLoaderAnimation(){

    const content = document.querySelector(".content");
    const preLoader = document.querySelectorAll(".pre--loader");

    preLoader.forEach(item => item.classList.toggle("hidden"));
    content.classList.toggle("hidden");

}


// Evento para quando o usuario clicar
btn.addEventListener("click", function(e){
    e.preventDefault();

    // Remove o simbolo '?'
    simbolo.classList.add("hidden");

    // Ativando pre-loader
    preLoaderAnimation();

    // Puxa  e monta os dados na tela
    dadosApi();

});

async function traducao(objeto){ 

    // Separa os dados que serao traduzidos
    const array = [objeto.name + '/', objeto.habitat + '/', objeto.animal_type + '/'];
    const respostaTraducao = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&" + new URLSearchParams({
        'sl': 'en',
        'tl': 'pt',
        'q': array
    }));

    const response = await respostaTraducao.json();
    // Dados traduzidos 
    const dados = response[0][0][0];

    // Apos isso separa as frases por "/" e corta a virgula da casa inicial de cada uma
    // isso e necessario pois a API de traducao aceita apenas uma frase de cada vez
    // Para nao ter necessidade de multiplas chamadas da API entao passei um array
    // Contendo as 3 frases traduzidas e tratei os dados, sendo a posicao [0] o 
    // nome, posicao [1] o habitat e posicao [2] o tipo de animal
    const finalizado = dados.split("/");
    const nome = finalizado[0];
    const habitat = finalizado[1].substr(1);
    const animalType = finalizado[2].substr(1);
    
    // Novo objeto com os dados traduzidos 
    const dadosTraduzidos = {
        "nome": nome,
        "habitat": habitat,
        "animalType": animalType,
        "maxLength": ((objeto.length_max * 30.48) / 100).toFixed(2) + 'm', // Transformar de pés para metros (medida)
        "minLength": ((objeto.length_min * 30.48) / 100).toFixed(2) + 'm', // Transformar de pés para metros (medida)
        "image": objeto.image_link
    }

    // Monta os dados ja traduzidos 
    montaDados(dadosTraduzidos);
}