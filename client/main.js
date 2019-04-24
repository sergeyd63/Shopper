const data = [
    {
        "itemName": "banana",
        "itemId": "banana",
        "imgSrc": "http://www.pngall.com/wp-content/uploads/2016/04/Banana-Free-PNG-Image.png",
        "price": 1.25,
        "quantityRemaining": 10
    },
    {
        "itemName": "apple",
        "itemId": "apple",
        "imgSrc": "http://www.pngall.com/wp-content/uploads/2016/04/Apple-Fruit-PNG-HD.png",
        "price": 2.50,
        "quantityRemaining": 5
    },
    {
        "itemName": "raspberry",
        "itemId": "raspberry",
        "imgSrc": "http://www.pngall.com/wp-content/uploads/2016/04/Raspberry-Free-PNG-Image.png",
        "price": 4.00,
        "quantityRemaining": 2
    },
    {
        "itemName": "kiwi",
        "itemId": "kiwi",
        "imgSrc": "http://www.pngall.com/wp-content/uploads/2016/04/Kiwi-PNG-Image.png",
        "price": 3.33,
        "quantityRemaining": 15
    },
    {
        "itemName": "very delicious pineapple with a long name",
        "itemId": "pineapple",
        "imgSrc": "http://www.pngall.com/wp-content/uploads/2016/05/Pineapple-Free-Download-PNG.png",
        "price": 4.75,
        "quantityRemaining": 1
    },
    {
        "itemName": "strawberries",
        "itemId": "strawberries",
        "imgSrc": "http://www.pngall.com/wp-content/uploads/2016/05/Strawberry-Download-PNG.png",
        "price": 2.05,
        "quantityRemaining": 3
    }
]
let cartItems = {
    totalPrice: 0.00,
    totalItems: 0
};

const fruitContainer = document.getElementsByClassName('container')[0];
const cartItemElement = document.getElementsByClassName('cart-items')[0];
const cartTotal = document.querySelector('.cart-total span');
const cartTotalItems = document.querySelector('.cart span');
const emptyCartElem = document.querySelector('.empty-cart');
emptyCartElem.onclick = emptyCart;
const confirmPurchaseElm = document.querySelector('.confirm');
confirmPurchaseElm.onclick = confirmPurchase;

// Generate the main view
(() => {
    data.forEach(fruit => {
        const fBox = document.createElement('div');
        fBox.classList.add('box', fruit.itemId);
        const fImage = document.createElement('img');
        fImage.src = fruit.imgSrc;
        const fName = document.createElement('div');
        fName.innerHTML = fruit.itemName.charAt(0).toUpperCase() + fruit.itemName.slice(1);
        fName.classList.add('fruit-name');
        const fPrice = document.createElement('div');
        fPrice.innerHTML = `<span class="fruit-price">$${fruit.price}</span> <span class="fruit-quantity">${fruit.quantityRemaining}</span> in Stock`;
        const fAdd = document.createElement('div');
        fAdd.classList.add('add-to-cart');
        fAdd.innerHTML = 'Add to Cart';
        fAdd.onclick = addToCart;
        fAdd.setAttribute('fruit-id', fruit.itemId)

        fBox.appendChild(fImage);
        fBox.appendChild(fName);
        fBox.appendChild(fPrice);
        fBox.appendChild(fAdd);

        fruitContainer.appendChild(fBox);
    });
})();

// Add item to cart
function addToCart() {
    const fruitId = this.getAttribute('fruit-id');
    // Cjeck for: already in the cart
    if (cartItemElement.querySelector(`[fruit-id=${fruitId}]`)) {
        alert('Item already in the Cart.');
        return;
    }
    // Check for: no more items in stock
    if(getFruit(fruitId).quantityRemaining === 0){
        let fruitName = getFruit(fruitId).itemName;
        fruitName = fruitName.charAt(0).toUpperCase() + fruitName.slice(1);
        alert(`No more ${fruitName}s left in stock`);
        return;
    }

    generateCartItem(fruitId);
}

