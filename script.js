const inputDOM = document.querySelector('#name'); // input onde se insere o nome de usuario do github
const btnSearchDOM = document.querySelector('#search'); // botao para pesquisar usuario
// const listReposDOM = document.querySelector('#list'); // <li> onde ficara os nomes dos repositoris
const insertDOM = document.querySelector('#insert'); // <div> com o <input> e o <button>
const containerListDOM = document.querySelector('#container--lista');
const ulElement = document.createElement('ul');
// busca pela url e quando acabar a busca ele chama as funções resolve ou reject, dependendo de qual o resultado da busca
const getRepos = (url) => new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);

    loading(true); // exibe um .gif de loading

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            loading(false);
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                reject('Error on requisition!');
            }
        }
    }
});

// esvazia a lista
function cleanList(list) {
    console.log('cleanList');
    if (list.innerHTML == '') {
        return;
    }
    while (list.firstChild) { // percorre e remove cada child da lista
        list.removeChild(list.firstChild);
    }
}

function createListItem(text) {
    let repoName = document.createTextNode(text);
    let listItem = document.createElement('li');
    listItem.classList += ' list--item';
    listItem.appendChild(repoName);
    ulElement.appendChild(listItem);
    setInterval(() => { // se a classe for colocada imediatamente a transição não funciona
        listItem.classList += ' list--item--transition'; 
    }, 1);
}

// muda o background do btnSearchDOM
function loading(isLoading) {
    if (isLoading) {
        btnSearchDOM.style = 'background: url(./img/loading.gif);';
    } else {
        btnSearchDOM.style = 'background: url(./img/favicon.png);';
    }
}

// btnSearch on click, busca o usuario inserido na <input>
btnSearchDOM.onclick = () => {
    searchUserGithub(inputDOM.value);
}

// retorna a url formatada 
function formatarUrlApi(name) {
    return `https://api.github.com/users/${name}/repos`;
}

// recebe o nome de usuario e chama a função que pesquisa pela url
function searchUserGithub(name) {
    let url = formatarUrlApi(name);
    // função de busca pela url
    getRepos(url).then(answer => {

        ulElement.classList += ' list';
        containerListDOM.appendChild(ulElement);
        cleanList(ulElement);

        // listReposDOM.classList += ' list--transition';

        // percorre o array de objetos e acessa o nome e então coloca uma <li> para cada item 
        for (let i = 0; i < answer.length; i++) { // preenche a lista            
            createListItem(answer[i].name);
        }

        console.log(containerListDOM.classList);
        containerListDOM.appendChild(ulElement);

    }).catch(errorMessage => {
        // exibe uma mensagem de erro, colocando uma <li> com um aviso
        cleanList(ulElement);
        createListItem('ERROR 404');
        console.log(errorMessage);
    });
}