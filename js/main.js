// Food Delivery System - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initApp();
    
    // Event Listeners
    document.getElementById('loginBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    });
    
    document.getElementById('registerBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        var registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
    });
    
    // Login form submission
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        loginUser();
    });
    
    // Register form submission
    document.getElementById('registerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        registerUser();
    });
    
    // Search functionality
    document.getElementById('searchBtn')?.addEventListener('click', performSearch);
    document.getElementById('searchInput')?.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Clear search button
    document.getElementById('clearSearchBtn')?.addEventListener('click', clearSearch);
    
    // Search suggestions
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            document.getElementById('searchInput').value = this.textContent;
            performSearch();
        });
    });
    
    // Load categories and foods (faqat asosiy sahifada)
    if (document.getElementById('categoriesContainer') || 
        document.getElementById('popularFoodsContainer') || 
        document.getElementById('allFoodsContainer')) {
        loadCategories();
        loadPopularFoods();
        loadAllFoods();
    }
});

// Initialize the application
function initApp() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        updateUserUI(user);
    }
    
    // Initialize cart
    updateCartCount();
}

// Login user
function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        showAlert('Iltimos, barcha maydonlarni to\'ldiring', 'danger');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        updateUserUI(user);
        
        // Show success message and close modal
        showAlert('Muvaffaqiyatli tizimga kirildi!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        
        // Clear form
        document.getElementById('loginForm').reset();
    } else {
        showAlert('Elektron pochta yoki parol noto\'g\'ri', 'danger');
    }
}

// Register user
function registerUser() {
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showAlert('Iltimos, barcha maydonlarni to\'ldiring', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Parollar mos kelmayapti', 'danger');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showAlert('Bu elektron pochta bilan ro\'yxatdan o\'tilgan', 'danger');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        phone,
        address,
        password,
        registrationDate: new Date().toISOString(),
        orders: []
    };
    
    // Save to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Update UI
    updateUserUI(newUser);
    
    // Show success message and close modal
    showAlert('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    
    // Clear form
    document.getElementById('registerForm').reset();
}