// Generate added item in the cart
function generateCartItem(fruitId) {
    const fruit = getFruit(fruitId);

    const cartItem = document.createElement('div');
    cartItem.classList.add('cartItem');
    cartItem.setAttribute('fruit-id', fruitId);
    const fImage = document.createElement('img');
    fImage.src = fruit.imgSrc;
    const remove = document.createElement('div');
    remove.innerHTML = '-';
    remove.classList.add('cart-item-change');
    remove.onclick = decrementItem;
    const amount = document.createElement('div');
    amount.innerHTML = '1';
    amount.classList.add('item-amount');
    const add = document.createElement('div');
    add.innerHTML = '+';
    add.classList.add('cart-item-change');
    add.onclick = incrementItem;
    const itemTotal = document.createElement('div');
    itemTotal.classList.add('cart-item-total');
    itemTotal.style.paddingTop = '60px';
    itemTotal.innerHTML = `@ $<span class="item-value">${fruit.price}</span> each = $<span class="total-item-value">${fruit.price}</span>`;
    const delelteItem = document.createElement('div');
    delelteItem.classList.add('cart-item-total', 'delete');
    delelteItem.innerHTML = 'Delete';
    delelteItem.onclick = selectToDeleteFromCart;
    itemTotal.appendChild(delelteItem);

    cartItem.appendChild(fImage);
    cartItem.appendChild(remove);
    cartItem.appendChild(amount);
    cartItem.appendChild(add);
    cartItem.appendChild(itemTotal);

    cartItemElement.appendChild(cartItem);

    cartItems[fruitId] = {
        quant: 1,
        price: fruit.price
    }

    cartItems.totalPrice += cartItems[fruitId].price;
    cartItems.totalItems += 1;

    updateCartTotal();
}

// Increment item amount in the cart
function incrementItem() {
    const fruitId = this.parentElement.getAttribute('fruit-id');
    const totalItemsEl = this.parentElement.querySelector('.item-amount');
    let fruit = getFruit(fruitId);

    // Check for: max available amount added
    if (cartItems[fruitId].quant === fruit.quantityRemaining) {
        return;
    }

    cartItems[fruitId].quant++;

    updateItemInCartTotal(cartItems[fruitId], totalItemsEl);
}

// Decrement item amount in the cart
function decrementItem() {
    const fruitId = this.parentElement.getAttribute('fruit-id');
    const totalItemsEl = this.parentElement.querySelector('.item-amount');

    // Check for: not less than 0
    if (cartItems[fruitId].quant === 0) {
        return;
    }

    cartItems[fruitId].quant--;

    updateItemInCartTotal(cartItems[fruitId], totalItemsEl);
}

// Determin which item to delete from cart
function selectToDeleteFromCart() {
    const fruitId = this.parentElement.parentElement.getAttribute('fruit-id');

    deleteItemFromCart(fruitId);
}

// Remove item from cart
function deleteItemFromCart(fruitId) {
    cartItems.totalItems -= 1;
    const cartItemElm = document.querySelector(`.cartItem[fruit-id=${fruitId}]`);

    updateItemInCartTotal(cartItems[fruitId], cartItemElm.querySelector('.item-amount'));
    delete cartItems[fruitId];
    cartItemElm.remove();

    updateCartTotal();
}

// Get Fruit object from list
function getFruit(fruitId) {
    return data.find(el => {
        return el.itemId === fruitId;
    });
}

// Update view in cart
function updateItemInCartTotal(item, totalItemsEl) {
    totalItemsEl.innerHTML = item.quant;
    totalItemsEl.parentElement.querySelector('.total-item-value').innerHTML = (item.quant * item.price).toFixed(2);

    updateCartTotal()
}

// Update view of total in cart
function updateCartTotal() {
    cartItems.totalPrice = 0.00;
    Object.keys(cartItems).map(item => {
        if (!cartItems[item].hasOwnProperty('price')) {
            return
        }
        cartItems.totalPrice += (cartItems[item].price * cartItems[item].quant);
    });

    cartTotal.innerHTML = cartItems.totalPrice.toFixed(2);
    cartTotalItems.innerHTML = document.getElementsByClassName('cartItem').length;
}

// Remove all items from cart
function emptyCart() {
    Object.keys(cartItems).map(item => {
        if (!cartItems[item].hasOwnProperty('price')) {
            return
        }
        deleteItemFromCart(item);
    });

    cartItems = {
        totalPrice: 0.00,
        totalItems: 0
    }
}

// Confirm purchase, update amounts in stock and clear the cart
function confirmPurchase() {
    if (cartItems.totalItems === 0) {
        return;
    }
    Object.keys(cartItems).map(item => {
        if (!cartItems[item].hasOwnProperty('price')) {
            return
        }
        let fruit = data.find(element => {
            return element.itemId === item;
        });

        fruit.quantityRemaining -= cartItems[item].quant;

        document.querySelector(`.box.${fruit.itemId} .fruit-quantity`).innerHTML = fruit.quantityRemaining;

        emptyCart();
    });
}