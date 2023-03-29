let data; //contiene i libri prelevati dall'API
const url = 'https://striveschool-api.herokuapp.com/books';
let cartData = []; //contiene i libri presenti nel carrello

//funzione che recupera i libri dall'API
async function getData(url) {
    await fetch(url).then(response => response.json()).then((result) => {
        data = result;
    }).catch((err) => { alert("Si è verificato il seguente errore: " + err); });
}

//funzione che crea la griglia con le card
function createGrid(container, columns, arr, showButtons = true) {
    let rows = Math.ceil(arr.length / columns);
    for (let i = 1; i <= rows; i++) {
        let row = document.createElement('div');
        row.classList.add('row', 'g-2');
        for (let j = 1; j <= columns; j++) {
            let index = (j - 1) + columns * (i - 1);
            if (index < arr.length) {
                let col = document.createElement('div');
                col.classList.add('col', 'col-12', 'col-lg-3', 'mb-3');
                let card = getCard(arr[index], showButtons);
                col.appendChild(card);
                row.append(col);
            } else {
                break;
            }

        }
        container.append(row);
    }
}

//funzione che crea una card
function getCard(book, showButtons) {
    let card = document.createElement('div');
    card.classList.add('card', 'fs-5');
    card.style.width = '18rem';
    let anchor = document.createElement('a');
    anchor.setAttribute('href', `product.html?asin=${book.asin}`);
    anchor.setAttribute('target', '_blank');
    let img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', book.img);
    img.style.width = '100%';
    img.style.height = '500px';
    img.style.objectFit = 'cover';
    anchor.appendChild(img)
    card.appendChild(anchor);
    let badge = document.createElement('h2');
    badge.classList.add('position-absolute', 'top-0', 'end-0', 'd-none');
    cartData.forEach((element) => {
        if (element.title === book.title) {
            badge.classList.remove('d-none');
        }
    });
    let span = document.createElement('span');
    span.classList.add('badge', 'bg-success');
    span.innerText = 'Added to cart';
    badge.appendChild(span);
    card.appendChild(badge);
    let cardBody1 = document.createElement('div');
    cardBody1.classList.add('card-body');
    let h5 = document.createElement('h5');
    h5.classList.add('card-title', 'text-truncate');
    h5.innerText = book.title;
    cardBody1.appendChild(h5);
    card.appendChild(cardBody1);
    let ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');
    for (let i = 1; i <= 3; i++) {
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        switch (i) {
            case 1:
                li.innerText = `asin: ${book.asin}`;
                break;
            case 2:
                li.innerText = `category: ${book.category}`;
                break;
            case 3:
                li.innerText = `price: ${book.price}$`;
                break;
        }
        ul.appendChild(li);
    }
    card.appendChild(ul);
    if (showButtons) {
        let cardBody2 = document.createElement('div');
        cardBody2.classList.add('card-body');
        for (let i = 1; i <= 2; i++) {
            let a = document.createElement('a');
            a.classList.add('btn', 'btn-primary', 'mx-1');
            if (i === 1) {
                a.innerText = 'Add to cart';
                cartData.forEach((element) => {
                    if (element.title === book.title) {
                        a.innerText = 'Remove from cart';
                    }
                });
                a.classList.add('addToCartBtn');
            } else {
                a.innerText = 'Hide';
                a.classList.add('hideBtn');
            }
            cardBody2.appendChild(a);
        }
        card.appendChild(cardBody2);
    }
    return card;
}

//funzione che aggiunge o rimuove un libro dal carrello
function addToCart(event) {
    let card = event.target.parentElement.parentElement;
    let h5 = card.getElementsByTagName('h5')[0];
    let title = h5.innerText;
    let book = findBookByTitle(data, title);
    let badge = card.querySelector('.badge');
    let h3 = badge.parentElement;
    if (h3.classList.contains('d-none')) {
        h3.classList.remove('d-none');
        event.target.innerText = 'Remove from cart';
        cartData.push(book);
        changeCartValue(1);
    } else {
        h3.classList.add('d-none');
        event.target.innerText = 'Add to cart';
        let i = cartData.findIndex((element) => element.asin === book.asin);
        cartData.splice(i, 1);
        changeCartValue(-1);
    }
}

//funzione che incrementa o decrementa il valore sul carrello
//tale valore indica il numero di libri presenti nel carrello
function changeCartValue(inc) {
    let span = document.querySelector('#topSection span.badge');
    let value = parseInt(span.innerText);
    value += inc;
    //modifica lo stile del badge
    if (value > 0) {
        if (span.classList.contains('bg-secondary')) {
            span.classList.remove('bg-secondary');
            span.classList.add('bg-success');
        }
    } else {
        if (span.classList.contains('bg-success')) {
            span.classList.remove('bg-success');
            span.classList.add('bg-secondary');
        }
    }
    span.innerText = value.toString();
}

