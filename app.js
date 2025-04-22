const wrapper = document.querySelector(".sliderWrapper")
const menuItems = document.querySelectorAll(".menuItem")
    // Add search elements
const searchInput = document.querySelector(".searchInput")
const searchIcon = document.querySelector(".searchIcon")

// Cart elements
const cartIcon = document.querySelector(".cartIcon")
const cartIconContainer = document.querySelector(".cartIconContainer")
const cartItemCount = document.querySelector(".cartItemCount")
const cartSidebar = document.querySelector(".cartSidebar")
const cartClose = document.querySelector(".cartClose")
const cartItems = document.querySelector(".cartItems")
const cartTotal = document.querySelector(".cartTotal")
const checkoutBtn = document.querySelector(".checkoutBtn")

// Zoom elements
const zoomInBtn = document.querySelector(".zoomIn")
const zoomOutBtn = document.querySelector(".zoomOut")
const productImgContainer = document.querySelector(".productImgContainer")
const productImg = document.querySelector(".productImg")
const zoomLens = document.querySelector(".img-zoom-lens")
const zoomResult = document.querySelector(".img-zoom-result")

const products = [{
        id: 1,
        title: "Air Force",
        price: 119,
        colors: [{
                code: "black",
                img: "./img/air.png",
            },
            {
                code: "darkblue",
                img: "./img/air2.png",
            },
        ],
    },
    {
        id: 2,
        title: "Air Jordan",
        price: 149,
        colors: [{
                code: "lightgray",
                img: "./img/jordan.png",
            },
            {
                code: "green",
                img: "./img/jordan2.png",
            },
        ],
    },
    {
        id: 3,
        title: "Blazer",
        price: 109,
        colors: [{
                code: "lightgray",
                img: "./img/blazer.png",
            },
            {
                code: "green",
                img: "./img/blazer2.png",
            },
        ],
    },
    {
        id: 4,
        title: "Crater",
        price: 129,
        colors: [{
                code: "black",
                img: "./img/crater.png",
            },
            {
                code: "lightgray",
                img: "./img/crater2.png",
            },
        ],
    },
    {
        id: 5,
        title: "Hippie",
        price: 99,
        colors: [{
                code: "gray",
                img: "./img/hippie.png",
            },
            {
                code: "black",
                img: "./img/hippie2.png",
            },
        ],
    },
]

let choosenProduct = products[0]
let currentColorIndex = 0
let currentSize = null
let cart = []
let zoomLevel = 1

const currentProductTitle = document.querySelector(".productTitle")
const currentProductPrice = document.querySelector(".productPrice")
const currentProductColors = document.querySelectorAll(".color")
const currentProductSizes = document.querySelectorAll(".size")

