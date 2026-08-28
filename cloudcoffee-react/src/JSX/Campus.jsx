import React, { useState } from 'react';
import '../CSS/Campus.css';

const CAMPUS_LIST = [
  {
    id: 'sf',
    name: 'Campus San Francisco',
    address: 'Manuel Montt 056, Temuco',
    cafeterias: '3 Cafeterías activas',
    icon: '🏛️'
  },
  {
    id: 'sjpii',
    name: 'Campus San Juan Pablo II',
    address: 'Rudecindo Ortega 02950, Temuco',
    cafeterias: '2 Cafeterías activas',
    icon: '🌲'
  },
  {
    id: 'ml',
    name: 'Campus Menchaca Lira',
    address: 'Av. Alemania 0211, Temuco',
    cafeterias: '1 Cafetería activa',
    icon: '🎨'
  },
  {
    id: 'lrc',
    name: 'Campus Dr. Luis Rivas del Canto',
    address: 'Camino a Huichahue Km 2.5, Padre Las Casas',
    cafeterias: '1 Cafetería activa',
    icon: '🔬'
  }
];

export default function Campus({ onSelectCampus, onBack }) {
  const [selectedId, setSelectedId] = useState(
    localStorage.getItem('selected_campus_id') || 'sf'
  );

  const handleSelect = (campus) => {
    setSelectedId(campus.id);
    localStorage.setItem('selected_campus_id', campus.id);
    localStorage.setItem('selected_campus_name', campus.name);
    
    if (onSelectCampus) {
      onSelectCampus(campus.name);
    }
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container campus-container">
        <div className="campus-content">
          
          <button className="back-button-light" onClick={onBack} type="button">
            ← Volver al Catálogo
          </button>

          <header className="campus-header">
            <div className="campus-badge">SELECCIÓN DE SEDE</div>
            <h1 className="campus-title">¿En qué campus estás?</h1>
            <p className="campus-subtitle">
              Elige tu sede actual para ver el stock y cafeterías disponibles en tiempo real.
            </p>
          </header>

          <div className="campus-grid">
            {CAMPUS_LIST.map((campus) => {
              const isSelected = selectedId === campus.id;
              return (
                <div
                  key={campus.id}
                  className={`campus-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(campus)}
                >
                  <div className="campus-card-icon">{campus.icon}</div>
                  <div className="campus-card-info">
                    <h3>{campus.name}</h3>
                    <p className="campus-address">{campus.address}</p>
                    <span className="campus-cafeterias-count">
                      ☕ {campus.cafeterias}
                    </span>
                  </div>
                  <div className="campus-check">
                    {isSelected ? '✓' : '›'}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}