// Update UI based on user login status
function updateUserUI(user) {
    const profileDropdown = document.querySelector('.nav-link.dropdown-toggle');
    if (profileDropdown) {
        profileDropdown.innerHTML = `<i class="fas fa-user-circle"></i> ${user.firstName}`;
    }
    
    // Update login/logout links
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user me-2"></i>Mening profilim</a></li>
            <li><a class="dropdown-item" href="profile.html#orders"><i class="fas fa-history me-2"></i>Buyurtma tarixi</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Chiqish</a></li>
        `;
        
        // Add logout event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                location.reload();
            });
        }
    }
}

// Show alert message
function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top mt-5 mx-3`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Load categories from database (simulated)
function loadCategories() {
    const categories = [
        {
            id: 1,
            name: "Milliy Taomlar",
            description: "O'zbekistonning an'anaviy taomlari",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            foodCount: 12
        },
        {
            id: 2,
            name: "Fast Food",
            description: "Tez tayyorlanadigan taomlar",
            image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            foodCount: 8
        },
        {
            id: 3,
            name: "Ichimliklar",
            description: "Sovuq va issiq ichimliklar",
            image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            foodCount: 10
        },
        {
            id: 4,
            name: "Shirinliklar",
            description: "An'anaviy va zamonaviy shirinliklar",
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            foodCount: 15
        }
    ];
    
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    
    let html = '';
    categories.forEach(category => {
        html += `
            <div class="col-md-3 col-sm-6">
                <div class="card category-card">
                    <img src="${category.image}" class="card-img-top category-img" alt="${category.name}">
                    <div class="card-body category-body text-center">
                        <h5 class="category-title">${category.name}</h5>
                        <p class="text-muted">${category.description}</p>
                        <span class="badge bg-primary">${category.foodCount} ta taom</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Load popular foods
function loadPopularFoods() {
    const foods = [
        {
            id: 1,
            name: "Osh",
            description: "An'anaviy o'zbek oshi, sabzi, go'sht va guruch bilan",
            price: 35000,
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Milliy Taomlar",
            rating: 4.9,
            isPopular: true
        },
        {
            id: 2,
            name: "Lag'mon",
            description: "Qo'lda yoyilgan xamir, go'sht va sabzavotlar bilan",
            price: 28000,
            image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Milliy Taomlar",
            rating: 4.7,
            isPopular: true
        },
        // {
        //     id: 3,
        //     name: "Somsa",
        //     description: "Yumshoq xamir, go'sht va piyoz bilan tayyorlangan",
        //     price: 8000,
        //     image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        //     category: "Milliy Taomlar",
        //     rating: 4.8,
        //     isPopular: true
        // },
        {
            id: 4,
            name: "Manti",
            description: "Bug'doy xamiri, go'sht va piyoz bilan",
            price: 25000,
            image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "Milliy Taomlar",
            rating: 4.6,
            isPopular: true
        },
        {
            id: 5,
            name: "Shashlik",
            description: "Molly go'shtdan tayyorlangan, barbekyu sousi bilan",
            price: 20000,
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "Milliy Taomlar",
            rating: 4.9,
            isPopular: true
        },
        {
            id: 6,
            name: "Chuchvara",
            description: "Mayda chuchvara, qatiq va ziravorlar bilan",
            price: 22000,
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Milliy Taomlar",
            rating: 4.5,
            isPopular: true
        }
    ];
    
    const container = document.getElementById('popularFoodsContainer');
    if (!container) return;
    
    let html = '';
    foods.forEach(food => {
        html += createFoodCard(food);
    });
    
    container.innerHTML = html;
    
    // Add event listeners to "Add to cart" buttons
    addCartEventListeners();
}

// Load all foods
function loadAllFoods() {
    const allFoods = [
        {
            id: 1,
            name: "Osh",
            description: "An'anaviy o'zbek oshi, sabzi, go'sht va guruch bilan",
            price: 35000,
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Milliy Taomlar",
            rating: 4.9
        },
        {
            id: 2,
            name: "Lag'mon",
            description: "Qo'lda yoyilgan xamir, go'sht va sabzavotlar bilan",
            price: 28000,
            image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Milliy Taomlar",
            rating: 4.7
        },
        // {
        //     id: 3,
        //     name: "Somsa",
        //     description: "Yumshoq xamir, go'sht va piyoz bilan tayyorlangan",
        //     price: 8000,
        //     image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        //     category: "Milliy Taomlar",
        //     rating: 4.8
        // },
        {
            id: 4,
            name: "Manti",
            description: "Bug'doy xamiri, go'sht va piyoz bilan",
            price: 25000,
            image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "Milliy Taomlar",
            rating: 4.6
        },
        {
            id: 5,
            name: "Shashlik",
            description: "Molly go'shtdan tayyorlangan, barbekyu sousi bilan",
            price: 20000,
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            category: "Milliy Taomlar",
            rating: 4.9
        },
        {
            id: 6,
            name: "Chuchvara",
            description: "Mayda chuchvara, qatiq va ziravorlar bilan",
            price: 22000,
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Milliy Taomlar",
            rating: 4.5
        },
        {
            id: 7,
            name: "Burger",
            description: "Molly kotlet, pomidor, salat va maxsus sous bilan",
            price: 25000,
            image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Fast Food",
            rating: 4.4
        },
        {
            id: 8,
            name: "Pizza",
            description: "Yupqa qobiq, pishloq, go'sht va sabzavotlar bilan",
            price: 60000,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Fast Food",
            rating: 4.6
        },
        {
            id: 9,
            name: "Coca-Cola",
            description: "1.5L sovuq Coca-Cola",
            price: 10000,
            image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Ichimliklar",
            rating: 4.3
        },
        {
            id: 10,
            name: "Choy",
            description: "Yashil yoki qora choy",
            price: 3000,
            image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Ichimliklar",
            rating: 4.7
        },
        {
            id: 11,
            name: "Halva",
            description: "An'anaviy shirinlik, yog' va un bilan",
            price: 15000,
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Shirinliklar",
            rating: 4.8
        },
        {
            id: 12,
            name: "Napalyon",
            description: "Qatlamli tort, krem bilan",
            price: 40000,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Shirinliklar",
            rating: 4.9
        }
    ];
    
    const container = document.getElementById('allFoodsContainer');
    if (!container) return;
    
    let html = '';
    allFoods.forEach(food => {
        html += createFoodCard(food);
    });
    
    container.innerHTML = html;
    
    // Add event listeners to "Add to cart" buttons
    addCartEventListeners();
}

// Create food card HTML
function createFoodCard(food) {
    return `
        <div class="col-lg-4 col-md-6" data-category="${food.category}">
            <div class="card food-card">
                <div class="position-relative">
                    <img src="${food.image}" class="card-img-top food-img" alt="${food.name}">
                    ${food.isPopular ? '<span class="badge-custom position-absolute top-0 end-0 m-3">Mashhur</span>' : ''}
                </div>
                <div class="card-body food-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="food-title">${food.name}</h5>
                        <span class="food-price">${food.price.toLocaleString()} so'm</span>
                    </div>
                    <p class="food-description">${food.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="food-rating">
                                <i class="fas fa-star"></i> ${food.rating}
                            </span>
                            <span class="badge bg-secondary ms-2">${food.category}</span>
                        </div>
                        <button class="btn btn-primary btn-sm add-to-cart" data-food-id="${food.id}">
                            <i class="fas fa-cart-plus me-1"></i> Savatchaga
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to "Add to cart" buttons
function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-food-id'));
            addToCart(foodId);
        });
    });
}

