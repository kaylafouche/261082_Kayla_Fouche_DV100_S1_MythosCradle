window.addEventListener('scroll', () => {
    const btn = document.querySelector('.btn-view-cradle');
    const footer = document.querySelector('footer');
    
    const footerTop = footer.getBoundingClientRect().top;
    
    if (footerTop <= window.innerHeight) {
        btn.style.bottom = `${window.innerHeight - footerTop + 40}px`;
        btn.style.top = 'auto';
    } else {
        btn.style.top = '600px';
        btn.style.bottom = 'auto';
    }
});

let cart = [];

function adjustValue(change, id) {
    // Cart modal counter
    if (typeof id === 'number') {
        cart[id].qty = Math.max(1, cart[id].qty + change);
        updateCart();
        return;
    }
    // Adopt page counter
    const display = document.getElementById(id);
    let current = parseInt(display.textContent);
    current = Math.max(1, Math.min(10, current + change));
    display.textContent = current;
}
    // For cart modal counters
    cart[index].qty = Math.max(1, cart[index].qty + change);
    updateCart();

function addToCart(name, price, qtyElement) {
    const qty = parseInt(qtyElement.textContent || qtyElement.value);

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <p><strong>${item.name}</strong></p>
                    <p>R ${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-qty-selector">
                    <button class="cart-minus" onclick="adjustValue(-1, ${index})">-</button>
                    <span class="cart-qty">${item.qty}</span>
                    <button class="cart-plus" onclick="adjustValue(1, ${index})">+</button>
                </div>
                <button class="cart-remove" onclick="removeItem(${index})">🗑</button>
            </div>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = total.toLocaleString();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function openCart() {
    document.getElementById("cartModal").style.display = "block";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}
