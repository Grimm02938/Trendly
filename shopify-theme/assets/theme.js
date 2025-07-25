// Trendly Theme JavaScript

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
});

// Theme initialization
function initializeTheme() {
  console.log('Trendly theme initialized');
  
  // Initialize dark mode
  initializeDarkMode();
  
  // Initialize mobile menu
  initializeMobileMenu();
  
  // Initialize search functionality
  initializeSearch();
  
  // Initialize cart functionality
  initializeCart();
  
  // Initialize product functionality
  initializeProducts();
}

// Dark mode functionality
function initializeDarkMode() {
  const darkModeToggle = document.querySelector('.theme-toggle');
  if (!darkModeToggle) return;
  
  // Check for saved theme preference or default to 'dark' mode
  const currentTheme = localStorage.getItem('trendly-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    updateThemeToggleIcon(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateThemeToggleIcon(false);
  }
  
  // Toggle theme on button click
  darkModeToggle.addEventListener('click', function() {
    const isDark = document.body.classList.contains('dark-mode');
    
    if (isDark) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('trendly-theme', 'light');
      updateThemeToggleIcon(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('trendly-theme', 'dark');
      updateThemeToggleIcon(true);
    }
  });
}

// Update theme toggle icon
function updateThemeToggleIcon(isDark) {
  const lightIcon = document.querySelector('.theme-icon-light');
  const darkIcon = document.querySelector('.theme-icon-dark');
  
  if (lightIcon && darkIcon) {
    if (isDark) {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    } else {
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    }
  }
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu .rounded-lg');
  
  if (!mobileMenuToggle || !mobileMenu || !mobileMenuOverlay) return;
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const isOpen = !mobileMenu.classList.contains('-translate-x-full');
    
    if (isOpen) {
      // Close menu
      mobileMenu.classList.add('-translate-x-full');
      mobileMenu.classList.remove('translate-x-0');
      mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
      mobileMenuOverlay.classList.remove('opacity-100');
      document.body.style.overflow = '';
    } else {
      // Open menu
      mobileMenu.classList.remove('-translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
      mobileMenuOverlay.classList.add('opacity-100');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Event listeners
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', toggleMobileMenu);
  }
  
  // Make toggleMobileMenu globally available for inline onclick
  window.toggleMobileMenu = toggleMobileMenu;
}

// Search functionality
function initializeSearch() {
  const searchForms = document.querySelectorAll('.search-form, .mobile-search-form');
  
  searchForms.forEach(form => {
    const input = form.querySelector('input[type="search"]');
    
    if (input) {
      // Add search suggestions (if needed)
      input.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length > 2) {
          // Here you could implement search suggestions
          // For now, we'll just add some visual feedback
          this.style.borderColor = '#f43f5e';
        } else {
          this.style.borderColor = '';
        }
      });
      
      // Clear search styling on focus out
      input.addEventListener('blur', function() {
        this.style.borderColor = '';
      });
    }
  });
}

// Cart functionality
function initializeCart() {
  // Add to cart forms
  const addToCartForms = document.querySelectorAll('.add-to-cart-form, .product-form');
  
  addToCartForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Don't prevent default - let Shopify handle the form submission
      const button = form.querySelector('.add-to-cart-btn, button[type="submit"]');
      
      if (button && !button.disabled) {
        const originalText = button.textContent;
        
        // Show loading state
        button.textContent = 'Adding...';
        button.disabled = true;
        
        // Reset button after a delay (in case AJAX fails)
        setTimeout(() => {
          if (button.textContent === 'Adding...') {
            button.textContent = originalText;
            button.disabled = false;
          }
        }, 5000);
      }
    });
  });
  
  // Update cart count if cart drawer/page updates
  updateCartCount();
}

// Update cart count in header
function updateCartCount() {
  // This would typically be handled by Shopify's cart.js
  // For now, we'll just ensure the cart count is visible if > 0
  const cartCounts = document.querySelectorAll('.cart-link span');
  cartCounts.forEach(count => {
    const itemCount = parseInt(count.textContent) || 0;
    if (itemCount > 0) {
      count.style.display = 'flex';
    } else {
      count.style.display = 'none';
    }
  });
}

// Product functionality
function initializeProducts() {
  // Product image gallery
  initializeProductGallery();
  
  // Variant selection
  initializeVariantSelection();
  
  // Quantity controls
  initializeQuantityControls();
}

// Product image gallery
function initializeProductGallery() {
  const thumbnails = document.querySelectorAll('[onclick*="changeMainImage"]');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Remove active state from all thumbnails
      thumbnails.forEach(t => {
        t.classList.remove('border-rose-500');
        t.classList.add('border-transparent');
      });
      
      // Add active state to clicked thumbnail
      this.classList.remove('border-transparent');
      this.classList.add('border-rose-500');
    });
  });
}

