const API_KEY = '6177405fb1f843809a9a7b03987edd21';
        
// DOM Elements
const storeButton = document.getElementById('store-button');
const storeModal = document.getElementById('store-modal');
const modalClose = document.getElementById('modal-close');
const backdrop = document.getElementById('backdrop');
const cartButton = document.getElementById('cart-button');
const cartDrawer = document.getElementById('cart-drawer');
const cartClose = document.getElementById('cart-close');
const modelsGrid = document.getElementById('models-grid');
const modalModelsContainer = document.getElementById('modal-models-container');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const cartItems = document.getElementById('cart-items');
const categories = document.querySelectorAll('.category');

const viewerModal = document.getElementById('viewer-modal');
const viewerClose = document.getElementById('viewer-close');
const viewerContainer = document.getElementById('sketchfab-viewer');
const modalSort = document.querySelector('.modal-sort');

// State
let models = [];
let cart = [];
let currentCategory = 'All';
let currentPage = 1;
let isLoading = false;
let viewer = null;

// Event Listeners
storeButton.addEventListener('click', openStoreModal);
modalClose.addEventListener('click', closeStoreModal);
backdrop.addEventListener('click', () => {
    closeStoreModal();
    closeCartDrawer();
});
cartButton.addEventListener('click', openCartDrawer);
cartClose.addEventListener('click', closeCartDrawer);

// Add event listeners for categories
categories.forEach(category => {
    category.addEventListener('click', () => {
        // Remove active class from all categories
        categories.forEach(cat => cat.classList.remove('active'));
        // Add active class to clicked category
        category.classList.add('active');
        // Update current category
        currentCategory = category.textContent;
        // Fetch models for the selected category
        fetchModels();
    });
});

viewerClose.addEventListener('click', closeViewerModal);
modalSort.addEventListener('change', fetchModalModels);

// Functions
function openStoreModal() {
    storeModal.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    fetchModalModels();
}

