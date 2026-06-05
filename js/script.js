window.addEventListener('scroll', () => {
    const btn = document.querySelector('.btn-view-cradle');
    if (btn) {
        const footer = document.querySelector('footer');
        
        const footerTop = footer.getBoundingClientRect().top;
        
        if (footerTop <= window.innerHeight) {
            btn.style.bottom = `${window.innerHeight - footerTop + 40}px`;
            btn.style.top = 'auto';
        } else {
            btn.style.top = '600px';
            btn.style.bottom = 'auto';
        }
    }
});

let cart = [];

/**
 * Adjust quantity values
 * Used for both adopt page counters and cart modal quantity selectors
 */
function adjustValue(change, id) {
    // Cart modal counter (when id is a number - cart index)
    if (typeof id === 'number') {
        if (cart[id]) {
            cart[id].qty = Math.max(1, cart[id].qty + change);
            updateCart();
        }
        return;
    }
    
    // Adopt page counter (when id is a string - element ID)
    const display = document.getElementById(id);
    if (display) {
        let current = parseInt(display.textContent);
        current = Math.max(1, Math.min(10, current + change));
        display.textContent = current;
    }
}

/**
 * Add item to cart
 * Called from "Add to Cradle" buttons on adopt page
 */
function addToCart(name, price, qtyElement) {
    const qty = parseInt(qtyElement.textContent || qtyElement.value);

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    updateCart();
    
    // Visual feedback
    showAddedNotification(name);
}

/**
 * Show a brief notification when item is added
 */
function showAddedNotification(itemName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #15d5f5;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(21, 213, 245, 0.3);
    `;
    notification.textContent = `✓ ${itemName} added to Cradle!`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

/**
 * Update cart display
 * Updates modal content, total, and cart count badge
 */
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        // Show empty cart message
        cartItems.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Your Cradle is empty</p>
                <p style="font-size: 14px; opacity: 0.7;">Add a mythical creature to get started!</p>
            </div>
        `;
    } else {
        // Display cart items
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            count += item.qty;

            const itemTotal = (item.price * item.qty).toLocaleString();

            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <p class="item-name">${item.name}</p>
                        <p class="item-price">R ${item.price.toLocaleString()} each</p>
                        <p style="font-size: 14px; color: #666; margin-top: 8px;">Subtotal: R ${itemTotal}</p>
                    </div>
                    <div class="cart-qty-selector">
                        <button class="cart-minus" onclick="adjustValue(-1, ${index})" title="Decrease quantity">−</button>
                        <span class="cart-qty">${item.qty}</span>
                        <button class="cart-plus" onclick="adjustValue(1, ${index})" title="Increase quantity">+</button>
                    </div>
                    <button class="cart-remove" onclick="removeItem(${index})" title="Remove from cart">Remove</button>
                </div>
            `;
        });
    }

    // Update cart count badge
    if (cartCount) {
        cartCount.innerText = count;
        if (count > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }

    // Update total
    if (cartTotal) {
        cartTotal.innerText = total.toLocaleString();
    }
}

/**
 * Remove item from cart
 * @param {number} index - Index of item to remove
 */
function removeItem(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCart();
    
    // Show removal notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #ff6b6b;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    `;
    notification.textContent = `✓ ${itemName} removed`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

/**
 * Open cart modal
 * Displays the full-page cart modal
 */
function openCart() {
    const modal = document.getElementById("cartModal");
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
}

/**
 * Close cart modal
 * Hides the full-page cart modal
 */
function closeCart() {
    const modal = document.getElementById("cartModal");
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable body scroll
    }
}

/**
 * Navigate back to home page
 * Called by "Continue Shopping" button
 */
function continueSearchingHome() {
    closeCart();
    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        // Already inside pages folder
        window.location.href = 'adopt.html';
    } else {
        // Coming from root folder
        window.location.href = 'pages/adopt.html';
    }
}

/**
 * Proceed to checkout
 * Called by "Finish Adoption" button
 */
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your Cradle is empty. Please add creatures before proceeding.');
        return;
    }
    
    // Store cart data in session/local storage for checkout page
    sessionStorage.setItem('mythosCart', JSON.stringify(cart));
    
    // Navigate to checkout page (you'll need to create this)
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        window.location.href = '../pages/checkout.html';
    } else {
        window.location.href = 'pages/checkout.html';
    }
}

/**
 * Close modal when clicking outside the content
 */
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("cartModal");
    
    if (modal) {
        // Close when clicking on the modal background
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeCart();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeCart();
            }
        });
    }
    
    // Initialize cart display
    updateCart();
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);