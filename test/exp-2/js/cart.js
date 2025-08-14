// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
let appliedCoupon = null;

// Constants for tax and discounts
const GST_RATE = 0.18; // 18% GST
const COUPONS = {
  'WELCOME10': { type: 'percentage', value: 10 },
  'FLAT100': { type: 'fixed', value: 100 },
  'BOOKS25': { type: 'percentage', value: 25, minPurchase: 500 }
};

// Update cart count badge
function updateCartBadge() {
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = itemCount;
    cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
  }
}

// Add item to cart
function addToCart(bookId) {
  // Find the book in our catalog
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  
  // Check if already in cart
  const existingItem = cart.find(item => item.id === bookId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      quantity: 1
    });
  }
  
  // Save to localStorage
  localStorage.setItem('bookCart', JSON.stringify(cart));
  
  // Update the badge
  updateCartBadge();
  
  // Show notification
  showNotification(`${book.title} added to cart!`);
}

// Remove item from cart
function removeFromCart(bookId) {
  const index = cart.findIndex(item => item.id === bookId);
  if (index !== -1) {
    cart.splice(index, 1);
    localStorage.setItem('bookCart', JSON.stringify(cart));
    updateCartBadge();
    
    // If we're on the cart page, update the display
    if (document.getElementById('cart-items')) {
      renderCart();
    }
  }
}

// Update quantity
function updateQuantity(bookId, newQuantity) {
  const item = cart.find(item => item.id === bookId);
  if (item) {
    if (newQuantity < 1) {
      removeFromCart(bookId);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem('bookCart', JSON.stringify(cart));
      updateCartBadge();
      
      // If we're on the cart page, update the display
      if (document.getElementById('cart-items')) {
        renderCart();
      }
    }
  }
}

// Calculate cart subtotal (before GST and discounts)
function calculateSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculate GST amount
function calculateGST(subtotal) {
  return subtotal * GST_RATE;
}

// Apply coupon and calculate discount
function applyCoupon(code) {
  const coupon = COUPONS[code];
  if (!coupon) {
    showNotification('Invalid coupon code', 'error');
    return 0;
  }
  
  const subtotal = calculateSubtotal();
  
  // Check minimum purchase if specified
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    showNotification(`Minimum purchase of ₹${coupon.minPurchase} required for this coupon`, 'error');
    return 0;
  }
  
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = subtotal * (coupon.value / 100);
  } else if (coupon.type === 'fixed') {
    discount = coupon.value;
  }
  
  appliedCoupon = {
    code: code,
    discount: discount
  };
  
  showNotification(`Coupon applied: ₹${discount.toFixed(2)} discount`, 'success');
  return discount;
}

// Remove applied coupon
function removeCoupon() {
  appliedCoupon = null;
  renderCart();
  showNotification('Coupon removed', 'info');
}

// Calculate cart total with GST and discounts
function calculateTotal() {
  const subtotal = calculateSubtotal();
  const gst = calculateGST(subtotal);
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.discount;
  }
  
  return subtotal + gst - discount;
}

// Show notification with type (success, error, info)
function showNotification(message, type = 'success') {
  const colorClass = {
    'success': 'bg-green-500',
    'error': 'bg-red-500',
    'info': 'bg-blue-500'
  }[type] || 'bg-green-500';
  
  const notification = document.createElement('div');
  notification.className = `fixed bottom-20 right-4 ${colorClass} text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-500 z-50`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 2000);
}

