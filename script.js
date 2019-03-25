const inputDOM = document.querySelector('#name'); // input onde se insere o nome de usuario do github
const btnSearchDOM = document.querySelector('#search'); // botao para pesquisar usuario
const listReposDOM = document.querySelector('#list'); // <li> onde ficara os nomes dos repositoris
const containerInsertDOM = document.querySelector('#container--insert'); // <div> com o <input> e o <button>

// busca pela url e quando acabar a busca ele chama as funções resolve ou reject, dependendo de qual o resultado da busca
function getRepos(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send(null);

        loading();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
                else {
                    reject('Error on requisition!');
                }
            }
        }
    });
};

// esvazia a lista
function cleanList() {
    while (listReposDOM.firstChild) { // percorre e remove cada child da lista
        listReposDOM.removeChild(listReposDOM.firstChild);
    }
}

function createListItem(text) {
    let repoName = document.createTextNode(text);
    let listItem = document.createElement('li');
    listItem.classList += 'list--item';
    listItem.appendChild(repoName);
    listReposDOM.appendChild(listItem);
}

// coloca uma <li> na lista em quanto estiver fazendo a busca pela url
function loading() {
    cleanList();
    createListItem('LOADING...');
}

// btnSearch on click, busca o usuario inserido na <input>

btnSearchDOM.onclick = () => {
    searchUserGithub(inputDOM.value);
}

// searchUserGithub('rihor');


// retorna a url formatada 
function formatarUrlApi(name) {
    return `https://api.github.com/users/${name}/repos`;
}

// recebe o nome de usuario e chama a função que pesquisa pela url
function searchUserGithub(name) {
    let url = formatarUrlApi(name);
    // função de busca pela url
    getRepos(url).then(answer => {
        cleanList();


        containerInsertDOM.classList += ' container--insert--height';

        // percorre o array de objetos e acessa o nome e então coloca uma <li> para cada item 
        for (let i = 0; i < answer.length; i++) { // preenche a lista            
            createListItem(answer[i].name);
        }

    }).catch(errorMessage => {
        // exibe uma mensagem de erro, colocando uma <li> com um aviso
        cleanList();
        createListItem('ERROR 404');
    });
}