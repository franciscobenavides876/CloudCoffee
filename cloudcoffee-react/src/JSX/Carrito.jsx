import React, { useState, useMemo } from 'react';
import '../CSS/Carrito.css';

export default function Carrito({ onBack, onCheckoutSuccess, cartItems, onUpdateCart }) {
  const [items, setItems] = useState(() => {
    if (cartItems && cartItems.length > 0) return cartItems;
    const local = localStorage.getItem('cart_items');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    // Datos de prueba con 2 cafeterías distintas
    return [
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
      },
      {
        id: 4,
        name: 'Papas Fritas Rústicas',
        price: 1500,
        quantity: 1,
        cafeName: 'Kiosko Pabellón D',
        cafeId: 102
      }
    ];
  });

  const [procesando, setProcesando] = useState(false);

  const syncCart = (updated) => {
    setItems(updated);
    localStorage.setItem('cart_items', JSON.stringify(updated));
    if (onUpdateCart) onUpdateCart(updated);
  };

  const handleQuantityChange = (id, cafeId, delta) => {
    const updated = items
      .map((item) => {
        if (item.id === id && item.cafeId === cafeId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    syncCart(updated);
  };

  const handleRemoveItem = (id, cafeId) => {
    const updated = items.filter((item) => !(item.id === id && item.cafeId === cafeId));
    syncCart(updated);
  };

  // Agrupamiento dinámico por cafetería (INT4-33)
  const groupedByCafe = useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const cId = item.cafeId || 'default';
      if (!groups[cId]) {
        groups[cId] = {
          cafeId: item.cafeId,
          cafeName: item.cafeName || 'Cafetería UCT',
          items: [],
          subtotal: 0
        };
      }
      groups[cId].items.push(item);
      groups[cId].subtotal += item.price * item.quantity;
    });
    return Object.values(groups);
  }, [items]);

  const totalGeneral = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePagar = () => {
    if (items.length === 0) return;
    setProcesando(true);

    setTimeout(() => {
      setProcesando(false);
      localStorage.removeItem('cart_items');
      alert(`¡Pago completado con éxito! Se generaron órdenes para ${groupedByCafe.length} punto(s) de retiro.`);
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
            <p className="cart-cafe-origin">
              {groupedByCafe.length > 1
                ? `📦 Retiro programado en ${groupedByCafe.length} puntos de entrega`
                : groupedByCafe.length === 1
                ? `📍 Retiro en: ${groupedByCafe[0].cafeName}`
                : 'Carrito sin productos'}
            </p>
          </header>

          {items.length === 0 ? (
            <div className="cart-empty-state">
              <span className="empty-cart-icon">🛒</span>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega cafés y snacks desde el catálogo para iniciar tu compra.</p>
              <button className="btn-cart-action" onClick={onBack} type="button">
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Grupos de productos divididos por Cafetería */}
              <div className="cart-groups-wrapper">
                {groupedByCafe.map((group) => (
                  <section key={group.cafeId || group.cafeName} className="cart-cafe-group-card">
                    
                    <div className="cafe-group-header">
                      <div className="cafe-group-title">
                        <span className="cafe-pin-icon">📍</span>
                        <strong>{group.cafeName}</strong>
                      </div>
                      <span className="cafe-items-badge">
                        {group.items.reduce((sum, it) => sum + it.quantity, 0)} productos
                      </span>
                    </div>

                    <div className="cart-items-list">
                      {group.items.map((item) => (
                        <div key={`${item.id}-${item.cafeId}`} className="cart-item-card">
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
                                onClick={() => handleQuantityChange(item.id, item.cafeId, -1)}
                              >
                                -
                              </button>
                              <span className="quantity-number">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.cafeId, 1)}
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
                              onClick={() => handleRemoveItem(item.id, item.cafeId)}
                              title="Eliminar producto"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cafe-group-subtotal-row">
                      <span>Subtotal {group.cafeName}:</span>
                      <strong>${group.subtotal.toLocaleString('es-CL')}</strong>
                    </div>
                  </section>
                ))}
              </div>

              {/* Método de Pago */}
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

              {/* Resumen Total y Checkout */}
              <div className="cart-summary-section">
                <div className="summary-breakdown">
                  {groupedByCafe.map((g) => (
                    <div key={`sub-${g.cafeId}`} className="summary-row sub-row">
                      <span>Subtotal ({g.cafeName})</span>
                      <span>${g.subtotal.toLocaleString('es-CL')}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-row total-row">
                  <span>Total a Pagar</span>
                  <span className="total-amount">${totalGeneral.toLocaleString('es-CL')}</span>
                </div>

                <button
                  type="button"
                  className="btn-pay-order"
                  onClick={handlePagar}
                  disabled={procesando}
                >
                  {procesando
                    ? 'Procesando pago...'
                    : `Pagar con Mercado Pago $${totalGeneral.toLocaleString('es-CL')}`}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}