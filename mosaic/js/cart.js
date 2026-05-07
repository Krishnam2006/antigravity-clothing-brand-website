document.addEventListener('DOMContentLoaded', () => {
    // State
    let cart = JSON.parse(localStorage.getItem('mosaicCart')) || [];
    
    // Elements
    const cartCount = document.getElementById('cart-count');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total-price');
    const toast = document.getElementById('toast');

    // Toggle Size Selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const siblings = e.target.parentElement.querySelectorAll('.size-btn');
            siblings.forEach(s => s.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });

    // Add to Cart
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.dataset.id;
            const name = card.querySelector('.product-name').innerText;
            const priceText = card.querySelector('.product-price').innerText;
            const price = parseInt(priceText.replace('₹', '').replace(',', ''));
            const image = card.querySelector('.product-img').src;
            
            const selectedSizeBtn = card.querySelector('.size-btn.selected');
            if (!selectedSizeBtn) {
                showToast('Please select a size first!');
                return;
            }
            const size = selectedSizeBtn.dataset.size;

            cart.push({ id: id + '-' + size + '-' + Date.now(), name, price, image, size });
            saveCart();
            updateCartUI();
            showToast(`${name} added to cart!`);
            
            // Open cart
            cartOverlay.classList.add('open');
        });
    });

    // Toggle Cart Overlay
    if (document.getElementById('cart-icon')) {
        document.getElementById('cart-icon').addEventListener('click', () => {
            cartOverlay.classList.add('open');
        });
    }

    if (document.getElementById('close-cart')) {
        document.getElementById('close-cart').addEventListener('click', () => {
            cartOverlay.classList.remove('open');
        });
    }

    // Checkout redirect
    if (document.getElementById('checkout-btn')) {
        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Core Functions
    window.removeFromCart = function(cartId) {
        cart = cart.filter(item => item.id !== cartId);
        saveCart();
        updateCartUI();
    };

    function saveCart() {
        localStorage.setItem('mosaicCart', JSON.stringify(cart));
    }

    function updateCartUI() {
        if (!cartCount) return;
        
        cartCount.innerText = cart.length;
        
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                cart.forEach(item => {
                    total += item.price;
                    const el = document.createElement('div');
                    el.className = 'cart-item';
                    el.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-size">Size: ${item.size}</p>
                            <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</p>
                            <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(el);
                });
            }
            cartTotalEl.innerText = '₹' + total.toLocaleString('en-IN');
        }
    }

    function showToast(msg) {
        if (!toast) return;
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Initialize UI
    updateCartUI();
});