// Variant selection
function initializeVariantSelection() {
  const variantInputs = document.querySelectorAll('.variant-input');
  const variantSelects = document.querySelectorAll('.variant-select');
  
  // Handle radio button variants (like size, color)
  variantInputs.forEach(input => {
    input.addEventListener('change', function() {
      const labels = document.querySelectorAll(`label[for^="${this.name.replace(/[\[\]]/g, '').replace('options', 'option')}"]`);
      
      // Update visual state of all labels for this option
      labels.forEach(label => {
        label.classList.remove('border-rose-500', 'bg-rose-500', 'text-white');
        label.classList.add('border-gray-300');
      });
      
      // Highlight selected label
      const selectedLabel = document.querySelector(`label[for="${this.id}"]`);
      if (selectedLabel) {
        selectedLabel.classList.remove('border-gray-300');
        selectedLabel.classList.add('border-rose-500', 'bg-rose-500', 'text-white');
      }
      
      updateProductVariant();
    });
  });
  
  // Handle select dropdowns
  variantSelects.forEach(select => {
    select.addEventListener('change', updateProductVariant);
  });
  
  // Initialize first variant
  const firstVariantInput = document.querySelector('.variant-input:checked');
  if (firstVariantInput) {
    const event = new Event('change');
    firstVariantInput.dispatchEvent(event);
  }
}

// Update product variant (simplified - real implementation would use Shopify's variant JS)
function updateProductVariant() {
  // In a real Shopify theme, this would:
  // 1. Find the matching variant based on selected options
  // 2. Update the price display
  // 3. Update the variant ID in the form
  // 4. Update availability
  // 5. Update the URL
  
  console.log('Variant updated - implement Shopify variant selection logic here');
}

// Quantity controls
function initializeQuantityControls() {
  const quantityInputs = document.querySelectorAll('#quantity, input[name="quantity"]');
  
  quantityInputs.forEach(input => {
    const decreaseBtn = document.querySelector('[onclick*="changeQuantity(-1)"]');
    const increaseBtn = document.querySelector('[onclick*="changeQuantity(1)"]');
    
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      });
    }
    
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const currentValue = parseInt(input.value) || 1;
        input.value = currentValue + 1;
      });
    }
    
    // Validate quantity input
    input.addEventListener('change', function() {
      const value = parseInt(this.value);
      if (isNaN(value) || value < 1) {
        this.value = 1;
      }
    });
  });
  
  // Make changeQuantity globally available for inline onclick
  window.changeQuantity = function(delta) {
    const quantityInput = document.querySelector('#quantity, input[name="quantity"]');
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value) || 1;
      const newValue = Math.max(1, currentValue + delta);
      quantityInput.value = newValue;
    }
  };
}

// Make changeMainImage globally available for inline onclick
window.changeMainImage = function(src) {
  const mainImage = document.getElementById('main-product-image');
  if (mainImage) {
    mainImage.src = src;
  }
};

// Utility function for URL parameters (used in collection sorting)
window.updateUrlParameter = function(url, param, paramVal) {
  var newAdditionalURL = "";
  var tempArray = url.split("?");
  var baseURL = tempArray[0];
  var additionalURL = tempArray[1];
  var temp = "";
  
  if (additionalURL) {
    tempArray = additionalURL.split("&");
    for (var i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split('=')[0] != param) {
        newAdditionalURL += temp + tempArray[i];
        temp = "&";
      }
    }
  }
  
  var rows_txt = temp + "" + param + "=" + paramVal;
  return baseURL + "?" + newAdditionalURL + rows_txt;
};

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Lazy loading for images (if not handled by browser)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Performance: Debounce function for search and other inputs
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Newsletter form handling (if you want to add AJAX submission)
function initializeNewsletter() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Add your newsletter subscription logic here
      // This could integrate with Shopify's customer forms or email marketing apps
      console.log('Newsletter form submitted');
    });
  });
}

// Initialize newsletter after DOM load
document.addEventListener('DOMContentLoaded', initializeNewsletter);

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    // Close mobile menu on desktop resize
    if (window.innerWidth >= 768) {
      const mobileMenu = document.querySelector('.mobile-menu');
      const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
      
      if (mobileMenu && !mobileMenu.classList.contains('-translate-x-full')) {
        mobileMenu.classList.add('-translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        if (mobileMenuOverlay) {
          mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
          mobileMenuOverlay.classList.remove('opacity-100');
        }
        document.body.style.overflow = '';
      }
    }
  }, 250);
});

// Error handling
window.addEventListener('error', function(e) {
  console.error('Trendly theme error:', e.error);
});

// AJAX cart functionality (if using Shopify's cart.js)
if (typeof window.Shopify !== 'undefined' && window.Shopify.routes) {
  // Add to cart via AJAX
  window.addToCartAjax = function(formData, button) {
    return fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Success
      if (button) {
        button.textContent = 'Added!';
        button.style.background = 'linear-gradient(to right, #10b981, #059669)';
        
        setTimeout(() => {
          button.textContent = button.dataset.originalText || 'Add to Cart';
          button.style.background = '';
          button.disabled = false;
        }, 2000);
      }
      
      // Update cart count
      return fetch(window.Shopify.routes.root + 'cart.js');
    })
    .then(response => response.json())
    .then(cart => {
      updateCartCount();
      return cart;
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      if (button) {
        button.textContent = 'Error';
        button.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
        
        setTimeout(() => {
          button.textContent = button.dataset.originalText || 'Add to Cart';
          button.style.background = '';
          button.disabled = false;
        }, 2000);
      }
    });
  };
}

console.log('Trendly theme JavaScript loaded successfully');