// Open cart popup
function openCartPopup() {
  const cartPopup = document.getElementById('cart-popup');
  if (!cartPopup) {
    // Create cart popup if it doesn't exist
    const popup = document.createElement('div');
    popup.id = 'cart-popup';
    popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    popup.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div class="p-4 border-b flex justify-between items-center bg-blue-800 text-white rounded-t-lg">
          <h2 class="text-xl font-bold">Your Shopping Cart</h2>
          <button onclick="closeCartPopup()" class="text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div id="cart-items" class="p-4 overflow-auto flex-grow">
          <!-- Cart items will be rendered here -->
        </div>
        <div class="p-4 border-t">
          <!-- Coupon code input -->
          <div class="mb-4 flex space-x-2">
            <input type="text" id="coupon-input" placeholder="Enter coupon code" 
              class="border rounded px-2 py-1 flex-grow">
            <button onclick="handleCoupon()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
              Apply
            </button>
          </div>
          
          <!-- Price breakdown -->
          <div class="space-y-2 text-sm mb-4">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span id="cart-subtotal">₹0</span>
            </div>
            <div class="flex justify-between">
              <span>GST (18%):</span>
              <span id="cart-gst">₹0</span>
            </div>
            <div id="discount-row" class="flex justify-between text-green-600" style="display:none">
              <span>Discount:</span>
              <span id="cart-discount">-₹0</span>
            </div>
          </div>
          
          <div class="flex justify-between font-bold text-lg mb-4 pt-2 border-t">
            <span>Total:</span>
            <span id="cart-total">₹0</span>
          </div>
          <div class="flex space-x-2">
            <button onclick="closeCartPopup()" class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-1/2">
              Close
            </button>
            <a href="checkout.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center w-1/2">
              Checkout
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
    renderCart();
  } else {
    cartPopup.style.display = 'flex';
    renderCart();
  }
}

// Handle coupon application or removal
function handleCoupon() {
  const couponInput = document.getElementById('coupon-input');
  
  if (appliedCoupon) {
    // Remove existing coupon
    removeCoupon();
    couponInput.value = '';
    couponInput.placeholder = 'Enter coupon code';
    return;
  }
  
  const code = couponInput.value.trim().toUpperCase();
  if (!code) {
    showNotification('Please enter a coupon code', 'error');
    return;
  }
  
  applyCoupon(code);
  renderCart();
}


// Close cart popup
function closeCartPopup() {
  const cartPopup = document.getElementById('cart-popup');
  if (cartPopup) {
    cartPopup.style.display = 'none';
  }
}

// Render cart items
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartGST = document.getElementById('cart-gst');
  const cartDiscount = document.getElementById('cart-discount');
  const discountRow = document.getElementById('discount-row');
  const cartTotal = document.getElementById('cart-total');
  const couponInput = document.getElementById('coupon-input');
  
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 py-6">Your cart is empty</p>';
    } else {
      cartItemsContainer.innerHTML = '';
      cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center border-b py-2';
        itemElement.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="w-12 h-16 object-cover mr-4">
          <div class="flex-grow">
            <h3 class="font-medium">${item.title}</h3>
            <p class="text-blue-600">₹${item.price}</p>
          </div>
          <div class="flex items-center">
            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="px-2 py-1 bg-gray-200 rounded-l">
              -
            </button>
            <span class="px-3 py-1 bg-gray-100">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="px-2 py-1 bg-gray-200 rounded-r">
              +
            </button>
          </div>
          <button onclick="removeFromCart(${item.id})" class="ml-2 text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        `;
        cartItemsContainer.appendChild(itemElement);
      });
    }
    
    // Update price breakdown
    const subtotal = calculateSubtotal();
    const gst = calculateGST(subtotal);
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal + gst - discount;
    
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    if (cartGST) cartGST.textContent = `₹${gst.toFixed(2)}`;
    
    if (discountRow && cartDiscount) {
      if (appliedCoupon) {
        discountRow.style.display = 'flex';
        cartDiscount.textContent = `-₹${discount.toFixed(2)}`;
        
        if (couponInput) {
          couponInput.value = appliedCoupon.code;
          couponInput.placeholder = 'Remove coupon';
        }
      } else {
        discountRow.style.display = 'none';
      }
    }
    
    if (cartTotal) cartTotal.textContent = `₹${total.toFixed(2)}`;
  }
}

// Add cart button to all pages
document.addEventListener('DOMContentLoaded', function() {
  // Create floating cart button
  const cartButton = document.createElement('div');
  cartButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 z-40';
  cartButton.innerHTML = `
    <span class="text-xl"><i class="fas fa-shopping-cart"></i></span>
    <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">0</span>
  `;
  cartButton.addEventListener('click', openCartPopup);
  document.body.appendChild(cartButton);
  
  // Initialize cart badge
  updateCartBadge();
});