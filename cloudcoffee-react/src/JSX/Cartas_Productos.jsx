import React from 'react';

export default function CartasProductos({ product, onAddToCart, onToggleFollow, onOpenReviews }) {
  return (
    <div className="mobile-product-card">
      <div className="card-header-mini">
        <div className="card-icon-box">☕</div>
        <div className="card-details">
          <h3>{product.name}</h3>
          
          {/* Calificación y enlace a reseñas */}
          <div className="rating-row" onClick={onOpenReviews}>
            <span className="star-icon">★</span>
            <strong className="rating-value">{product.rating || '5.0'}</strong>
            <span className="reviews-link">({product.reviewsCount || 0} reseñas)</span>
          </div>

          <p>{product.description || 'Disponible en cafeterías UCT.'}</p>
        </div>
      </div>

      {product.offers && product.offers.length > 0 ? (
        <div className="card-offer-list">
          {product.offers.map((offer) => (
            <div key={offer.cafeId} className="card-offer-row">
              <div>
                <div className="offer-cafe-name">{offer.cafeName}</div>
                <div className="offer-price-tag">${offer.price.toLocaleString('es-CL')}</div>
              </div>
              <button 
                type="button"
                className="btn-add-mini" 
                onClick={() => onAddToCart(product, offer)}
              >
                + Pedir
              </button>
            </div>
          ))}
        </div>
      ) : (
        <button 
          type="button"
          className={`btn-follow-mini ${product.isFollowed ? 'active' : ''}`}
          onClick={() => onToggleFollow(product.id)}
        >
          {product.isFollowed ? '★ Siguiendo stock' : '☆ Avisarme cuando haya stock'}
        </button>
      )}
    </div>
  );
}