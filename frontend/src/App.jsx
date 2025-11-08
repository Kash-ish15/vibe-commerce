import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

const API_URL = '/api/products'
const CART_URL = '/api/cart'

function ProductsPage({
  products,
  isLoading,
  error,
  cartFeedback,
  pendingProductId,
  onAddToCart,
}) {
  const showGrid = !isLoading && !error && products.length > 0

  return (
    <>
      <header className="page__header">
        <span className="page__badge">Vibe Commerce</span>
        <h1 className="page__title">Elevate Your Everyday</h1>
        <p className="page__subtitle">Curated selections to match every mood and space.</p>
      </header>

      {isLoading && <p className="status">Loading products…</p>}
      {error && <p className="status status--error">{error}</p>}
      {cartFeedback && (
        <p className={`status status--inline ${cartFeedback.type === 'error' ? 'status--error' : 'status--success'}`}>
          {cartFeedback.message}
        </p>
      )}

      {showGrid && (
        <section className="grid" aria-label="Product grid">
          {products.map((product) => (
            <article key={product.id} className="card">
              <div className="card__image-wrapper">
                <img src={product.imageUrl} alt={product.name} loading="lazy" />
              </div>
              <div className="card__body">
                <div className="card__header">
                  <h2 className="card__title">{product.name}</h2>
                  <p className="card__price">${product.price.toFixed(2)}</p>
                </div>
                <p className="card__copy">Carefully sourced and crafted to elevate the vibe of your home.</p>
                <button
                  type="button"
                  className="card__button"
                  onClick={() => onAddToCart(product.id)}
                  disabled={pendingProductId === product.id}
                >
                  {pendingProductId === product.id ? 'Adding…' : 'Add to Cart'}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {!isLoading && !error && products.length === 0 && (
        <p className="status">No products found right now, check back soon.</p>
      )}
    </>
  )
}

function CartPage({ items, subtotal, totalItems, isCartLoading, cartFeedback, onRemove, onCheckout, checkoutLoading }) {
  const navigate = useNavigate()

  return (
    <section className="cart" aria-label="Shopping cart">
      <header className="cart__header">
        <div>
          <h1>Cart</h1>
          <p>Review and finalize the pieces that match your vibe.</p>
        </div>
        <button type="button" className="cart__continue" onClick={() => navigate('/')}>Continue Shopping</button>
      </header>

      {isCartLoading && <p className="status">Loading cart…</p>}

      {!isCartLoading && cartFeedback && (
        <p className={`status status--inline ${cartFeedback.type === 'error' ? 'status--error' : 'status--success'}`}>
          {cartFeedback.message}
        </p>
      )}

      {!isCartLoading && items.length === 0 && (
        <p className="status">Your cart is empty. Discover new items on the home page.</p>
      )}

      {!isCartLoading && items.length > 0 && (
        <>
          <ul className="cart__list">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="cart__item">
                <div className="cart__thumbnail">
                  <img src={product.imageUrl} alt={product.name} loading="lazy" />
                </div>
                <div className="cart__details">
                  <h2>{product.name}</h2>
                  <p>${product.price.toFixed(2)} × {quantity}</p>
                </div>
                <div className="cart__total">
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  className="cart__remove"
                  onClick={() => onRemove(product.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <footer className="cart__summary">
            <div>
              <span className="cart__summary-label">Items</span>
              <span className="cart__summary-value">{totalItems}</span>
            </div>
            <div>
              <span className="cart__summary-label">Subtotal</span>
              <span className="cart__summary-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart__summary-total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="cart__checkout"
              onClick={onCheckout}
              disabled={items.length === 0 || checkoutLoading}
            >
              {checkoutLoading ? 'Processing…' : 'Proceed to Checkout'}
            </button>
            <p className="cart__summary-note">Shipping and taxes calculated at checkout.</p>
          </footer>
        </>
      )}
    </section>
  )
}

function ReceiptPage({ receipt, onBackToShop }) {
  const itemLabel = receipt.totalItems === 1 ? 'item' : 'items'
  const timestamp = new Date(receipt.timestamp).toLocaleString()

  return (
    <section className="receipt" aria-label="Order receipt">
      <div className="receipt__card">
        <header className="receipt__masthead">
          <p className="receipt__brand">Vibe Commerce</p>
          <p className="receipt__tagline">Elevating everyday vibes</p>
          <span className="receipt__badge">Thank you</span>
        </header>

        <h1 className="receipt__heading">Order Receipt</h1>

        <div className="receipt__order-meta">
          <span>Order #{receipt.receiptNumber}</span>
          <span>{timestamp}</span>
          <span>{receipt.totalItems} {itemLabel}</span>
        </div>

        <div className="receipt__table">
          <table>
            <thead>
              <tr>
                <th className="align-left">Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item) => (
                <tr key={item.id}>
                  <td className="align-left">{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="receipt__totals">
          <div>
            <span>Subtotal</span>
            <span>${receipt.subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Total</span>
            <span>${receipt.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="receipt__actions">
          <button type="button" className="receipt__button receipt__button--primary" onClick={onBackToShop}>
            Continue Shopping
          </button>
          <button
            type="button"
            className="receipt__button receipt__button--secondary"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingProductId, setPendingProductId] = useState(null)
  const [cartMessage, setCartMessage] = useState(null)
  const [cartError, setCartError] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [cartSubtotal, setCartSubtotal] = useState(0)
  const [isCartLoading, setIsCartLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [latestReceipt, setLatestReceipt] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const isReceiptRoute = location.pathname.startsWith('/receipt')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data.products ?? [])
      } catch (err) {
        setError(err.message || 'Unexpected error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchCart = async () => {
      setIsCartLoading(true)
      try {
        const response = await fetch(CART_URL)

        if (!response.ok) {
          throw new Error('Failed to fetch cart')
        }

        const data = await response.json()
        setCartItems(data.cart ?? [])
        setCartSubtotal(data.subtotal ?? 0)
      } catch (err) {
        setCartError(err.message || 'Unexpected cart error')
      } finally {
        setIsCartLoading(false)
      }
    }

    fetchCart()
  }, [])

  const handleAddToCart = async (productId) => {
    setPendingProductId(productId)
    setCartError(null)
    setCartMessage(null)

    try {
      const response = await fetch(CART_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity: 1 })
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message || 'Unable to add to cart')
      }

      const data = await response.json()

      setCartItems(data.cart ?? [])
      setCartSubtotal(data.subtotal ?? 0)

      const product = products.find((item) => item.id === productId)
      if (product) {
        setCartMessage(`${product.name} added to cart`)
      }
    } catch (err) {
      setCartError(err.message || 'Unexpected cart error')
    } finally {
      setPendingProductId(null)
    }
  }

  const cartCount = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.quantity, 0),
    [cartItems]
  )

  const cartFeedback = useMemo(() => {
    if (cartError) {
      return { type: 'error', message: cartError }
    }
    if (cartMessage) {
      return { type: 'success', message: cartMessage }
    }
    return null
  }, [cartError, cartMessage])

  const handleCheckout = async () => {
    if (!cartItems.length) {
      return
    }

    setCartError(null)
    setCartMessage(null)
    setCheckoutLoading(true)

    try {
      const response = await fetch(`${CART_URL}/checkout`, {
        method: 'POST'
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message || 'Checkout failed')
      }

      const data = await response.json()
      setCartItems([])
      setCartSubtotal(0)
      if (data.receipt) {
        setLatestReceipt(data.receipt)
        navigate('/receipt')
      }
    } catch (err) {
      setCartError(err.message || 'Unexpected cart error')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleBackToShop = () => {
    setLatestReceipt(null)
    navigate('/')
  }

  const handleRemoveFromCart = async (productId) => {
    setCartError(null)
    setCartMessage(null)

    try {
      const response = await fetch(`${CART_URL}/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message || 'Unable to remove from cart')
      }

      const data = await response.json()
      setCartItems(data.cart ?? [])
      setCartSubtotal(data.subtotal ?? 0)
      setCartMessage('Item removed from cart')
    } catch (err) {
      setCartError(err.message || 'Unexpected cart error')
    }
  }

  return (
    <div className={`app-shell${isReceiptRoute ? ' app-shell--receipt' : ''}`}>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">✨</span>
          <div>
            <p className="navbar__brand-title">Vibe Commerce</p>
          </div>
        </div>

        <div className="navbar__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
            end
          >
            Home
          </NavLink>
          <button type="button" className="navbar__link navbar__link--muted">Collections</button>
          <button type="button" className="navbar__link navbar__link--muted">New Arrivals</button>
          <button type="button" className="navbar__link navbar__link--muted">About Us</button>
          <button type="button" className="navbar__link navbar__link--muted">Support</button>
        </div>

        <button
          type="button"
          className="navbar__cart"
          aria-label={`Cart with ${cartCount} items`}
          onClick={() => navigate('/cart')}
        >
          <span className="navbar__cart-icon" aria-hidden="true">🛒</span>
          <span>Cart</span>
          <span className="navbar__cart-count" data-empty={cartCount === 0}>
            {cartCount}
          </span>
        </button>
      </nav>

      <main className={`page${isReceiptRoute ? ' page--centered' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              <ProductsPage
                products={products}
                isLoading={isLoading}
                error={error}
                cartFeedback={cartFeedback}
                pendingProductId={pendingProductId}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                items={cartItems}
                subtotal={cartSubtotal}
                totalItems={cartCount}
                isCartLoading={isCartLoading}
                cartFeedback={cartFeedback}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckout}
                checkoutLoading={checkoutLoading}
              />
            }
          />
          <Route path="/products" element={<Navigate to="/" replace />} />
          <Route
            path="/receipt"
            element={
              latestReceipt ? (
                <ReceiptPage receipt={latestReceipt} onBackToShop={handleBackToShop} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
