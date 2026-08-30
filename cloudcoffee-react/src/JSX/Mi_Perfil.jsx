import React, { useState } from 'react';
import '../CSS/Mi_Perfil.css';

export default function MiPerfil({ onBack, onLogout }) {
  const [perfil, setPerfil] = useState(() => {
    const saved = localStorage.getItem('user_profile_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      nombre: localStorage.getItem('user_name') || 'Estudiante UCT',
      email: localStorage.getItem('user_email') || 'estudiante@uct.cl',
      telefono: localStorage.getItem('user_phone') || '+56 9 1234 5678',
      carrera: 'Ingeniería Civil en Informática'
    };
  });

  const [editando, setEditando] = useState(false);
  const [nuevoTelefono, setNuevoTelefono] = useState(perfil.telefono);

  const handleGuardar = (e) => {
    e.preventDefault();
    const updatedPerfil = {
      ...perfil,
      telefono: nuevoTelefono.trim()
    };

    setPerfil(updatedPerfil);
    localStorage.setItem('user_profile_data', JSON.stringify(updatedPerfil));
    localStorage.setItem('user_phone', updatedPerfil.telefono);
    setEditando(false);
    alert('✓ Número de teléfono actualizado con éxito.');
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container profile-container">
        
        {/* Botón Volver */}
        <button className="back-button-light" onClick={onBack} type="button">
          ← Volver
        </button>

        {/* Encabezado */}
        <header className="profile-header">
          <div className="profile-badge">CUENTA</div>
          <h1 className="profile-title">Mi Perfil</h1>
          <p className="profile-subtitle">Gestiona tu información de contacto institucional.</p>
        </header>

        {/* Tarjeta de Perfil */}
        <div className="profile-card">
          <div className="profile-avatar-row">
            <div className="profile-avatar">
              <span>👤</span>
            </div>
            <div className="profile-main-meta">
              <h3>{perfil.nombre}</h3>
              <small>{perfil.carrera}</small>
              <span className="profile-tag-student">Estudiante UCT</span>
            </div>
          </div>

          {!editando ? (
            <div className="profile-view-data">
              <div className="profile-info-row">
                <span className="info-label">Nombre del Titular:</span>
                <strong>{perfil.nombre}</strong>
              </div>

              <div className="profile-info-row">
                <span className="info-label">Correo Institucional:</span>
                <strong>{perfil.email}</strong>
              </div>

              <div className="profile-info-row">
                <span className="info-label">Teléfono de Contacto:</span>
                <strong>{perfil.telefono || 'No registrado'}</strong>
              </div>

              <button
                type="button"
                className="btn-edit-profile"
                onClick={() => {
                  setNuevoTelefono(perfil.telefono);
                  setEditando(true);
                }}
              >
                ✏️ Cambiar Número de Teléfono
              </button>
            </div>
          ) : (
            <form onSubmit={handleGuardar} className="profile-edit-form">
              <div className="form-group">
                <label>Nombre Completo (No editable)</label>
                <input
                  type="text"
                  value={perfil.nombre}
                  disabled
                  readOnly
                  className="input-readonly"
                />
                <small className="field-hint">El nombre institucional está vinculado a tu cuenta y no puede modificarse.</small>
              </div>

              <div className="form-group">
                <label>Nuevo Teléfono de Contacto *</label>
                <input
                  type="text"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  placeholder="+56 9 ..."
                  required
                  autoFocus
                />
              </div>

              <div className="profile-edit-buttons">
                <button
                  type="button"
                  className="btn-cancel-edit"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save-edit">
                  Guardar Número
                </button>
              </div>
            </form>
          )}

          <div className="profile-footer-actions">
            <button
              type="button"
              className="btn-logout-profile"
              onClick={onLogout}
            >
              Cerrar Sesión ⎋
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}