// Initialize Flipkart-style zoom functionality
function initFlipkartZoom() {
    if (!productImg || !zoomLens || !zoomResult) return

    // Create result image
    const resultImage = new Image()
    resultImage.crossOrigin = "anonymous" // Avoid CORS issues
    resultImage.src = productImg.src

    // Set up zoom ratio
    let cx, cy

    // Function to calculate zoom ratio
    function calculateZoomRatio() {
        // The ratio of the lens size to the result size
        cx = zoomResult.offsetWidth / zoomLens.offsetWidth
        cy = zoomResult.offsetHeight / zoomLens.offsetHeight

        // Set background properties for the result div
        zoomResult.style.backgroundImage = `url('${productImg.src}')`
        zoomResult.style.backgroundSize = `${productImg.width * cx}px ${productImg.height * cy}px`
    }

    // Wait for the image to load to get proper dimensions
    resultImage.onload = function() {
        calculateZoomRatio()
    }

    // Mouse move handler for the lens
    function moveLens(e) {
        e.preventDefault()

        // Get cursor position
        const pos = getCursorPos(e)

        // Calculate position of the lens
        let x = pos.x - (zoomLens.offsetWidth / 2)
        let y = pos.y - (zoomLens.offsetHeight / 2)

        // Prevent the lens from being positioned outside the image
        if (x > productImg.width - zoomLens.offsetWidth) {
            x = productImg.width - zoomLens.offsetWidth
        }
        if (x < 0) {
            x = 0
        }
        if (y > productImg.height - zoomLens.offsetHeight) {
            y = productImg.height - zoomLens.offsetHeight
        }
        if (y < 0) {
            y = 0
        }

        // Set the position of the lens
        zoomLens.style.left = x + "px"
        zoomLens.style.top = y + "px"

        // Set the position of the large image
        zoomResult.style.backgroundPosition = `-${x * cx}px -${y * cy}px`
    }

    // Get cursor position relative to the image
    function getCursorPos(e) {
        let rect = productImg.getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top

        // Convert to actual coordinates relative to the image
        x = (x / rect.width) * productImg.width
        y = (y / rect.height) * productImg.height

        return { x, y }
    }

    // Add event listeners
    productImg.addEventListener("mousemove", moveLens)
    zoomLens.addEventListener("mousemove", moveLens)

    // Update zoom when image changes
    function updateZoomImage() {
        resultImage.src = productImg.src
        zoomResult.style.backgroundImage = `url('${productImg.src}')`
        calculateZoomRatio()
    }

    // Expose the update function
    window.updateZoomImage = updateZoomImage

    // Handle touch events for mobile
    productImg.addEventListener("touchmove", function(e) {
        e.preventDefault()
        const touch = e.touches[0]
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        })
        moveLens(mouseEvent)
    })

    // Show/hide zoom elements on mouse enter/leave
    productImgContainer.addEventListener("mouseenter", function() {
        zoomLens.style.display = "block"
        zoomResult.style.display = "block"
        calculateZoomRatio() // Recalculate in case of window resize
    })

    productImgContainer.addEventListener("mouseleave", function() {
        zoomLens.style.display = "none"
        zoomResult.style.display = "none"
    })
}

// Initialize zoom functionality (buttons)
function initZoom() {
    if (!productImg || !zoomInBtn || !zoomOutBtn) return

    // Set initial zoom level
    updateZoom()

    // Zoom in button
    zoomInBtn.addEventListener("click", () => {
        if (zoomLevel < 2.5) {
            zoomLevel += 0.5
            updateZoom()
        }
    })

    // Zoom out button
    zoomOutBtn.addEventListener("click", () => {
        if (zoomLevel > 1) {
            zoomLevel -= 0.5
            updateZoom()
        }
    })
}

function updateZoom() {
    productImg.style.transform = `scale(${zoomLevel})`

    // Enable/disable zoom buttons based on current zoom level
    zoomOutBtn.disabled = zoomLevel <= 1
    zoomInBtn.disabled = zoomLevel >= 2.5

    // Update button opacity to indicate state
    zoomOutBtn.style.opacity = zoomLevel <= 1 ? 0.5 : 1
    zoomInBtn.style.opacity = zoomLevel >= 2.5 ? 0.5 : 1
}

// Add search functionality
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase()

    if (searchTerm === "") return

    // Find matching product
    const foundIndex = products.findIndex((product) => product.title.toLowerCase().includes(searchTerm))

    if (foundIndex !== -1) {
        // Update selected product
        choosenProduct = products[foundIndex]
        currentColorIndex = 0
        zoomLevel = 1

        // Change current slide
        wrapper.style.transform = `translateX(${-100 * foundIndex}vw)`

        // Update product display
        updateProductDisplay()

        // Scroll to product section
        document.getElementById("product").scrollIntoView({ behavior: "smooth" })
    } else {
        alert("No products found matching your search.")
    }

    // Clear search input
    searchInput.value = ""
}

// Update product display
function updateProductDisplay() {
    currentProductTitle.textContent = choosenProduct.title
    currentProductPrice.textContent = "$" + choosenProduct.price
    productImg.src = choosenProduct.colors[currentColorIndex].img
    productImg.style.transform = `scale(${zoomLevel})`

    // Update zoom image if function exists
    if (window.updateZoomImage) {
        window.updateZoomImage()
    }

    // Update colors
    currentProductColors.forEach((color, index) => {
        if (index < choosenProduct.colors.length) {
            color.style.backgroundColor = choosenProduct.colors[index].code
            color.style.display = "block"
        } else {
            color.style.display = "none"
        }
    })
}

