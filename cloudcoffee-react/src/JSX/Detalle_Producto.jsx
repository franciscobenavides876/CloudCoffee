import React, { useState } from 'react';
import '../CSS/Complementarias.css';

export default function DetalleProducto({ product, onBack, onAddToCart }) {
  const [selectedOffer, setSelectedOffer] = useState(
    product?.offers?.find((o) => o.inStock) || product?.offers?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    if (!selectedOffer || !selectedOffer.inStock) return;
    onAddToCart(product, selectedOffer, quantity);
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container product-detail-container">
        <button className="back-button-light" onClick={onBack} type="button">
          ← Volver al Menú
        </button>

        <div className="product-detail-content">
          <div className="product-hero-badge">
            <span className="product-category-pill">{product.category}</span>
          </div>

          <header className="product-detail-header">
            <h1>{product.name}</h1>
            <p className="product-description-extended">{product.description}</p>
          </header>

          <section className="offers-selection-section">
            <h3>Selecciona la Cafetería de Retiro</h3>
            <div className="offers-radio-list">
              {product.offers?.map((offer) => {
                const isSelected = selectedOffer?.cafeId === offer.cafeId;
                return (
                  <div
                    key={offer.cafeId}
                    className={`offer-radio-card ${isSelected ? 'selected' : ''} ${
                      !offer.inStock ? 'out-of-stock' : ''
                    }`}
                    onClick={() => offer.inStock && setSelectedOffer(offer)}
                  >
                    <div className="offer-radio-info">
                      <strong>{offer.cafeName}</strong>
                      <small>📍 {offer.location}</small>
                      <span className="offer-stock-tag">
                        {offer.inStock ? '🟢 En Stock' : '🔴 Agotado'}
                      </span>
                    </div>

                    <div className="offer-radio-price">
                      <strong>${offer.price?.toLocaleString('es-CL')}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {selectedOffer?.inStock && (
            <div className="product-quantity-wrapper">
              <span>Cantidad:</span>
              <div className="stepper-detail">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-detail-footer">
            <button
              type="button"
              className="btn-add-detail"
              disabled={!selectedOffer || !selectedOffer.inStock}
              onClick={handleAdd}
            >
              {selectedOffer?.inStock
                ? `Agregar ${quantity} al Carrito • $${(
                    (selectedOffer?.price || 0) * quantity
                  ).toLocaleString('es-CL')}`
                : 'Agotado en este punto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}