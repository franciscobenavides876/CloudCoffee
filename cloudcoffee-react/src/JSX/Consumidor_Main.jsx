import React, { useState, useEffect, useRef } from 'react';
import CartasProductos from './Cartas_Productos';
import '../CSS/Consumidor_Main.css';

export default function ConsumidorMain({ 
  onNavigateToCampus, 
  onNavigateToCart, 
  onNavigateToOrders, 
  onNavigateToProfile,
  currentCampus 
}) {
  const [campusName, setCampusName] = useState(
    currentCampus || localStorage.getItem('selected_campus_name') || 'Campus San Francisco'
  );

  const userName = localStorage.getItem('user_name') || 'Estudiante UCT';

  useEffect(() => {
    if (currentCampus) {
      setCampusName(currentCampus);
    }
  }, [currentCampus]);

  // Referencias y estados para el desplazamiento (drag-to-scroll) con el mouse
  const categoriesRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeftState(categoriesRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    categoriesRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleWheel = (e) => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollLeft += e.deltaY;
    }
  };

  const CATEGORIES = ['TODOS', 'Snacks', 'Bebidas', 'Pastelería', 'Café', 'Sándwiches'];

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Café Americano 12oz',
      description: 'Espresso doble con agua caliente, tostado medio local.',
      category: 'Café',
      isFollowed: false,
      offers: [
        { cafeId: 101, cafeName: 'Cafetería Central', location: 'Pabellón Central - Piso 1', price: 1800, inStock: true },
        { cafeId: 102, cafeName: 'Kiosko Pabellón D', location: 'Patio Central', price: 1750, inStock: true }
      ]
    },
    {
      id: 2,
      name: 'Croissant Jamón y Queso',
      description: 'Hojaldre mantequilla horneado a diario con queso gouda.',
      category: 'Pastelería',
      isFollowed: false,
      offers: [
        { cafeId: 101, cafeName: 'Cafetería Central', location: 'Pabellón Central - Piso 1', price: 2500, inStock: true }
      ]
    },
    {
      id: 3,
      name: 'Sándwich Ave Palta',
      description: 'Pechuga desmenuzada y palta fresca en pan ciabatta.',
      category: 'Sándwiches',
      isFollowed: false,
      offers: [
        { cafeId: 101, cafeName: 'Cafetería Central', location: 'Pabellón Central - Piso 1', price: 3200, inStock: false }
      ]
    },
    {
      id: 4,
      name: 'Papas Fritas Rústicas',
      description: 'Papas fritas artesanales con sal de mar.',
      category: 'Snacks',
      isFollowed: false,
      offers: [
        { cafeId: 102, cafeName: 'Kiosko Pabellón D', location: 'Patio Central', price: 1500, inStock: true }
      ]
    },
    {
      id: 5,
      name: 'Jugo Natural Naranja 300ml',
      description: 'Recién exprimido sin azúcar añadida.',
      category: 'Bebidas',
      isFollowed: false,
      offers: [
        { cafeId: 101, cafeName: 'Cafetería Central', location: 'Pabellón Central - Piso 1', price: 2000, inStock: true }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Agregar al carrito
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
    
    const savedCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const existingIndex = savedCart.findIndex(
      (item) => item.id === product.id && item.cafeId === offer.cafeId
    );
    
    if (existingIndex > -1) {
      savedCart[existingIndex].quantity += 1;
    } else {
      savedCart.push({
        id: product.id,
        name: product.name,
        price: offer.price,
        cafeId: offer.cafeId,
        cafeName: offer.cafeName,
        quantity: 1
      });
    }
    localStorage.setItem('cart_items', JSON.stringify(savedCart));
    alert(`¡"${product.name}" de ${offer.cafeName} se agregó al carrito!`);
  };

  // Alternar aviso por stock
  const handleToggleFollow = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newState = !p.isFollowed;
          alert(newState ? '¡Listo! Te avisaremos cuando haya stock disponible.' : 'Has cancelado el aviso de stock.');
          return { ...p, isFollowed: newState };
        }
        return p;
      })
    );
  };

  // Filtrado por búsqueda y categoría
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'TODOS' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mobile-wrapper">
      <div className="screen-container consumer-container">
        <div className="consumer-content">
          
          {/* Tarjeta de Perfil Superior */}
          <div className="mobile-profile-bar" onClick={onNavigateToProfile}>
            <div className="profile-box-left">
              <div className="profile-icon-circle">👤</div>
              <div className="profile-text-meta">
                <small>MI PERFIL</small>
                <strong>{userName}</strong>
                <button type="button" className="btn-profile-link">
                  Editar perfil
                </button>
              </div>
            </div>
            <span className="profile-arrow-icon">➔</span>
          </div>

          {/* Tarjeta de Campus Actual */}
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

            <div className="header-actions-col">
              <button 
                type="button" 
                className="btn-mini-cart"
                onClick={onNavigateToCart}
              >
                🛒 Carrito
              </button>
              <button 
                type="button" 
                className="btn-mini-orders"
                onClick={onNavigateToOrders}
              >
                📋 Mis Pedidos
              </button>
            </div>
          </header>

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar café, sándwich, snacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mobile-search-input"
          />

          {/* Selector de Categorías */}
          <div 
            ref={categoriesRef}
            className={`mobile-category-chips ${isMouseDown ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`mobile-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  if (!isDragging) {
                    setSelectedCategory(cat);
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Listado de Productos */}
          <main className="mobile-catalog-list">
            {filteredProducts.length === 0 ? (
              <div className="mobile-empty-state">
                <p>No hay productos disponibles en esta categoría.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <CartasProductos
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFollow={handleToggleFollow}
                />
              ))
            )}
          </main>

        </div>
      </div>
    </div>
  );
}