// Add event listeners for search
if (searchIcon) {
    searchIcon.addEventListener("click", performSearch)
}

if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            performSearch()
        }
    })
}

// Existing menu item functionality
menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        // Only navigate to products that exist
        if (index < products.length) {
            // Change the current slide
            wrapper.style.transform = `translateX(${-100 * index}vw)`

            // Change the chosen product
            choosenProduct = products[index]
            currentColorIndex = 0
            zoomLevel = 1

            // Update product display
            updateProductDisplay()
        }
    })
})

// Color selection
currentProductColors.forEach((color, index) => {
    color.addEventListener("click", () => {
        if (index < choosenProduct.colors.length) {
            currentColorIndex = index
            productImg.src = choosenProduct.colors[index].img

            // Update zoom image if function exists
            if (window.updateZoomImage) {
                setTimeout(window.updateZoomImage, 100) // Small delay to ensure image is loaded
            }
        }
    })
})

// Size selection
currentProductSizes.forEach((size) => {
    size.addEventListener("click", () => {
        currentProductSizes.forEach((s) => {
            s.style.backgroundColor = "white"
            s.style.color = "black"
        })
        size.style.backgroundColor = "black"
        size.style.color = "white"
        currentSize = size.innerText
    })
})

// Cart functionality
function updateCartCount() {
    if (cartItemCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
        cartItemCount.textContent = totalItems
        cartItemCount.style.display = totalItems > 0 ? "flex" : "none"
    }
}

