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

  // Modos: 'vista' | 'editar_telefono' | 'cambiar_password'
  const [modoEdicion, setModoEdicion] = useState('vista');

  // Estados de edición
  const [nuevoTelefono, setNuevoTelefono] = useState(perfil.telefono);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  // Guardar teléfono
  const handleGuardarTelefono = (e) => {
    e.preventDefault();
    const updatedPerfil = {
      ...perfil,
      telefono: nuevoTelefono.trim()
    };

    setPerfil(updatedPerfil);
    localStorage.setItem('user_profile_data', JSON.stringify(updatedPerfil));
    localStorage.setItem('user_phone', updatedPerfil.telefono);
    setModoEdicion('vista');
    alert('✓ Número de teléfono actualizado con éxito.');
  };

  // Guardar nueva contraseña
  const handleGuardarPassword = (e) => {
    e.preventDefault();
    if (passwordNueva.length < 6) {
      setErrorPassword('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordNueva !== passwordConfirmar) {
      setErrorPassword('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    // Limpieza de campos tras actualización simulada
    setPasswordActual('');
    setPasswordNueva('');
    setPasswordConfirmar('');
    setErrorPassword('');
    setModoEdicion('vista');
    alert('✓ Tu contraseña ha sido actualizada correctamente.');
  };

  const handleCancelar = () => {
    setNuevoTelefono(perfil.telefono);
    setPasswordActual('');
    setPasswordNueva('');
    setPasswordConfirmar('');
    setErrorPassword('');
    setModoEdicion('vista');
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
          <p className="profile-subtitle">Gestiona tu información de contacto y seguridad.</p>
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

          {/* 1. MODO LECTURA */}
          {modoEdicion === 'vista' && (
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

              <div className="profile-actions-stack">
                <button
                  type="button"
                  className="btn-edit-profile"
                  onClick={() => {
                    setNuevoTelefono(perfil.telefono);
                    setModoEdicion('editar_telefono');
                  }}
                >
                  ✏️ Cambiar Número de Teléfono
                </button>

                <button
                  type="button"
                  className="btn-edit-profile btn-edit-pwd"
                  onClick={() => setModoEdicion('cambiar_password')}
                >
                  🔒 Cambiar Contraseña
                </button>
              </div>
            </div>
          )}

          {/* 2. MODO EDICIÓN DE TELÉFONO */}
          {modoEdicion === 'editar_telefono' && (
            <form onSubmit={handleGuardarTelefono} className="profile-edit-form">
              <div className="form-group">
                <label>Nombre Completo (No editable)</label>
                <input
                  type="text"
                  value={perfil.nombre}
                  disabled
                  readOnly
                  className="input-readonly"
                />
                <small className="field-hint">
                  El nombre institucional está vinculado a tu cuenta y no puede modificarse.
                </small>
              </div>

              <div className="form-group">
                <label>Nuevo Teléfono de Contacto *</label>
                <input
                  type="tel"
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
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save-edit">
                  Guardar Número
                </button>
              </div>
            </form>
          )}

          {/* 3. MODO CAMBIO DE CONTRASEÑA */}
          {modoEdicion === 'cambiar_password' && (
            <form onSubmit={handleGuardarPassword} className="profile-edit-form">
              <h4 className="subform-title">Actualizar Contraseña</h4>

              {errorPassword && (
                <div className="error-message" style={{ marginBottom: '0.6rem' }}>
                  {errorPassword}
                </div>
              )}

              <div className="form-group">
                <label>Contraseña Actual *</label>
                <input
                  type="password"
                  value={passwordActual}
                  onChange={(e) => {
                    setPasswordActual(e.target.value);
                    if (errorPassword) setErrorPassword('');
                  }}
                  placeholder="Ingresa tu clave actual"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Nueva Contraseña *</label>
                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => {
                    setPasswordNueva(e.target.value);
                    if (errorPassword) setErrorPassword('');
                  }}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña *</label>
                <input
                  type="password"
                  value={passwordConfirmar}
                  onChange={(e) => {
                    setPasswordConfirmar(e.target.value);
                    if (errorPassword) setErrorPassword('');
                  }}
                  placeholder="Repite la nueva clave"
                  required
                />
              </div>

              <div className="profile-edit-buttons">
                <button
                  type="button"
                  className="btn-cancel-edit"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save-edit">
                  Actualizar Clave
                </button>
              </div>
            </form>
          )}

          {/* Botón Cerrar Sesión */}
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