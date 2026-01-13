// Product Database
const products = [
    {
        id: 1,
        name: "Osmoseur 5 Étapes Premium",
        type: "osmoseur",
        price: 2500,
        location: ["casablanca", "rabat", "marrakech"],
        waterColor: "blanc",
        description: "Système d'osmose inverse 5 étapes pour une eau ultra pure",
        icon: "💧"
    },
    {
        id: 2,
        name: "Osmoseur 7 Étapes Alcalin",
        type: "osmoseur",
        price: 3200,
        location: ["casablanca", "rabat", "fes", "tanger"],
        waterColor: "blanc",
        description: "Osmoseur avancé avec minéralisation alcaline",
        icon: "💎"
    },
    {
        id: 3,
        name: "Filtre à Eau 3 Étapes",
        type: "filtre",
        price: 1200,
        location: ["marrakech", "agadir", "fes"],
        waterColor: "blanc",
        description: "Filtre à eau compact pour éliminer chlore et sédiments",
        icon: "🚰"
    },
    {
        id: 4,
        name: "Filtre Anti-Calcaire",
        type: "filtre",
        price: 1500,
        location: ["casablanca", "rabat", "tanger"],
        waterColor: "blanc",
        description: "Protection contre le calcaire et dépôts minéraux",
        icon: "🛡️"
    },
    {
        id: 5,
        name: "Cartouche Sédiment 5 Microns",
        type: "cartouche",
        price: 80,
        location: ["tous"],
        waterColor: "couleur",
        description: "Cartouche de préfiltration pour eau trouble ou colorée",
        icon: "🔧"
    },
    {
        id: 6,
        name: "Cartouche Charbon Actif",
        type: "cartouche",
        price: 120,
        location: ["tous"],
        waterColor: "blanc",
        description: "Élimine goûts, odeurs et chlore",
        icon: "⚙️"
    },
    {
        id: 7,
        name: "Membrane Osmose 75 GPD",
        type: "cartouche",
        price: 350,
        location: ["casablanca", "rabat", "marrakech", "fes"],
        waterColor: "blanc",
        description: "Membrane haute performance pour osmoseur",
        icon: "🎯"
    },
    {
        id: 8,
        name: "Kit de Nettoyage Complet",
        type: "accessoire",
        price: 200,
        location: ["tous"],
        waterColor: "blanc",
        description: "Kit d'entretien pour systèmes de filtration",
        icon: "🧰"
    },
    {
        id: 9,
        name: "Robinet Designer Chrome",
        type: "accessoire",
        price: 180,
        location: ["casablanca", "rabat", "marrakech"],
        waterColor: "blanc",
        description: "Robinet élégant pour eau filtrée",
        icon: "🚿"
    },
    {
        id: 10,
        name: "Filtre Spécial Eau Colorée",
        type: "filtre",
        price: 1800,
        location: ["fes", "marrakech", "agadir"],
        waterColor: "couleur",
        description: "Solution pour eau trouble, jaune ou brune",
        icon: "🌊"
    },
    {
        id: 11,
        name: "Osmoseur Compact Sous-Évier",
        type: "osmoseur",
        price: 2800,
        location: ["casablanca", "rabat", "tanger"],
        waterColor: "blanc",
        description: "Design compact pour petits espaces",
        icon: "📦"
    },
    {
        id: 12,
        name: "Préfiltre Anti-Impuretés",
        type: "filtre",
        price: 900,
        location: ["tous"],
        waterColor: "couleur",
        description: "Premier niveau de filtration pour eau chargée",
        icon: "🔍"
    }
];

// Shopping Cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupFilters();
    setupCartLink();
    loadCartFromStorage();
});

// Display products
function displayProducts(productsToShow) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.type = product.type;
    card.dataset.waterColor = product.waterColor;
    
    const locationText = product.location.includes('tous') 
        ? 'Tout le Maroc' 
        : product.location.map(loc => capitalize(loc)).join(', ');
    
    const waterColorText = product.waterColor === 'blanc' 
        ? 'Eau Claire/Blanche' 
        : 'Eau Colorée/Trouble';
    
    card.innerHTML = `
        <div class="product-image">${product.icon}</div>
        <h3>${product.name}</h3>
        <span class="product-type">${capitalize(product.type)}</span>
        <p class="product-location">📍 ${locationText}</p>
        <p class="product-description">${product.description}</p>
        <div class="product-water-color">
            Type d'eau:
            <span class="water-indicator ${product.waterColor}"></span>
            ${waterColorText}
        </div>
        <div class="product-price">${product.price} MAD</div>
        <button class="btn-add-cart" onclick="addToCart(${product.id})">
            Ajouter au Panier
        </button>
    `;
    
    return card;
}

// Setup filters
function setupFilters() {
    const typeFilter = document.getElementById('type-filter');
    const colorFilter = document.getElementById('color-filter');
    const locationFilter = document.getElementById('location-filter');
    
    [typeFilter, colorFilter, locationFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

// Apply filters
function applyFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const colorFilter = document.getElementById('color-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    
    let filteredProducts = products.filter(product => {
        const typeMatch = typeFilter === 'tous' || product.type === typeFilter;
        const colorMatch = colorFilter === 'tous' || product.waterColor === colorFilter;
        const locationMatch = locationFilter === 'tous' || 
                              product.location.includes('tous') || 
                              product.location.includes(locationFilter);
        
        return typeMatch && colorMatch && locationMatch;
    });
    
    displayProducts(filteredProducts);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    saveCartToStorage();
    showNotification(`${product.name} ajouté au panier!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Votre panier est vide</p>';
        cartTotalElement.textContent = '0';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantité: ${item.quantity}</p>
                </div>
                <div class="cart-item-price">${item.price * item.quantity} MAD</div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">Retirer</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total;
    }
}

// Setup cart link
function setupCartLink() {
    const cartLink = document.querySelector('.cart-link');
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        const cartSection = document.getElementById('panier-details');
        const isHidden = cartSection.style.display === 'none' || cartSection.style.display === '';
        cartSection.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            cartSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    const checkoutBtn = document.querySelector('.btn-checkout');
    checkoutBtn.addEventListener('click', checkout);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemText = itemCount > 1 ? 'articles' : 'article';
    
    // Show success notification
    showNotification(`✅ Commande confirmée! Total: ${total} MAD (${itemCount} ${itemText}). Nous vous contactons bientôt!`);
    
    // Clear cart after a brief delay to allow user to see the notification
    setTimeout(() => {
        cart = [];
        updateCart();
        saveCartToStorage();
        // Hide cart section
        const cartSection = document.getElementById('panier-details');
        cartSection.style.display = 'none';
    }, 2000);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Longer display time for longer messages
    const displayTime = message.length > 50 ? 3500 : 2000;
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, displayTime);
}

// Storage functions
function saveCartToStorage() {
    localStorage.setItem('eaudumaroc-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('eaudumaroc-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Utility functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add CSS animations
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