function updateCartDisplay() {
    if (!cartItems) return

    // Clear cart items
    cartItems.innerHTML = ""

    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='emptyCart'>Your cart is empty</p>"
        return
    }

    // Add each item to cart display
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div")
        cartItem.className = "cartItem"
        cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="cartItemImg">
      <div class="cartItemDetails">
        <h3>${item.title}</h3>
        <p>Size: ${item.size}</p>
        <p>Color: ${item.colorName}</p>
        <p>$${item.price} x ${item.quantity}</p>
      </div>
      <div class="cartItemActions">
        <div class="cartItemQuantity">
          <button class="quantityBtn minus" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="quantityBtn plus" data-index="${index}">+</button>
        </div>
        <div class="cartItemButtons">
          <button class="cartItemEdit" data-index="${index}">Edit</button>
          <button class="cartItemRemove" data-index="${index}">Remove</button>
        </div>
      </div>
    `
        cartItems.appendChild(cartItem)
    })

    // Add event listeners to cart item buttons
    document.querySelectorAll(".cartItemRemove").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = Number.parseInt(e.target.dataset.index)
            cart.splice(index, 1)
            updateCartDisplay()
            updateCartCount()
            updateCartTotal()
            saveCart()
        })
    })

    document.querySelectorAll(".cartItemEdit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = Number.parseInt(e.target.dataset.index)
            const item = cart[index]

            // Find the product
            const product = products.find((p) => p.id === item.id)
            if (product) {
                // Find the index in the products array
                const productIndex = products.indexOf(product)

                // Change the current slide
                wrapper.style.transform = `translateX(${-100 * productIndex}vw)`

                // Set the chosen product
                choosenProduct = product
                currentColorIndex = item.colorIndex

                // Update product display
                updateProductDisplay()

                // Select the size
                currentProductSizes.forEach((size) => {
                    if (size.innerText === item.size) {
                        size.click()
                    }
                })

                // Close cart sidebar
                cartSidebar.classList.remove("open")

                // Scroll to product section
                document.getElementById("product").scrollIntoView({ behavior: "smooth" })
            }
        })
    })

    document.querySelectorAll(".quantityBtn.minus").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = Number.parseInt(e.target.dataset.index)
            if (cart[index].quantity > 1) {
                cart[index].quantity--
                    updateCartDisplay()
                updateCartCount()
                updateCartTotal()
                saveCart()
            }
        })
    })

    document.querySelectorAll(".quantityBtn.plus").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = Number.parseInt(e.target.dataset.index)
            cart[index].quantity++
                updateCartDisplay()
            updateCartCount()
            updateCartTotal()
            saveCart()
        })
    })
}

function updateCartTotal() {
    if (!cartTotal) return

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    cartTotal.textContent = `$${total.toFixed(2)}`
}

function addToCart() {
    if (!currentSize) {
        alert("Please select a size")
        return
    }

    const colorName = choosenProduct.colors[currentColorIndex].code
    const img = choosenProduct.colors[currentColorIndex].img

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
        (item) => item.id === choosenProduct.id && item.colorIndex === currentColorIndex && item.size === currentSize,
    )

    if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        cart[existingItemIndex].quantity++
    } else {
        // Add new item to cart
        cart.push({
            id: choosenProduct.id,
            title: choosenProduct.title,
            price: choosenProduct.price,
            img: img,
            colorIndex: currentColorIndex,
            colorName: colorName,
            size: currentSize,
            quantity: 1,
        })
    }

    // Update cart display
    updateCartCount()
    updateCartDisplay()
    updateCartTotal()
    saveCart()

    // Show cart sidebar
    if (cartSidebar) {
        cartSidebar.classList.add("open")
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("nikeCart", JSON.stringify(cart))
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem("nikeCart")
    if (savedCart) {
        cart = JSON.parse(savedCart)
        updateCartCount()
        updateCartDisplay()
        updateCartTotal()
    }
}

// Payment processing with Stripe
function processPayment() {
    const paymentForm = document.querySelector(".paymentForm")
    const cardNumber = document.getElementById("cardNumber")
    const cardExpiry = document.getElementById("cardExpiry")
    const cardCvc = document.getElementById("cardCvc")
    const nameOnCard = document.getElementById("nameOnCard")

    if (!paymentForm || !cardNumber || !cardExpiry || !cardCvc || !nameOnCard) {
        console.error("Payment form elements not found")
        return
    }

    // Basic validation
    if (!cardNumber.value || !cardExpiry.value || !cardCvc.value || !nameOnCard.value) {
        alert("Please fill in all payment details")
        return
    }

    // Show loading state
    const payButton = document.querySelector(".payButton")
    const originalText = payButton.textContent
    payButton.textContent = "Processing..."
    payButton.disabled = true

    // Simulate payment processing
    setTimeout(() => {
        // Reset button state
        payButton.textContent = originalText
        payButton.disabled = false

        // Clear cart and close payment modal
        cart = []
        saveCart()
        updateCartCount()
        updateCartDisplay()
        updateCartTotal()

        // Close payment modal
        payment.style.display = "none"

        // Show success message
        alert("Payment successful! Your order has been placed.")
    }, 2000)
}

// Event listeners for cart
if (cartIconContainer) {
    cartIconContainer.addEventListener("click", () => {
        console.log("Cart container clicked")
        if (cartSidebar) {
            cartSidebar.classList.add("open")
        } else {
            console.error("Cart sidebar element not found")
        }
    })
}

if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
        console.log("Cart icon clicked")
        e.stopPropagation() // Prevent double triggering with container
        if (cartSidebar) {
            cartSidebar.classList.add("open")
        } else {
            console.error("Cart sidebar element not found")
        }
    })
}

if (cartClose) {
    cartClose.addEventListener("click", () => {
        cartSidebar.classList.remove("open")
    })
}

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty")
            return
        }

        // Close cart sidebar
        cartSidebar.classList.remove("open")

        // Show payment modal
        payment.style.display = "flex"
    })
}

// Product button (Buy Now)
const productButton = document.querySelector(".productButton")
if (productButton) {
    productButton.addEventListener("click", addToCart)
}

// Payment modal
const payment = document.querySelector(".payment")
const close = document.querySelector(".close")

if (close) {
    close.addEventListener("click", () => {
        payment.style.display = "none"
    })
}

// Initialize payment form submit
const paymentForm = document.querySelector(".paymentForm")
if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault()
        processPayment()
    })
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    // Re-select critical elements in case they weren't available during initial load
    const cartIconRecheck = document.querySelector(".cartIcon")
    const cartIconContainerRecheck = document.querySelector(".cartIconContainer")
    const cartSidebarRecheck = document.querySelector(".cartSidebar")
    const cartCloseRecheck = document.querySelector(".cartClose")

    // Use the rechecked elements if the original ones weren't found
    if (!cartIcon && cartIconRecheck) {
        console.log("Updating cartIcon reference")
        window.cartIcon = cartIconRecheck
        cartIconRecheck.addEventListener("click", (e) => {
            console.log("Cart icon clicked (rebound)")
            e.stopPropagation()
            if (cartSidebarRecheck) {
                cartSidebarRecheck.classList.add("open")
            }
        })
    }

    if (!cartIconContainer && cartIconContainerRecheck) {
        console.log("Updating cartIconContainer reference")
        window.cartIconContainer = cartIconContainerRecheck
        cartIconContainerRecheck.addEventListener("click", () => {
            console.log("Cart container clicked (rebound)")
            if (cartSidebarRecheck) {
                cartSidebarRecheck.classList.add("open")
            }
        })
    }

    if (!cartSidebar && cartSidebarRecheck) {
        console.log("Updating cartSidebar reference")
        window.cartSidebar = cartSidebarRecheck
    }

    if (!cartClose && cartCloseRecheck) {
        console.log("Updating cartClose reference")
        window.cartClose = cartCloseRecheck
        cartCloseRecheck.addEventListener("click", () => {
            if (cartSidebarRecheck) {
                cartSidebarRecheck.classList.remove("open")
            }
        })
    }

    loadCart()
    initZoom()
    initFlipkartZoom() // Initialize Flipkart-style zoom

    // Create slider items for new products
    createSliderItems()

    // Debug cart elements
    console.log("Cart icon element:", cartIcon || cartIconRecheck)
    console.log("Cart icon container element:", cartIconContainer || cartIconContainerRecheck)
    console.log("Cart sidebar element:", cartSidebar || cartSidebarRecheck)

    // Add test item to cart if it's empty (to verify cart is working)
    if (cart.length === 0) {
        console.log("Adding test item to cart")
        const testItem = {
            id: 1,
            title: "Test Product",
            price: 99,
            img: "./img/air.png",
            colorIndex: 0,
            colorName: "black",
            size: "42",
            quantity: 1
        }
        cart.push(testItem)
        updateCartDisplay()
        updateCartCount()
        updateCartTotal()
    }

    // Setup special offers
    setupSpecialOffers()

    // Setup limited offer link
    setupLimitedOfferLink()
})

// Create slider items for all products
function createSliderItems() {
    const sliderWrapper = document.querySelector(".sliderWrapper")
    if (!sliderWrapper) return

    // Clear existing slider items
    sliderWrapper.innerHTML = ""

    // Create slider items for all products
    products.forEach((product, index) => {
        const sliderItem = document.createElement("div")
        sliderItem.className = "sliderItem"

        // Determine background color class based on index
        const bgColorClass =
            index % 5 === 0 ?
            "bg-green" :
            index % 5 === 1 ?
            "bg-purple" :
            index % 5 === 2 ?
            "bg-teal" :
            index % 5 === 3 ?
            "bg-blue" :
            "bg-brown"

        sliderItem.innerHTML = `
      <img src="${product.colors[0].img}" alt="${product.title}" class="sliderImg">
      <div class="sliderBg ${bgColorClass}"></div>
      <h1 class="sliderTitle">${product.title}</br> NEW</br> SEASON</h1>
      <h2 class="sliderPrice">$${product.price}</h2>
      <a href="#product">
        <button class="buyButton">BUY NOW!</button>
      </a>
    `

        sliderWrapper.appendChild(sliderItem)
    })

    // Update menu items to match products
    const navBottom = document.querySelector(".navBottom")
    if (navBottom) {
        navBottom.innerHTML = ""
        products.forEach((product) => {
            const menuItem = document.createElement("h3")
            menuItem.className = "menuItem"
            menuItem.textContent = product.title.toUpperCase()
            navBottom.appendChild(menuItem)
        })

        // Re-attach event listeners to new menu items
        const newMenuItems = document.querySelectorAll(".menuItem")
        newMenuItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                // Change the current slide
                wrapper.style.transform = `translateX(${-100 * index}vw)`

                // Change the chosen product
                choosenProduct = products[index]
                currentColorIndex = 0
                zoomLevel = 1

                // Update product display
                updateProductDisplay()
            })
        })
    }
}

// Special Offers functionality
function setupSpecialOffers() {
    const offerButtons = document.querySelectorAll('.offerButton');

    offerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Get the offer item's data
            const offerItem = button.closest('.offerItem');
            const title = offerItem.querySelector('h3').textContent;
            const salePrice = parseFloat(offerItem.querySelector('.salePrice').textContent.replace('$', ''));
            const img = offerItem.querySelector('.offerImg').src;

            // Find the corresponding product in the products array
            const product = products.find(p => p.title === title);

            if (product) {
                // Use the product's ID and color
                const offerProduct = {
                    id: product.id,
                    title: product.title,
                    price: salePrice, // Use the sale price
                    img: img,
                    colorIndex: 0,
                    colorName: product.colors[0].code,
                    size: "42", // Default size
                    quantity: 1
                };

                // Check if the item is already in the cart
                const existingItemIndex = cart.findIndex(
                    item => item.id === offerProduct.id && item.colorIndex === offerProduct.colorIndex && item.size === offerProduct.size
                );

                if (existingItemIndex !== -1) {
                    // Increment quantity if item exists
                    cart[existingItemIndex].quantity++;
                } else {
                    // Add new item to cart
                    cart.push(offerProduct);
                }

                // Update cart display
                updateCartCount();
                updateCartDisplay();
                updateCartTotal();
                saveCart();

                // Show cart sidebar
                if (cartSidebar) {
                    cartSidebar.classList.add('open');
                }

                // Show success message
                showNotification(`${title} added to your cart!`);
            }
        });
    });
}

// Show notification
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');

    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);

        // Add styles if they don't exist
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            }
            .notification {
                background-color: #4CAF50;
                color: white;
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                animation: slideIn 0.3s ease-out forwards;
                max-width: 300px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
                margin-left: 10px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        ${message}
        <button class="notification-close">&times;</button>
    `;

    // Add to container
    notificationContainer.appendChild(notification);

    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode === notificationContainer) {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode === notificationContainer) {
                    notificationContainer.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Handle "Limited Offer" link click
function setupLimitedOfferLink() {
    const limitedOfferLink = document.querySelector(".limitedOfferLink");
    if (limitedOfferLink) {
        limitedOfferLink.addEventListener("click", (e) => {
            // Get the target special offers section
            const specialOffers = document.getElementById("specialOffers");

            // Highlight the section
            if (specialOffers) {
                // Remove highlight class if it exists
                specialOffers.classList.remove("highlight-section");

                // Force a reflow to restart the animation
                void specialOffers.offsetWidth;

                // Add the highlight class
                specialOffers.classList.add("highlight-section");

                // Add the CSS if it doesn't exist
                if (!document.getElementById("highlight-section-style")) {
                    const style = document.createElement("style");
                    style.id = "highlight-section-style";
                    style.textContent = `
                        @keyframes highlightSection {
                            0% { background-color: #f8f8f8; }
                            50% { background-color: #e3f2fd; }
                            100% { background-color: #f8f8f8; }
                        }
                        
                        .highlight-section {
                            animation: highlightSection 1.5s ease;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });
    }
}