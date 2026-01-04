// Import React hooks for state and lifecycle management
import React, { useState, useEffect } from "react";
// Import Link for navigation
import { Link } from "react-router-dom";
// Import Font Awesome icons for UI elements (search, cart, user, heart)
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaStar,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
// Import the custom ChatWidget component for AI assistance
import ChatWidget from "./ChatWidget";

// Main e-commerce store component
const EcommerceStore = () => {
  // State for products from database
  const [products, setProducts] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState("All");
  // State for cart items - initialize from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  // State for favorite/wishlist items - initialize from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  // State for cart modal visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  // State for wishlist modal visibility
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Listen for cart/favorites updates from other pages (like ProductDetail)
  useEffect(() => {
    const handleCartUpdate = () => {
      const saved = localStorage.getItem("cartItems");
      if (saved) setCartItems(JSON.parse(saved));
    };
    const handleFavoritesUpdate = () => {
      const saved = localStorage.getItem("favorites");
      if (saved) setFavorites(JSON.parse(saved));
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  // Fetch products from API on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Get unique categories from products
  const categories = [
    "All",
    ...new Set(products.flatMap((p) => p.categories || [])),
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.item_description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (product.categories && product.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  // Calculate average rating from reviews
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.item_id === product.item_id
      );
      if (existingItem) {
        // Increase quantity if already in cart
        return prevItems.map((item) =>
          item.item_id === product.item_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new item with quantity 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.item_id !== productId)
    );
  };

  // Update item quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.item_id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Toggle favorite status
  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some(
        (item) => item.item_id === product.item_id
      );
      if (isFavorite) {
        return prevFavorites.filter((item) => item.item_id !== product.item_id);
      }
      return [...prevFavorites, product];
    });
  };

  // Check if product is in favorites
  const isFavorite = (productId) => {
    return favorites.some((item) => item.item_id === productId);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.prices.sale_price * item.quantity,
    0
  );

  // Get total items in cart
  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Component returns JSX for the entire store layout
  return (
    // React Fragment to wrap multiple elements without extra DOM node
    <>
      {/* Website header section */}
      <header className="header">
        <div className="container">
          <div className="top-bar">
            <div className="logo">ShopSmart</div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button>
                <FaSearch />
              </button>
            </div>

            <div className="nav-icons">
              <a href="#account">
                {/* User icon with size 20px */}
                <FaUser size={20} />
              </a>
              <a
                href="#wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlistOpen(true);
                }}
              >
                {/* Heart icon for favorites with size 20px */}
                <FaHeart size={20} />
                <span className="badge">{favorites.length}</span>
              </a>
              <a
                href="#cart"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCartOpen(true);
                }}
              >
                {/* Shopping cart icon with size 20px */}
                <FaShoppingCart size={20} />
                <span className="badge">{cartItemsCount}</span>
              </a>
            </div>
          </div>

          {/* Navigation menu bar */}
        </div>
      </header>

      {/* Main content area */}
      <main>
        <div className="hero">
          <div className="container">
            <h1>Summer Sale is Live!</h1>
            <p>Get up to 50% off on selected items. Limited time offer.</p>
            <button>Shop Now</button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container">
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <section className="products-section">
          <div className="container">
            <h2 className="section-title">Our Products</h2>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.item_id} className="product-card">
                    <Link
                      to={`/product/${product.item_id}`}
                      className="product-image-link"
                    >
                      <div className="product-image">
                        <img
                          src={
                            product.image_url ||
                            "https://via.placeholder.com/400x300?text=No+Image"
                          }
                          alt={product.item_name}
                        />
                        {product.prices.sale_price <
                          product.prices.full_price && (
                          <span className="sale-badge">
                            {Math.round(
                              (1 -
                                product.prices.sale_price /
                                  product.prices.full_price) *
                                100
                            )}
                            % OFF
                          </span>
                        )}
                      </div>
                    </Link>
                    <button
                      className={`wishlist-btn ${
                        isFavorite(product.item_id) ? "active" : ""
                      }`}
                      onClick={() => toggleFavorite(product)}
                    >
                      <FaHeart />
                    </button>
                    <div className="product-info">
                      <span className="product-brand">{product.brand}</span>
                      <Link
                        to={`/product/${product.item_id}`}
                        className="product-name-link"
                      >
                        <h3 className="product-name">{product.item_name}</h3>
                      </Link>
                      <p className="product-description">
                        {product.item_description}
                      </p>
                      <div className="product-rating">
                        <FaStar className="star-icon" />
                        <span>{getAverageRating(product.user_reviews)}</span>
                        <span className="review-count">
                          ({product.user_reviews?.length || 0} reviews)
                        </span>
                      </div>
                      <div className="product-price">
                        <span className="sale-price">
                          ${product.prices.sale_price.toFixed(2)}
                        </span>
                        {product.prices.sale_price <
                          product.prices.full_price && (
                          <span className="full-price">
                            ${product.prices.full_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        <FaShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="no-products">
                <p>No products found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Website footer section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>Shop</h3>
              <ul>
                <li>
                  <a href="#">Electronics</a>
                </li>
                <li>
                  <a href="#">Clothing</a>
                </li>
                <li>
                  <a href="#">Home & Kitchen</a>
                </li>
                <li>
                  <a href="#">Beauty</a>
                </li>
                <li>
                  <a href="#">Sports</a>
                </li>
              </ul>
            </div>

            {/* Second footer column - Customer service links */}
            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Shipping Policy</a>
                </li>
                <li>
                  <a href="#">Returns & Exchanges</a>
                </li>
                <li>
                  <a href="#">Order Tracking</a>
                </li>
              </ul>
            </div>

            {/* Third footer column - Company information */}
            <div className="footer-column">
              <h3>About Us</h3>
              <ul>
                <li>
                  <a href="#">Our Story</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
                <li>
                  <a href="#">Sustainability</a>
                </li>
              </ul>
            </div>

            {/* Fourth footer column - Social media links */}
            <div className="footer-column">
              <h3>Connect With Us</h3>
              <ul>
                <li>
                  <a href="#">Facebook</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">Pinterest</a>
                </li>
                <li>
                  <a href="#">YouTube</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright notice */}
          <div className="copyright">
            {/* Copyright symbol, dynamic year, and company name */}
            &copy {new Date().getFullYear()} ShopSmart. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI chat widget component (floating chat button/window) */}
      <ChatWidget />

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div
            className="modal-content cart-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                <FaShoppingCart /> Shopping Cart
              </h2>
              <button
                className="modal-close"
                onClick={() => setIsCartOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingCart size={50} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.item_id} className="cart-item">
                      <img
                        src={
                          item.image_url ||
                          "https://via.placeholder.com/80x80?text=No+Image"
                        }
                        alt={item.item_name}
                      />
                      <div className="cart-item-info">
                        <h4>{item.item_name}</h4>
                        <p className="cart-item-price">
                          ${item.prices.sale_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="cart-item-quantity">
                        <button
                          onClick={() =>
                            updateQuantity(item.item_id, item.quantity - 1)
                          }
                        >
                          <FaMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.item_id, item.quantity + 1)
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.item_id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="modal-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-price">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {isWishlistOpen && (
        <div className="modal-overlay" onClick={() => setIsWishlistOpen(false)}>
          <div
            className="modal-content wishlist-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                <FaHeart /> My Wishlist
              </h2>
              <button
                className="modal-close"
                onClick={() => setIsWishlistOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {favorites.length === 0 ? (
                <div className="empty-wishlist">
                  <FaHeart size={50} />
                  <p>Your wishlist is empty</p>
                </div>
              ) : (
                <>
                  {favorites.map((item) => (
                    <div key={item.item_id} className="wishlist-item">
                      <img
                        src={
                          item.image_url ||
                          "https://via.placeholder.com/80x80?text=No+Image"
                        }
                        alt={item.item_name}
                      />
                      <div className="wishlist-item-info">
                        <h4>{item.item_name}</h4>
                        <p className="wishlist-item-price">
                          ${item.prices.sale_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="wishlist-item-actions">
                        <button
                          className="add-to-cart-sm"
                          onClick={() => {
                            addToCart(item);
                            toggleFavorite(item);
                          }}
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                        <button
                          className="remove-wishlist"
                          onClick={() => toggleFavorite(item)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Export component as default export for use in other files
export default EcommerceStore;