//funzione che nasconde una card
function hideCard(event) {
    let card = event.target.parentElement.parentElement;
    card.classList.add('d-none');
}

//funzione che ricerca il titolo inserito nella casella di input
function searchTitle(event) {
    let array = [];
    let album = document.querySelector('#cardSection > .album');
    let container = document.querySelector('#cardSection > .album > .container');
    let value = event.target.value.toLowerCase();
    if (value.length >= 3) {
        array = data.filter(item => item.title.toLowerCase().includes(value));
    } else {
        array = data;
    }
    if (array.length > 0) {
        container.remove();
        container = document.createElement('div');
        container.classList.add('container');
        album.appendChild(container);
        createGrid(container, 4, array);
    }
    setEventListener();
}

//funzione che mostra il carrello
function showCart() {
    if (cartData.length > 0) {
        let par1 = document.getElementById('elementsNumber');
        par1.innerText = 'Elements in the cart: ' + cartData.reduce((acc, item) => {
            return acc += 1;
        }, 0);
        let par2 = document.getElementById('totalPrice');
        let total = cartData.reduce((acc, item) => {
            return acc += item.price;
        }, 0);
        par2.innerText = 'Total price: ' + total.toFixed(2) + '$';
        let header = document.getElementsByTagName('header')[0];
        let topSection = document.getElementById('topSection');
        let cardSection = document.getElementById('cardSection');
        let cartSection = document.getElementById('cartSection');
        let album = document.querySelector('#cartSection > .album');
        let container = document.querySelector('#cartSection > .album > .container');
        if (container !== null) {
            container.remove();
        }
        container = document.createElement('div');
        container.classList.add('container');
        album.append(container);
        createGrid(container, 4, cartData, false);
        header.classList.add('d-none');
        topSection.classList.add('d-none');
        cardSection.classList.add('d-none');
        cartSection.classList.remove('d-none');
    }
}

//funzione che chiude il carrello
async function exitFromCart() {
    if (cartData.length === 0) {
        await getData(url);
        let album = document.querySelector('#cardSection > .album');
        let container = document.querySelector('#cardSection > .album > .container');
        container.remove();
        container = document.createElement('div');
        container.classList.add('container');
        album.appendChild(container);
        createGrid(container, 4, data);
        setEventListener();
    }
    let header = document.getElementsByTagName('header')[0];
    let topSection = document.getElementById('topSection');
    let cardSection = document.getElementById('cardSection');
    let cartSection = document.getElementById('cartSection');
    header.classList.remove('d-none');
    topSection.classList.remove('d-none');
    cardSection.classList.remove('d-none');
    cartSection.classList.add('d-none');
}

//funzione che svuota il carrello
function emptyCart() {
    for (let i = 1; i <= cartData.length; i++) {
        changeCartValue(-1);
    }
    cartData = [];
    let container = document.querySelector('#cartSection > .album > .container');
    container.remove();
    let par = document.getElementById('elementsNumber');
    par.innerText = 'Elements in the cart: 0';
    let par2 = document.getElementById('totalPrice');
    par2.innerText = '0$';
}

//funzione che imposta tutti i listener
function setEventListener() {
    let addToCartBtns = document.querySelectorAll('.addToCartBtn');
    addToCartBtns.forEach((item) => {
        item.addEventListener('click', addToCart);
    });
    let hideBtns = document.querySelectorAll('.hideBtn');
    hideBtns.forEach((item) => {
        item.addEventListener('click', hideCard);
    });
    let inputText = document.querySelector('#topSection input');
    inputText.addEventListener('keyup', searchTitle);
    let cartButton = document.getElementById('cartButton');
    cartButton.addEventListener('click', showCart);
    let exitFromCartButton = document.getElementById('exitFromCart');
    exitFromCartButton.addEventListener('click', exitFromCart);
    let emptyCartButton = document.getElementById('emptyCart');
    emptyCartButton.addEventListener('click', emptyCart);
}

//recupera un libro nell'array specificato con il titolo passato come parametro
function findBookByTitle(arr, title) {
    for(let element of arr) {
        if (element.title === title) {
            return element;
        }
    }   
}

//al caricamento della pagina...
window.addEventListener('load', async () => {
    await getData(url);
    let container = document.querySelector('#cardSection > .album > .container');
    createGrid(container, 4, data);
    setEventListener();
});