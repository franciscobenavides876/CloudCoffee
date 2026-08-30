import React from 'react';

export default function CartasProductos({ product, onAddToCart, onToggleFollow }) {
  const getProductIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'café': return '☕';
      case 'pastelería': return '🥐';
      case 'sándwiches': return '🥪';
      case 'bebidas': return '🧃';
      case 'snacks': return '🍟';
      default: return '🍴';
    }
  };

  return (
    <article className="mobile-product-card">
      <div className="card-header-mini">
        <div className="card-icon-box">
          {getProductIcon(product.category)}
        </div>
        <div className="card-details">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      </div>

      {/* Listado de Ofertas por Cafetería */}
      <div className="card-offer-list">
        {product.offers && product.offers.length > 0 ? (
          product.offers.map((offer) => (
            <div key={offer.cafeId} className="card-offer-row">
              <div className="offer-info-group">
                <span className="offer-cafe-name">{offer.cafeName}</span>
                <span className="offer-cafe-location">{offer.location}</span>
                <span className="offer-price-tag">
                  ${offer.price?.toLocaleString('es-CL')}
                </span>
              </div>

              {offer.inStock ? (
                <button
                  type="button"
                  className="btn-add-mini"
                  onClick={() => onAddToCart(product, offer)}
                >
                  + Agregar
                </button>
              ) : (
                <button
                  type="button"
                  className={`btn-follow-mini ${product.isFollowed ? 'active' : ''}`}
                  onClick={() => onToggleFollow(product.id)}
                >
                  {product.isFollowed ? '🔔 Siguiendo' : '🔔 Avisar Stock'}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-offers-text">Sin ofertas disponibles en este campus.</p>
        )}
      </div>
    </article>
  );
}