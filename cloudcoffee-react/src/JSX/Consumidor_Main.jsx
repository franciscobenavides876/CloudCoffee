import React, { useState, useEffect } from 'react';
import CartasProductos from './Cartas_Productos';
import '../CSS/Consumidor_Main.css';

export default function ConsumidorMain({ onNavigateToCampus, onNavigateToCart, currentCampus }) {
  const [campusName, setCampusName] = useState(
    currentCampus || localStorage.getItem('selected_campus_name') || 'Campus San Francisco'
  );
  
  useEffect(() => {
    if (currentCampus) {
      setCampusName(currentCampus);
    }
  }, [currentCampus]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Café Americano 12oz',
      description: 'Espresso doble con agua caliente, tostado medio local.',
      category: 'Cafetería',
      rating: 4.8,
      reviewsCount: 14,
      reviews: [
        { id: 101, autor: 'Ignacio S.', rating: 5, comentario: 'Excelente temperatura y aroma ideal para la mañana.', fecha: 'Hoy' },
        { id: 102, autor: 'Camila V.', rating: 4, comentario: 'Muy buen sabor, aunque un poco demorado el retiro.', fecha: 'Ayer' }
      ],
      isFollowed: false,
      offers: [
        { cafeId: 101, cafeName: 'Cafetería Central', price: 1800 },
        { cafeId: 102, cafeName: 'Kiosko Pabellón D', price: 1750 }
      ]
    },
    {
      id: 2,
      name: 'Croissant Jamón y Queso',
      description: 'Hojaldre mantequilla horneado a diario con queso gouda.',
      category: 'Pastelería',
      rating: 4.9,
      reviewsCount: 22,
      reviews: [
        { id: 201, autor: 'Felipe M.', rating: 5, comentario: 'Siempre crujiente y caliente.', fecha: 'Hace 2 días' }
      ],
      isFollowed: false,
      offers: [
        { cafeId: 101, cafeName: 'Cafetería Central', price: 2500 }
      ]
    },
    {
      id: 3,
      name: 'Sándwich Ave Palta',
      description: 'Pechuga desmenuzada y palta fresca en pan ciabatta.',
      category: 'Sándwiches',
      rating: 4.5,
      reviewsCount: 8,
      reviews: [],
      isFollowed: false,
      offers: []
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Estado para el modal de reseñas
  const [activeReviewProduct, setActiveReviewProduct] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleAddToCart = (product, offer) => {
    const currentCartCafe = localStorage.getItem('cart_cafe_id');

    if (currentCartCafe && Number(currentCartCafe) !== offer.cafeId) {
      const confirmChange = window.confirm(
        `Tu carrito contiene productos de otra cafetería. ¿Deseas vaciarlo para pedir en "${offer.cafeName}"?`
      );
      if (!confirmChange) return;
    }

    localStorage.setItem('cart_cafe_id', offer.cafeId.toString());
    localStorage.setItem('cart_cafe_name', offer.cafeName);
    alert(`Agregaste "${product.name}" (${offer.cafeName}) al carrito.`);
  };

  const handleToggleFollow = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isFollowed: !p.isFollowed } : p))
    );
  };

  // Agregar una nueva reseña
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const nuevaReseña = {
      id: Date.now(),
      autor: localStorage.getItem('user_email')?.split('@')[0] || 'Estudiante UCT',
      rating: newRating,
      comentario: newComment,
      fecha: 'Recién'
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === activeReviewProduct.id) {
          const updatedReviews = [nuevaReseña, ...(p.reviews || [])];
          const newCount = (p.reviewsCount || 0) + 1;
          const avgRating = Number(
            (updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedReviews.length).toFixed(1)
          );
          const updatedProduct = {
            ...p,
            reviews: updatedReviews,
            reviewsCount: newCount,
            rating: avgRating
          };
          setActiveReviewProduct(updatedProduct);
          return updatedProduct;
        }
        return p;
      })
    );

    setNewComment('');
    setNewRating(5);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'TODOS' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mobile-wrapper">
      <div className="screen-container consumer-container">
        <div className="consumer-content">
          
          {/* Header Superior Móvil */}
          <header className="mobile-top-bar">
            <div className="campus-box">
              <div className="campus-icon-mini">📍</div>
              <div className="campus-text-info">
                <small>Campus actual</small>
                <h2>{campusName}</h2>
                <button 
                  type="button" 
                  className="btn-mini-link"
                  onClick={onNavigateToCampus}
                >
                  Cambiar
                </button>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-mini-cart"
              onClick={onNavigateToCart}
            >
              🛒 Carrito
            </button>
          </header>

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar café, sándwich, pastelería..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mobile-search-input"
          />

          {/* Categorías */}
          <div className="mobile-category-chips">
            {['TODOS', 'Cafetería', 'Pastelería', 'Sándwiches', 'Bebidas'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`mobile-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lista de Productos */}
          <main className="mobile-catalog-list">
            {filteredProducts.length === 0 ? (
              <div className="mobile-empty-state">
                <p>No hay productos disponibles para este filtro.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <CartasProductos
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFollow={handleToggleFollow}
                  onOpenReviews={() => setActiveReviewProduct(product)}
                />
              ))
            )}
          </main>

          {/* Modal de Reseñas y Calificaciones */}
          {activeReviewProduct && (
            <div className="review-modal-overlay">
              <div className="review-modal-card">
                <div className="modal-header">
                  <div className="modal-title-group">
                    <h3>Reseñas: {activeReviewProduct.name}</h3>
                    <div className="modal-rating-badge">
                      ⭐ {activeReviewProduct.rating || '5.0'} ({activeReviewProduct.reviewsCount || 0} opiniones)
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="modal-close-btn"
                    onClick={() => setActiveReviewProduct(null)}
                  >
                    ✕
                  </button>
                </div>

                {/* Formulario para Dejar Reseña */}
                <form className="add-review-form" onSubmit={handleAddReview}>
                  <label>Tu Calificación:</label>
                  <div className="star-rating-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= newRating ? 'selected' : ''}`}
                        onClick={() => setNewRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows="2"
                    placeholder="Escribe tu opinión sobre el producto..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />

                  <button type="submit" className="btn-submit-review">
                    Publicar Reseña
                  </button>
                </form>

                {/* Listado de comentarios */}
                <div className="reviews-history-list">
                  <h4>Opiniones de la comunidad</h4>
                  {activeReviewProduct.reviews && activeReviewProduct.reviews.length > 0 ? (
                    activeReviewProduct.reviews.map((rev) => (
                      <div key={rev.id} className="review-item">
                        <div className="review-item-header">
                          <strong>{rev.autor}</strong>
                          <span className="review-stars">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p>{rev.comentario}</p>
                        <small>{rev.fecha}</small>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">Sé el primero en dejar una reseña sobre este producto.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}