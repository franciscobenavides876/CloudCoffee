import React, { useState } from 'react';
import '../CSS/Carrito.css';

export default function Carrito({ onBack, onCheckoutSuccess, cartItems = [], onUpdateCart }) {
  const [items, setItems] = useState(
    cartItems.length > 0
      ? cartItems
      : [
          {
            id: 1,
            name: 'Café Americano 12oz',
            price: 1800,
            quantity: 2,
            cafeName: 'Cafetería Central',
            cafeId: 101
          },
          {
            id: 2,
            name: 'Croissant Jamón y Queso',
            price: 2500,
            quantity: 1,
            cafeName: 'Cafetería Central',
            cafeId: 101
          }
        ]
  );

  const [procesando, setProcesando] = useState(false);

  const handleQuantityChange = (id, delta) => {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setItems(updated);
    if (onUpdateCart) onUpdateCart(updated);
  };

  const handleRemoveItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    if (onUpdateCart) onUpdateCart(updated);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;
  const cafeActual = items[0]?.cafeName || 'Cafetería UCT';

  const handlePagar = () => {
    if (items.length === 0) return;
    setProcesando(true);

    setTimeout(() => {
      setProcesando(false);
      alert(`¡Pedido pagado con Mercado Pago en ${cafeActual}!`);
      if (onCheckoutSuccess) {
        onCheckoutSuccess();
      }
    }, 1200);
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container cart-container">
        <div className="cart-content">
          
          <button className="back-button-light" onClick={onBack} type="button">
            ← Volver al Menú
          </button>

          <header className="cart-header">
            <div className="cart-badge">MI PEDIDO</div>
            <h1 className="cart-title">Tu Carrito de Compras</h1>
            {items.length > 0 && (
              <p className="cart-cafe-origin">
                📍 Retiro en: <strong>{cafeActual}</strong>
              </p>
            )}
          </header>

          {items.length === 0 ? (
            <div className="cart-empty-state">
              <span className="empty-cart-icon">🛒</span>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega cafés y alimentos desde el catálogo para iniciar tu pedido.</p>
              <button className="btn-cart-action" onClick={onBack} type="button">
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {items.map((item) => (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <span className="cart-item-unit-price">
                        ${item.price.toLocaleString('es-CL')} c/u
                      </span>
                    </div>

                    <div className="cart-item-controls">
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="quantity-number">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                      </div>

                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sección de Método de Pago Exclusivo Mercado Pago */}
              <section className="payment-method-section">
                <h3>Método de Pago</h3>
                <div className="payment-options">
                  <div className="payment-option single-option active">
                    <span className="mp-badge-icon">💙</span>
                    <div className="option-info">
                      <strong>Mercado Pago</strong>
                      <small>Tarjetas de débito, crédito o saldo en cuenta</small>
                    </div>
                  </div>
                </div>
              </section>

              <div className="cart-summary-section">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>${subtotal.toLocaleString('es-CL')}</strong>
                </div>
                <div className="summary-row total-row">
                  <span>Total a Pagar</span>
                  <span className="total-amount">${total.toLocaleString('es-CL')}</span>
                </div>

                <button
                  type="button"
                  className="btn-pay-order"
                  onClick={handlePagar}
                  disabled={procesando}
                >
                  {procesando ? 'Procesando pago...' : `Pagar con Mercado Pago $${total.toLocaleString('es-CL')}`}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}