// Add item to cart
function addToCart(foodId) {
    // Get food details
    const allFoods = [
        {id: 1, name: "Osh", price: 35000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 2, name: "Lag'mon", price: 28000, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 3, name: "Somsa", price: 8000, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 4, name: "Manti", price: 25000, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 5, name: "Shashlik", price: 20000, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"},
        {id: 6, name: "Chuchvara", price: 22000, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 7, name: "Burger", price: 25000, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 8, name: "Pizza", price: 60000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 9, name: "Coca-Cola", price: 10000, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 10, name: "Choy", price: 3000, image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 11, name: "Halva", price: 15000, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
        {id: 12, name: "Napalyon", price: 40000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
    ];
    
    const food = allFoods.find(f => f.id === foodId);
    if (!food) return;
    
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === foodId);
    
    if (existingItemIndex > -1) {
        // Increment quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showAlert(`"${food.name}" savatchaga qo'shildi`, 'success');
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    // Update cart display if cart offcanvas is open
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (!searchTerm) {
        showAlert('Iltimos, qidiruv so\'zini kiriting', 'warning');
        return;
    }
    
    // Hide all sections except search results
    document.getElementById('categories')?.classList.add('d-none');
    document.getElementById('popular')?.classList.add('d-none');
    document.getElementById('allFoods')?.classList.add('d-none');
    document.getElementById('searchResults')?.classList.remove('d-none');
    
    // Get all foods
    const allFoods = document.querySelectorAll('#allFoodsContainer .col-lg-4');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    
    let resultsHTML = '';
    let resultCount = 0;
    
    allFoods.forEach(foodCard => {
        const foodName = foodCard.querySelector('.food-title').textContent.toLowerCase();
        const foodDescription = foodCard.querySelector('.food-description').textContent.toLowerCase();
        const foodCategory = foodCard.getAttribute('data-category').toLowerCase();
        
        if (foodName.includes(searchTerm) || foodDescription.includes(searchTerm) || foodCategory.includes(searchTerm)) {
            resultsHTML += foodCard.outerHTML;
            resultCount++;
        }
    });
    
    if (resultCount > 0) {
        searchResultsContainer.innerHTML = resultsHTML;
        // Re-add event listeners to new buttons
        addCartEventListeners();
    } else {
        searchResultsContainer.innerHTML = `
            <div class="col-12 text-center">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">"${searchTerm}" bo'yicha hech narsa topilmadi</h4>
                <p>Boshqa so'z bilan qidirib ko'ring</p>
            </div>
        `;
    }
    
    // Scroll to search results
    document.getElementById('searchResults')?.scrollIntoView({ behavior: 'smooth' });
}

// Clear search results
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categories')?.classList.remove('d-none');
    document.getElementById('popular')?.classList.remove('d-none');
    document.getElementById('allFoods')?.classList.remove('d-none');
    document.getElementById('searchResults')?.classList.add('d-none');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}