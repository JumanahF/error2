let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Cart uses localStorage
let products = [
    { name: 'Lash Slick', description: 'Film form mascara', price: 100, image: 'images\glossier-makeup-lashslick-black-01.avif' },
    { name: 'Lip Line', description: 'Enhancing pencil', price: 90, image: 'images\glossier-carousel-lipline-hold-01.avif' },
    { name: 'Cloud Paint Blush', description: 'Seamless cheek color', price: 90, image: 'images\glossier-cloud-paint-soar-carousel-01.avif' },
    { name: 'Monochromes', description: 'Essential eyeshadow trio', price: 110, image: 'images\glossier-cloud-paint-soar-carousel-01.avif' }

];

// Customer: Add to cart
function addToCart(productName, price) {
    let existingProduct = cart.find(function(item) {
        return item.name === productName;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));  // Store cart in localStorage
    updateCartDisplay();  // Update the cart display
}

// Customer: Update cart display
function updateCartDisplay() {
    const cartElement = document.getElementById('cartDetails');
    let cartHTML = '';

    if (cart.length > 0) {
        cartHTML = '<ul>';
        cart.forEach(function(item) {
            cartHTML += '<li>' + item.name + ' - ' + item.price + ' (x' + item.quantity + ')'
                + '<button onclick="removeFromCart(\'' + item.name + '\')">Remove</button>'
                + '<button onclick="updateQuantity(\'' + item.name + '\', -1)">-</button>'
                + '<button onclick="updateQuantity(\'' + item.name + '\', 1)">+</button>'
                + '</li>';
        });
        cartHTML += '</ul>';
        cartHTML += '<p>Total: ' + calculateTotal() + '</p>';
    } else {
        cartHTML = '<p>No items in your cart.</p>';
    }

    cartElement.innerHTML = cartHTML;
    document.getElementById('cartSummary').textContent = 'Items: ' + cart.length + ' | Total: ' + calculateTotal();
}

// Function to calculate the total price of items in the cart
function calculateTotal() {
    return cart.reduce(function(total, item) {
        return total + (item.price * item.quantity);
    }, 0);
}

// Customer: Remove an item from the cart
function removeFromCart(productName) {
    cart = cart.filter(function(item) {
        return item.name !== productName;
    });
    localStorage.setItem('cart', JSON.stringify(cart));  // Update localStorage
    updateCartDisplay();  // Update the cart display
}

// Customer: Update the quantity of an item in the cart
function updateQuantity(productName, change) {
    const product = cart.find(function(item) {
        return item.name === productName;
    });
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productName);  // Remove item if quantity is 0
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));  // Update localStorage
            updateCartDisplay();  // Update the cart display
        }
    }
}

// Customer: Checkout process
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
    } else {
        const total = calculateTotal();
        if (confirm('Total Price: ' + total + '. Confirm your purchase?')) {
            alert('Thank you for your purchase!');
            cart = [];  // Clear the cart after checkout
            localStorage.removeItem('cart');  // Clear the cart from localStorage
            updateCartDisplay();  // Update the cart display
        }
    }
}

// Admin: Add a new product
function addProduct() {
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productImage = document.getElementById('productImage').value;  // Get the image URL from the form

    if (productName && productDescription && productImage && !isNaN(productPrice) && productPrice > 0) {
        products.push({ name: productName, description: productDescription, price: productPrice, image: productImage });
        updateProductList();  // Refresh the product list display
        alert(productName + ' has been added.');
    } else {
        alert('Invalid product details.');
    }
}

// Admin: Update the product list display
function updateProductList() {
    const productListElement = document.getElementById('productList');
    productListElement.innerHTML = '';  // Clear existing products

    products.forEach(function(product, index) {
        const productHTML = '<li>' + product.name + ' - ' + product.price
            + '<button onclick="removeProduct(' + index + ')">Remove</button></li>';
        productListElement.innerHTML += productHTML; // Add each product to the list
    });
}

// Admin: Remove a product from the list
function removeProduct(index) {
    products.splice(index, 1);  // Remove the product at the specified index
    updateProductList();  // Refresh the product list display
}