function closeStoreModal() {
    storeModal.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

function closeViewerModal() {
    viewerModal.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (viewer) {
        viewer.stop();
        viewer = null;
    }
}

function openCartDrawer() {
    cartDrawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCartDisplay();
}

function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.remove('error');
    
    if (isError) {
        toast.classList.add('error');
    }
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

async function fetchModels() {
    if (isLoading) return;
    
    isLoading = true;
    modelsGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
    
    try {
        let apiUrl = `https://api.sketchfab.com/v3/models?sort_by=-likeCount&count=12&cursor=${(currentPage - 1) * 12}`;
        
        if (currentCategory === 'Free') {
            apiUrl += '&isFree=true';
        } else if (currentCategory !== 'All') {
            apiUrl += `&categories=${currentCategory.toLowerCase()}`;
        }
        
        const response = await fetch(apiUrl, {
            headers: { 'Authorization': `Token ${API_KEY}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch models');
        
        const data = await response.json();
        models = data.results;
        renderModels(models, modelsGrid);
    } catch (error) {
        console.error('Error fetching models:', error);
        modelsGrid.innerHTML = `<div style="text-align: center; color: var(--text-muted);">Failed to load models. Please try again later.</div>`;
    }
    
    isLoading = false;
}

async function fetchModalModels() {
    try {
        let apiUrl = `https://api.sketchfab.com/v3/models?count=20`;
        
        switch(modalSort.value) {
            case 'popular': apiUrl += '&sort_by=-likeCount'; break;
            case 'newest': apiUrl += '&sort_by=-createdAt'; break;
            case 'price-low': apiUrl += '&sort_by=price&isFree=true'; break;
            case 'price-high': apiUrl += '&sort_by=-price'; break;
            case 'free': apiUrl += '&isFree=true'; break;
        }
        
        const response = await fetch(apiUrl, {
            headers: { 'Authorization': `Token ${API_KEY}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch modal models');
        
        const data = await response.json();
        renderModels(data.results, modalModelsContainer);
    } catch (error) {
        console.error('Error fetching modal models:', error);
        modalModelsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted);">Failed to load models. Please try again later.</div>`;
    }
}

function renderModels(models, container) {
    if (!models || models.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted);">No models found for this category.</div>`;
        return;
    }
    
    let html = '';
    
    models.forEach(model => {
        // Generate a random price between $10 and $100
        const isFree = model.isFree || Math.random() > 0.7; // Simulate some free models
        const price = isFree ? 'Free' : '$' + (Math.random() * 90 + 10).toFixed(2);
        const thumbnail = model.thumbnails.images.find(img => img.width === 200) || model.thumbnails.images[0];
        
        html += `
        <div class="model-card" data-id="${model.uid}">
            <div class="model-image">
                <img src="${thumbnail.url}" alt="${model.name}">
                <div class="model-price ${isFree ? 'free' : ''}">${price}</div>
                <div class="model-overlay">
                    <button class="view-btn view-model-btn" data-model-id="${model.uid}">View in 3D</button>
                </div>
            </div>
            <div class="model-info">
                <div class="model-name">${model.name.length > 20 ? model.name.substring(0, 20) + '...' : model.name}</div>
                <div class="model-creator">by ${model.user.username}</div>
                <div class="model-stats">
                    <span><i class="fas fa-eye"></i> ${formatNumber(model.viewCount)}</span>
                    <span><i class="fas fa-heart"></i> ${formatNumber(model.likeCount)}</span>
                </div>
                <div class="model-actions">
                    <button class="add-to-cart" onclick="addToCart('${model.uid}', '${model.name}', '${thumbnail.url}', '${price}')">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                    <button class="wishlist-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    });
    
    container.innerHTML = html;
    
    // Add event listeners for wishlist buttons
    const wishlistButtons = container.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showToast('Added to wishlist');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showToast('Removed from wishlist');
            }
        });
    });
}

function openModelViewer(modelId) {
    viewerModal.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (viewer) {
        viewer.stop();
    }
    
    viewer = new Sketchfab(viewerContainer);
    viewer.init(modelId, {
        autostart: 1,
        preload: 1,
        ui_stop: 0,
        ui_infos: 1,
        ui_controls: 1,
        onsuccess: () => console.log('Viewer loaded successfully'),
        onerror: () => {
            console.error('Viewer failed to load');
            showToast('Failed to load 3D viewer', true);
        }
    });
}

function addToCart(id, name, image, price) {
    // Check if the item is already in the cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            image,
            price,
            quantity: 1
        });
    }
    
    // Update cart count
    updateCartCount();
    
    // Show toast notification
    showToast('Added to cart');
    
    // Update cart display if it's open
    if (cartDrawer.classList.contains('active')) {
        updateCartDisplay();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    
    // Update cart count
    updateCartCount();
    
    // Update cart display
    updateCartDisplay();
    
    // Show toast notification
    showToast('Removed from cart');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="cart-continue">Continue Shopping</button>
            </div>
        `;
        
        // Add event listener for continue shopping button
        const continueBtn = cartItems.querySelector('.cart-continue');
        continueBtn.addEventListener('click', closeCartDrawer);
        
        // Update total
        document.querySelector('.cart-total').innerHTML = `
            <span>Total:</span>
            <span>$0.00</span>
        `;
        
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}</div>
                    <div class="cart-item-price">$${item.price} × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    
    // Update total
    document.querySelector('.cart-total').innerHTML = `
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
    `;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

function viewModel(id) {
    // In a real application, this would navigate to a model detail page
    // For this demo, we'll just show an alert
    showToast(`Viewing model ${id}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchModels();
    window.viewModel = viewModel;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    
    // Add listener for featured model viewer
    document.querySelector('.featured-model .view-model-btn')
        .addEventListener('click', () => openModelViewer('default-model-id'));
});