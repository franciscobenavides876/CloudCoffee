import React, { useState } from 'react';
import '../CSS/Registro_Sesion.css';

export default function RegistroSesion({ onBack, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);

    // Payload exacto esperado por POST /auth/register
    const payload = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim().toLowerCase(),
      telefono: formData.telefono.trim(),
      password: formData.password
    };

    setTimeout(() => {
      setCargando(false);
      
      // Sincroniza datos base locales para Mi_Perfil y Consumidor_Main
      const fullName = `${payload.nombre} ${payload.apellido}`;
      localStorage.setItem('user_name', fullName);
      localStorage.setItem('user_email', payload.email);
      localStorage.setItem('user_phone', payload.telefono);
      localStorage.setItem(
        'user_profile_data',
        JSON.stringify({
          nombre: fullName,
          email: payload.email,
          telefono: payload.telefono,
          carrera: 'Ingeniería Civil en Informática'
        })
      );

      alert(`¡Cuenta registrada exitosamente para ${payload.nombre}! Ya puedes iniciar sesión.`);
      onNavigateToLogin();
    }, 1000);
  };

  return (
    <div className="mobile-wrapper">
      <div className="screen-container register-container">
        <button className="back-button" onClick={onBack} type="button">
          ← Volver
        </button>

        <div className="register-content">
          <header className="header-section">
            <h1 className="title">
              Crear <span className="highlight-text">Cuenta</span>
            </h1>
            <p className="subtitle">
              Regístrate para comprar y pedir tu café sin filas en los campus UCT.
            </p>
          </header>

          {error && <div className="error-message">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            {/* Campos separados: Nombre y Apellido en fila doble */}
            <div className="input-row-double">
              <div className="input-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej. Francisca"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  placeholder="Ej. Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Correo Institucional o Personal</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@uct.cl"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="telefono">Teléfono de Contacto</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="+56 9 1234 5678"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={cargando}
            >
              {cargando ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <footer className="footer-section">
            <p className="footer-text">
              ¿Ya tienes cuenta?{' '}
              <button 
                type="button" 
                className="link-highlight"
                onClick={onNavigateToLogin}
              >
                Inicia sesión aquí
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}