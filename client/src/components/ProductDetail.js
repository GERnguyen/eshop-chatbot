import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import ChatWidget from "./ChatWidget";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  // Cart and wishlist items from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Helper functions for cart/favorites count
  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };
  
  const getFavoritesCount = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favs.length;
  };

  const [cartCount, setCartCount] = useState(getCartCount);
  const [favoritesCount, setFavoritesCount] = useState(getFavoritesCount);

  // Update counts when cart/favorites change
  useEffect(() => {
    const handleCartUpdate = () => setCartCount(getCartCount());
    const handleFavoritesUpdate = () => setFavoritesCount(getFavoritesCount());
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    window.addEventListener("storage", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  // Refresh cart/wishlist from localStorage
  const refreshCart = () => {
    const saved = localStorage.getItem("cartItems");
    setCartItems(saved ? JSON.parse(saved) : []);
  };

  const refreshWishlist = () => {
    const saved = localStorage.getItem("favorites");
    setWishlistItems(saved ? JSON.parse(saved) : []);
  };

  // Cart functions
  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCartModal(itemId);
      return;
    }
    const updated = cartItems.map(item =>
      item.item_id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    setCartCount(updated.reduce((total, item) => total + (item.quantity || 1), 0));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeFromCartModal = (itemId) => {
    const updated = cartItems.filter(item => item.item_id !== itemId);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    setCartCount(updated.reduce((total, item) => total + (item.quantity || 1), 0));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeFromWishlistModal = (itemId) => {
    const updated = wishlistItems.filter(item => item.item_id !== itemId);
    setWishlistItems(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavoritesCount(updated.length);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const addWishlistItemToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = currentCart.find(c => c.item_id === item.item_id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    setCartItems(currentCart);
    setCartCount(currentCart.reduce((total, i) => total + (i.quantity || 1), 0));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.prices?.sale_price || 0) * (item.quantity || 1),
    0
  );

  const fetchRelatedProducts = async (categories, currentProductId) => {
    try {
      const response = await fetch("http://localhost:8000/products");
      const allProducts = await response.json();
      // Filter related products (same category, different product)
      const related = allProducts
        .filter(
          (p) =>
            p.item_id !== currentProductId &&
            p.categories?.some((cat) => categories?.includes(cat))
        )
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch specific product
        const response = await fetch(`http://localhost:8000/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          // Fetch related products from same category
          fetchRelatedProducts(data.categories, productId);
        } else {
          console.error("Product not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = existingCart.find((item) => item.item_id === product.item_id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({ ...product, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    setAddedToCart(true);
    // Update cart count immediately
    setCartCount(existingCart.reduce((total, item) => total + (item.quantity || 1), 0));
    setTimeout(() => setAddedToCart(false), 2000);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleFavorite = () => {
    const existingFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const filtered = existingFavorites.filter((item) => item.item_id !== product.item_id);
      localStorage.setItem("favorites", JSON.stringify(filtered));
      setFavoritesCount(filtered.length);
    } else {
      existingFavorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(existingFavorites));
      setFavoritesCount(existingFavorites.length);
    }
    
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // Check if product is in favorites on load
  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.some((item) => item.item_id === product.item_id));
    }
  }, [product]);

  const calculateDiscount = () => {
    if (!product) return 0;
    return Math.round(
      ((product.prices.full_price - product.prices.sale_price) /
        product.prices.full_price) *
        100
    );
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="back-link">
              <FaArrowLeft /> Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="top-bar">
            <Link to="/" className="logo">
              ShopSmart
            </Link>
            <div className="nav-icons detail-nav">
              <Link to="/" className="back-link-header">
                <FaArrowLeft size={18} />
              </Link>
              <button className="icon-btn" onClick={() => { refreshWishlist(); setIsWishlistOpen(true); }}>
                <FaHeart size={20} />
                {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
              </button>
              <button className="icon-btn" onClick={() => { refreshCart(); setIsCartOpen(true); }}>
                <FaShoppingCart size={20} />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="product-detail-main">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            {product.categories && (
              <>
                <span>{product.categories[0]}</span>
                <span>/</span>
              </>
            )}
            <span className="current">{product.item_name}</span>
          </nav>

          {/* Product Detail Section */}
          <div className="product-detail-container">
            {/* Product Image */}
            <div className="product-image-section">
              <div className="main-image">
                {calculateDiscount() > 0 && (
                  <span className="discount-badge">-{calculateDiscount()}%</span>
                )}
                <img
                  src={product.image_url}
                  alt={product.item_name}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop";
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-section">
              <div className="product-brand">{product.brand}</div>
              <h1 className="product-title">{product.item_name}</h1>

              {/* Rating */}
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.round(getAverageRating(product.user_reviews))
                          ? "star-filled"
                          : "star-empty"
                      }
                    />
                  ))}
                </div>
                <span className="rating-value">
                  {getAverageRating(product.user_reviews)}
                </span>
                <span className="review-count">
                  ({product.user_reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="product-price-section">
                <span className="sale-price">
                  ${product.prices.sale_price.toFixed(2)}
                </span>
                {product.prices.full_price !== product.prices.sale_price && (
                  <span className="full-price">
                    ${product.prices.full_price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="product-description">{product.item_description}</p>

              {/* Categories */}
              <div className="product-categories">
                {product.categories?.map((cat, index) => (
                  <span key={index} className="category-tag">
                    {cat}
                  </span>
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <FaCheck /> Added to Cart
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  className={`favorite-btn ${isFavorite ? "active" : ""}`}
                  onClick={toggleFavorite}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {/* Product Features */}
              <div className="product-features">
                <div className="feature">
                  <FaTruck />
                  <span>Free Shipping</span>
                </div>
                <div className="feature">
                  <FaShieldAlt />
                  <span>2 Year Warranty</span>
                </div>
                <div className="feature">
                  <FaUndo />
                  <span>30-Day Returns</span>
                </div>
              </div>

              {/* Product Notes */}
              {product.notes && (
                <div className="product-notes">
                  <strong>Note:</strong> {product.notes}
                </div>
              )}

              {/* Manufacturer Info */}
              {product.manufacturer_address && (
                <div className="manufacturer-info">
                  <strong>Made in:</strong>{" "}
                  {product.manufacturer_address.city},{" "}
                  {product.manufacturer_address.country}
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {product.user_reviews && product.user_reviews.length > 0 && (
            <div className="reviews-section">
              <h2>Customer Reviews</h2>
              <div className="reviews-list">
                {product.user_reviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating ? "star-filled" : "star-empty"
                            }
                            size={14}
                          />
                        ))}
                      </div>
                      <span className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-text">{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section">
              <h2>Related Products</h2>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    to={`/product/${relatedProduct.item_id}`}
                    key={relatedProduct.item_id}
                    className="related-product-card"
                  >
                    <div className="related-product-image">
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.item_name}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop";
                        }}
                      />
                    </div>
                    <div className="related-product-info">
                      <h4>{relatedProduct.item_name}</h4>
                      <span className="related-product-price">
                        ${relatedProduct.prices.sale_price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaShoppingCart /> Shopping Cart</h2>
              <button className="modal-close" onClick={() => setIsCartOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingCart size={50} color="#ddd" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div key={item.item_id} className="cart-item">
                        <img
                          src={item.image_url}
                          alt={item.item_name}
                          className="cart-item-image"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                        <div className="cart-item-details">
                          <h4>{item.item_name}</h4>
                          <p className="cart-item-price">${item.prices?.sale_price?.toFixed(2)}</p>
                          <div className="cart-item-quantity">
                            <button onClick={() => updateCartQuantity(item.item_id, (item.quantity || 1) - 1)}>
                              <FaMinus size={10} />
                            </button>
                            <span>{item.quantity || 1}</span>
                            <button onClick={() => updateCartQuantity(item.item_id, (item.quantity || 1) + 1)}>
                              <FaPlus size={10} />
                            </button>
                          </div>
                        </div>
                        <button className="remove-item" onClick={() => removeFromCartModal(item.item_id)}>
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-price">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn">Proceed to Checkout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {isWishlistOpen && (
        <div className="modal-overlay" onClick={() => setIsWishlistOpen(false)}>
          <div className="modal-content wishlist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaHeart /> Wishlist</h2>
              <button className="modal-close" onClick={() => setIsWishlistOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                  <FaHeart size={50} color="#ddd" />
                  <p>Your wishlist is empty</p>
                </div>
              ) : (
                <div className="wishlist-items">
                  {wishlistItems.map((item) => (
                    <div key={item.item_id} className="wishlist-item">
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="wishlist-item-image"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                      <div className="wishlist-item-details">
                        <h4>{item.item_name}</h4>
                        <p className="wishlist-item-price">${item.prices?.sale_price?.toFixed(2)}</p>
                      </div>
                      <div className="wishlist-item-actions">
                        <button className="add-to-cart-sm" onClick={() => addWishlistItemToCart(item)}>
                          <FaShoppingCart /> Add
                        </button>
                        <button className="remove-wishlist" onClick={() => removeFromWishlistModal(item.item_id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
