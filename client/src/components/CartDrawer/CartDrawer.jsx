import "./CartDrawer.css";

export default function CartDrawer({ open, onClose }) {
  return (
    <div className={`cart-overlay ${open ? "show" : ""}`}>
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="cart-body">
          {/* later real cart items */}
          Item added to cart
        </div>

        <div className="cart-footer">
          <a href="/cart">View Cart</a>
        </div>
      </div>
    </div>
  );
}
