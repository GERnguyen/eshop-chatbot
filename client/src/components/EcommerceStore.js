// Import React hooks for state and lifecycle management
import React, { useState, useEffect } from 'react'
// Import Font Awesome icons for UI elements (search, cart, user, heart)
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaStar } from 'react-icons/fa'
// Import the custom ChatWidget component for AI assistance
import ChatWidget from './ChatWidget'

// Main e-commerce store component
const EcommerceStore = () => {
  // State for products from database
  const [products, setProducts] = useState([])
  // State for loading status
  const [loading, setLoading] = useState(true)
  // State for search query
  const [searchQuery, setSearchQuery] = useState('')
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Fetch products from API on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products')
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  // Get unique categories from products
  const categories = ['All', ...new Set(products.flatMap(p => p.categories || []))]

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.item_description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || 
                           (product.categories && product.categories.includes(selectedCategory))
    return matchesSearch && matchesCategory
  })

  // Calculate average rating from reviews
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

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
              <a href="#wishlist">
                {/* Heart icon for favorites with size 20px */}
                <FaHeart size={20} />
                <span className="badge">{3}</span>
              </a>
              <a href="#cart">
                {/* Shopping cart icon with size 20px */}
                <FaShoppingCart size={20} />
                <span className="badge">{2}</span>
              </a>
            </div>
          </div>

          {/* Navigation menu bar */}
          <nav className="nav-bar">
            {/* Unordered list for navigation items */}
            <ul>
              <li><a href="#" className="active">Home</a></li>
              <li><a href="#">Electronics</a></li>
              <li><a href="#">Clothing</a></li>
              <li><a href="#">Home & Kitchen</a></li>
              <li><a href="#">Beauty</a></li>
              <li><a href="#">Sports</a></li>
              <li><a href="#">Deals</a></li>
            </ul>
          </nav>
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
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
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
                {filteredProducts.map(product => (
                  <div key={product.item_id} className="product-card">
                    <div className="product-image">
                      <img 
                        src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.item_name}
                      />
                      {product.prices.sale_price < product.prices.full_price && (
                        <span className="sale-badge">
                          {Math.round((1 - product.prices.sale_price / product.prices.full_price) * 100)}% OFF
                        </span>
                      )}
                      <button className="wishlist-btn">
                        <FaHeart />
                      </button>
                    </div>
                    <div className="product-info">
                      <span className="product-brand">{product.brand}</span>
                      <h3 className="product-name">{product.item_name}</h3>
                      <p className="product-description">{product.item_description}</p>
                      <div className="product-rating">
                        <FaStar className="star-icon" />
                        <span>{getAverageRating(product.user_reviews)}</span>
                        <span className="review-count">({product.user_reviews?.length || 0} reviews)</span>
                      </div>
                      <div className="product-price">
                        <span className="sale-price">${product.prices.sale_price.toFixed(2)}</span>
                        {product.prices.sale_price < product.prices.full_price && (
                          <span className="full-price">${product.prices.full_price.toFixed(2)}</span>
                        )}
                      </div>
                      <button className="add-to-cart-btn">
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
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Clothing</a></li>
                <li><a href="#">Home & Kitchen</a></li>
                <li><a href="#">Beauty</a></li>
                <li><a href="#">Sports</a></li>
              </ul>
            </div>

            {/* Second footer column - Customer service links */}
            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Shipping Policy</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
                <li><a href="#">Order Tracking</a></li>
              </ul>
            </div>

            {/* Third footer column - Company information */}
            <div className="footer-column">
              <h3>About Us</h3>
              <ul>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Sustainability</a></li>
              </ul>
            </div>

            {/* Fourth footer column - Social media links */}
            <div className="footer-column">
              <h3>Connect With Us</h3>
              <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Pinterest</a></li>
                <li><a href="#">YouTube</a></li>
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
    </>
  )
}

// Export component as default export for use in other files
export default EcommerceStore