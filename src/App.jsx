import { useState, useEffect } from 'react'
import './App.css'

const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: 'Comida', icono: '🍔', colorSecundario: '#f59e0b' },
  { id: 2, nombre: 'Transporte', icono: '🚗', colorSecundario: '#3b82f6' },
  { id: 3, nombre: 'Renta', icono: '🏠', colorSecundario: '#8b5cf6' },
  { id: 4, nombre: 'Servicios', icono: '💡', colorSecundario: '#06b6d4' },
  { id: 5, nombre: 'Gustos', icono: '🎉', colorSecundario: '#ec4899' },
  { id: 6, nombre: 'Ahorro', icono: '💰', colorSecundario: '#10b981' },
  { id: 7, nombre: 'Emergencias', icono: '🚨', colorSecundario: '#ef4444' },
  { id: 8, nombre: 'Deudas', icono: '💳', colorSecundario: '#6366f1' }
]

const COLORES_PREDEFINIDOS = [
  { nombre: 'Verde', valor: '#10b981' },
  { nombre: 'Azul', valor: '#3b82f6' },
  { nombre: 'Morado', valor: '#8b5cf6' },
  { nombre: 'Rosa', valor: '#ec4899' },
  { nombre: 'Naranja', valor: '#f97316' },
  { nombre: 'Cian', valor: '#06b6d4' },
  { nombre: 'Índigo', valor: '#6366f1' }
]

const FRECUENCIAS = {
  semanal: { valor: 1, label: 'Semanal', divisor: 4.33 },
  quincenal: { valor: 2, label: 'Quincenal', divisor: 2.17 },
  mensual: { valor: 3, label: 'Mensual', divisor: 1 }
}

// Función para generar variantes de un color
const generarVariantesColor = (colorHex) => {
  // Conversión simple - en producción usar una librería como chroma.js
  return {
    primary: colorHex,
    light: ajustarBrillo(colorHex, 20),
    dark: ajustarBrillo(colorHex, -20),
    lighter: ajustarBrillo(colorHex, 40)
  }
}

const ajustarBrillo = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + 
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
}

function App() {
  // Estado para ingresos y frecuencia
  const [ingreso, setIngreso] = useState(() => {
    const guardado = localStorage.getItem('ingreso')
    return guardado ? parseFloat(guardado) : 0
  })
  const [frecuencia, setFrecuencia] = useState(() => {
    return localStorage.getItem('frecuencia') || 'mensual'
  })
  
  // Estado para categorías y sobres
  const [categorias, setCategorias] = useState(() => {
    const guardado = localStorage.getItem('categorias')
    return guardado ? JSON.parse(guardado) : CATEGORIAS_DEFAULT.map(cat => ({
      ...cat,
      gastoMaximo: 0,
      asignadoActual: 0,
      gastadoAcumulado: 0
    }))
  })
  
  // Estado para vista activa
  const [vistaActiva, setVistaActiva] = useState('inicio')
  
  // Estado para color personalizado
  const [colorPersonalizado, setColorPersonalizado] = useState(() => {
    return localStorage.getItem('colorApp') || '#10b981'
  })
  
  // Estado para movimiento nuevo
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: 'gasto',
    monto: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
    metodoPago: 'efectivo',
    nota: ''
  })
  
  // Actualizar variables CSS cuando cambia el color
  useEffect(() => {
    const root = document.documentElement
    const variantes = generarVariantesColor(colorPersonalizado)
    
    root.style.setProperty('--color-primary', variantes.primary)
    root.style.setProperty('--color-primary-light', variantes.light)
    root.style.setProperty('--color-primary-dark', variantes.dark)
    root.style.setProperty('--color-primary-lighter', variantes.lighter)
    root.style.setProperty('--color-primary-gradient', `linear-gradient(135deg, ${variantes.primary} 0%, ${variantes.dark} 100%)`)
    
    localStorage.setItem('colorApp', colorPersonalizado)
  }, [colorPersonalizado])
  
  // Guardar en localStorage cuando cambien las categorías
  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias))
  }, [categorias])
  
  // Guardar ingreso y frecuencia
  useEffect(() => {
    localStorage.setItem('ingreso', ingreso.toString())
    localStorage.setItem('frecuencia', frecuencia)
  }, [ingreso, frecuencia])
  
  // Calcular aportación sugerida basada en frecuencia de ingreso
  const calcularAportacion = (gastoMaximo, freq) => {
    const frecuenciaData = FRECUENCIAS[freq]
    if (!frecuenciaData || gastoMaximo <= 0) return 0
    return Math.round((gastoMaximo / frecuenciaData.divisor) * 100) / 100
  }
  
  // Total de gastos máximos
  const totalGastosMaximos = categorias.reduce((sum, cat) => sum + cat.gastoMaximo, 0)
  
  // Total asignado actualmente
  const totalAsignado = categorias.reduce((sum, cat) => sum + cat.asignadoActual, 0)
  
  // Total gastado
  const totalGastado = categorias.reduce((sum, cat) => sum + cat.gastadoAcumulado, 0)
  
  // Saldo disponible
  const saldoDisponible = ingreso - totalAsignado
  
  // Progreso del presupuesto mensual
  const progresoPresupuesto = ingreso > 0 ? Math.min((totalGastado / ingreso) * 100, 100) : 0
  
  // Actualizar gasto máximo de una categoría
  const actualizarGastoMaximo = (id, valor) => {
    setCategorias(prev => prev.map(cat => 
      cat.id === id ? { ...cat, gastoMaximo: parseFloat(valor) || 0 } : cat
    ))
  }
  
  // Asignar dinero a un sobre
  const asignarDinero = (id, cantidad) => {
    setCategorias(prev => prev.map(cat =>
      cat.id === id ? { ...cat, asignadoActual: cat.asignadoActual + parseFloat(cantidad) } : cat
    ))
  }
  
  // Registrar gasto
  const registrarGasto = (id, cantidad) => {
    setCategorias(prev => prev.map(cat =>
      cat.id === id && cat.asignadoActual >= cantidad
        ? { 
            ...cat, 
            asignadoActual: cat.asignadoActual - cantidad,
            gastadoAcumulado: cat.gastadoAcumulado + parseFloat(cantidad)
          }
        : cat
    ))
  }
  
  // Guardar movimiento
  const guardarMovimiento = () => {
    if (!nuevoMovimiento.monto || !nuevoMovimiento.categoria) {
      alert('Por favor completa el monto y la categoría')
      return
    }
    
    const categoriaId = parseInt(nuevoMovimiento.categoria)
    const monto = parseFloat(nuevoMovimiento.monto)
    
    if (nuevoMovimiento.tipo === 'gasto') {
      registrarGasto(categoriaId, monto)
    } else {
      asignarDinero(categoriaId, monto)
    }
    
    // Resetear formulario
    setNuevoMovimiento({
      tipo: 'gasto',
      monto: '',
      categoria: '',
      fecha: new Date().toISOString().split('T')[0],
      metodoPago: 'efectivo',
      nota: ''
    })
    
    alert('Movimiento guardado exitosamente')
  }
  
  // Resetear datos
  const resetearDatos = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos?')) {
      localStorage.removeItem('categorias')
      setCategorias(CATEGORIAS_DEFAULT.map(cat => ({
        ...cat,
        gastoMaximo: 0,
        asignadoActual: 0,
        gastadoAcumulado: 0
      })))
      setIngreso(0)
    }
  }
  
  // Formatear moneda
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor)
  }
  
  return (
    <div className="app">
      <header className="header">
        <h1>💰 Organigastos</h1>
        <p className="subtitle">Controla tus finanzas con estilo</p>
      </header>
      
      {/* Navegación inferior estilo móvil */}
      <nav className="nav">
        <button 
          className={vistaActiva === 'inicio' ? 'active' : ''}
          onClick={() => setVistaActiva('inicio')}
        >
          🏠 Inicio
        </button>
        <button 
          className={vistaActiva === 'sobres' ? 'active' : ''}
          onClick={() => setVistaActiva('sobres')}
        >
          💼 Sobres
        </button>
        <button 
          className={vistaActiva === 'movimientos' ? 'active' : ''}
          onClick={() => setVistaActiva('movimientos')}
        >
          📝 Movimientos
        </button>
        <button 
          className={vistaActiva === 'perfil' ? 'active' : ''}
          onClick={() => setVistaActiva('perfil')}
        >
          👤 Perfil
        </button>
      </nav>
      
      <main className="main-content">
        {/* VISTA DE INICIO */}
        {vistaActiva === 'inicio' && (
          <section className="inicio">
            {/* Tarjeta principal */}
            <div className="tarjeta-principal">
              <p className="titulo">Saldo Disponible</p>
              <p className="saldo">{formatoMoneda(saldoDisponible)}</p>
              <p className="ilustracion">💵</p>
            </div>
            
            {/* Resumen de tarjetas */}
            <div className="resumen-cards">
              <div className="card resumen">
                <h3>Presupuesto Mensual</h3>
                <p className="monto">{formatoMoneda(ingreso)}</p>
              </div>
              
              <div className="card resumen">
                <h3>Total Gastado</h3>
                <p className="monto">{formatoMoneda(totalGastado)}</p>
              </div>
            </div>
            
            {/* Barra de progreso mensual */}
            <div className="progreso-mensual-container">
              <h3>Progreso del Presupuesto Mensual</h3>
              <div className="progreso-bar">
                <div 
                  className="progreso-fill" 
                  style={{ width: `${progresoPresupuesto}%` }}
                ></div>
              </div>
              <div className="progreso-info">
                <span>{formatoMoneda(totalGastado)} gastados</span>
                <span>{formatoMoneda(ingreso)} presupuesto</span>
              </div>
            </div>
            
            {/* Metas de ahorro */}
            <div className="metas-ahorro">
              <h3>🎯 Metas de Ahorro</h3>
              {categorias.filter(cat => cat.nombre === 'Ahorro' || cat.nombre === 'Emergencias').map(cat => (
                <div key={cat.id} className="meta-item">
                  <div className="meta-header">
                    <span className="icono">{cat.icono}</span>
                    <span className="nombre">{cat.nombre}</span>
                  </div>
                  <div className="progreso-bar">
                    <div 
                      className="progreso-fill" 
                      style={{ 
                        width: `${cat.gastoMaximo > 0 ? (cat.asignadoActual / cat.gastoMaximo) * 100 : 0}%`,
                        backgroundColor: cat.colorSecundario || 'var(--color-primary)'
                      }}
                    ></div>
                  </div>
                  <div className="progreso-info">
                    <span>{formatoMoneda(cat.asignadoActual)}</span>
                    <span>{formatoMoneda(cat.gastoMaximo)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumen de sobres */}
            <div className="categorias-resumen">
              <h3>📊 Resumen de Sobres</h3>
              {categorias.filter(cat => cat.gastoMaximo > 0).map(cat => (
                <div key={cat.id} className="categoria-item">
                  <div className="categoria-header">
                    <span className="icono">{cat.icono}</span>
                    <span className="nombre">{cat.nombre}</span>
                  </div>
                  <div className="categoria-datos">
                    <div className="dato">
                      <small>Presupuesto:</small>
                      <strong>{formatoMoneda(cat.gastoMaximo)}</strong>
                    </div>
                    <div className="dato">
                      <small>Gastado:</small>
                      <strong style={{ color: cat.gastadoAcumulado > cat.gastoMaximo * 0.8 ? 'var(--color-danger)' : 'var(--color-text)' }}>
                        {formatoMoneda(cat.gastadoAcumulado)}
                      </strong>
                    </div>
                    <div className="dato">
                      <small>Disponible:</small>
                      <strong style={{ color: cat.asignadoActual <= 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                        {formatoMoneda(cat.asignadoActual)}
                      </strong>
                    </div>
                  </div>
                  <div className="progreso-bar">
                    <div 
                      className="progreso-fill" 
                      style={{ 
                        width: `${cat.gastoMaximo > 0 ? (cat.gastadoAcumulado / cat.gastoMaximo) * 100 : 0}%`,
                        backgroundColor: cat.asignadoActual <= 0 ? 'var(--color-danger)' : cat.asignadoActual < cat.gastoMaximo * 0.3 ? 'var(--color-warning)' : 'var(--color-success)'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* VISTA DE SOBRES */}
        {vistaActiva === 'sobres' && (
          <section className="sobres">
            <h2>💼 Mis Sobres</h2>
            <p className="descripcion">
              Administra el presupuesto de cada categoría
            </p>
            
            {categorias.map(cat => (
              <div key={cat.id} className="sobre-card">
                <div className="sobre-header">
                  <span className="icono">{cat.icono}</span>
                  <h3 style={{ color: cat.colorSecundario }}>{cat.nombre}</h3>
                </div>
                
                <div className="sobre-info">
                  <div className="sobre-dato">
                    <small>Presupuesto:</small>
                    <strong>{formatoMoneda(cat.gastoMaximo)}</strong>
                  </div>
                  <div className="sobre-dato">
                    <small>Gastado:</small>
                    <strong style={{ color: cat.gastadoAcumulado > cat.gastoMaximo ? 'var(--color-danger)' : 'var(--color-text)' }}>
                      {formatoMoneda(cat.gastadoAcumulado)}
                    </strong>
                  </div>
                  <div className="sobre-dato">
                    <small>Disponible:</small>
                    <strong className={cat.asignadoActual <= 0 ? 'negativo' : ''}>
                      {formatoMoneda(cat.asignadoActual)}
                    </strong>
                  </div>
                </div>
                
                <div className="progreso-bar">
                  <div 
                    className="progreso-fill" 
                    style={{ 
                      width: `${cat.gastoMaximo > 0 ? (cat.gastadoAcumulado / cat.gastoMaximo) * 100 : 0}%`,
                      backgroundColor: cat.colorSecundario || 'var(--color-primary)'
                    }}
                  ></div>
                </div>
                
                <div className="sobre-acciones">
                  <div className="accion-grupo">
                    <label>Asignar dinero:</label>
                    <div className="input-con-botón">
                      <input
                        type="number"
                        placeholder="Cantidad"
                        min="0"
                        step="0.01"
                        id={`asignar-${cat.id}`}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`asignar-${cat.id}`)
                          const cantidad = parseFloat(input.value)
                          if (cantidad > 0) {
                            asignarDinero(cat.id, cantidad)
                            input.value = ''
                          }
                        }}
                        className="btn-asignar"
                      >
                        ➕ Asignar
                      </button>
                    </div>
                  </div>
                  
                  <div className="accion-grupo">
                    <label>Registrar gasto:</label>
                    <div className="input-con-botón">
                      <input
                        type="number"
                        placeholder="Cantidad"
                        min="0"
                        step="0.01"
                        id={`gastar-${cat.id}`}
                        disabled={cat.asignadoActual <= 0}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`gastar-${cat.id}`)
                          const cantidad = parseFloat(input.value)
                          if (cantidad > 0 && cantidad <= cat.asignadoActual) {
                            registrarGasto(cat.id, cantidad)
                            input.value = ''
                          } else if (cantidad > cat.asignadoActual) {
                            alert('No hay suficiente dinero en este sobre')
                          }
                        }}
                        className="btn-gastar"
                        disabled={cat.asignadoActual <= 0}
                      >
                        💸 Gastar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
        
        {/* VISTA DE MOVIMIENTOS */}
        {vistaActiva === 'movimientos' && (
          <section className="movimientos">
            <h2>📝 Registrar Movimiento</h2>
            <p className="descripcion">
              Ingresa un nuevo ingreso o gasto
            </p>
            
            <div className="form-group">
              <label>Tipo de movimiento:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={nuevoMovimiento.tipo === 'gasto' ? 'btn-primary active' : 'btn-primary'}
                  onClick={() => setNuevoMovimiento({...nuevoMovimiento, tipo: 'gasto'})}
                  style={{
                    flex: 1,
                    background: nuevoMovimiento.tipo === 'gasto' ? 'var(--color-warning)' : 'var(--color-surface)',
                    color: nuevoMovimiento.tipo === 'gasto' ? 'white' : 'var(--color-text)',
                    border: '2px solid var(--color-border)'
                  }}
                >
                  💸 Gasto
                </button>
                <button
                  className={nuevoMovimiento.tipo === 'ingreso' ? 'btn-primary active' : 'btn-primary'}
                  onClick={() => setNuevoMovimiento({...nuevoMovimiento, tipo: 'ingreso'})}
                  style={{
                    flex: 1,
                    background: nuevoMovimiento.tipo === 'ingreso' ? 'var(--color-success)' : 'var(--color-surface)',
                    color: nuevoMovimiento.tipo === 'ingreso' ? 'white' : 'var(--color-text)',
                    border: '2px solid var(--color-border)'
                  }}
                >
                  💰 Ingreso
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="monto">Monto:</label>
              <input
                type="number"
                id="monto"
                value={nuevoMovimiento.monto}
                onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, monto: e.target.value})}
                placeholder="Ej: 500.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="categoria">Categoría:</label>
              <select
                id="categoria"
                value={nuevoMovimiento.categoria}
                onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, categoria: e.target.value})}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icono} {cat.nombre}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                value={nuevoMovimiento.fecha}
                onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, fecha: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="metodoPago">Método de pago:</label>
              <select
                id="metodoPago"
                value={nuevoMovimiento.metodoPago}
                onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, metodoPago: e.target.value})}
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta de Débito</option>
                <option value="credito">Tarjeta de Crédito</option>
                <option value="transferencia">Transferencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="nota">Nota (opcional):</label>
              <input
                type="text"
                id="nota"
                value={nuevoMovimiento.nota}
                onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, nota: e.target.value})}
                placeholder="Agrega una descripción..."
              />
            </div>
            
            <button className="btn-primary" onClick={guardarMovimiento} style={{ width: '100%', marginTop: '20px' }}>
              {nuevoMovimiento.tipo === 'gasto' ? '💸 Registrar Gasto' : '💰 Registrar Ingreso'}
            </button>
          </section>
        )}
        
        {/* VISTA DE PERFIL */}
        {vistaActiva === 'perfil' && (
          <section className="perfil">
            <h2>👤 Perfil y Configuración</h2>
            
            {/* Sección de apariencia */}
            <div className="color-picker-section">
              <h3>🎨 Color de la app</h3>
              <p className="descripcion">Elige tu color favorito y personaliza toda la interfaz</p>
              
              <div className="color-options">
                {COLORES_PREDEFINIDOS.map(color => (
                  <button
                    key={color.valor}
                    className={`color-option ${colorPersonalizado === color.valor ? 'selected' : ''}`}
                    style={{ backgroundColor: color.valor }}
                    onClick={() => setColorPersonalizado(color.valor)}
                    title={color.nombre}
                  />
                ))}
              </div>
              
              <div className="color-custom-input">
                <input
                  type="color"
                  value={colorPersonalizado}
                  onChange={(e) => setColorPersonalizado(e.target.value)}
                />
                <input
                  type="text"
                  value={colorPersonalizado.toUpperCase()}
                  onChange={(e) => {
                    const valor = e.target.value
                    if (/^#[0-9A-F]{0,6}$/i.test(valor)) {
                      setColorPersonalizado(valor)
                    }
                  }}
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
            </div>
            
            {/* Configuración de ingresos */}
            <div className="configurar">
              <h3>⚙️ Configuración de Ingresos</h3>
              
              <div className="form-group">
                <label htmlFor="ingreso-config">Ingresa tu ingreso:</label>
                <input
                  type="number"
                  id="ingreso-config"
                  value={ingreso}
                  onChange={(e) => setIngreso(parseFloat(e.target.value) || 0)}
                  placeholder="Ej: 15000"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="frecuencia-config">Frecuencia de pago:</label>
                <select
                  id="frecuencia-config"
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                >
                  {Object.entries(FRECUENCIAS).map(([key, data]) => (
                    <option key={key} value={key}>{data.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="info-box">
                <h3>💡 Información</h3>
                <p>
                  Tu ingreso {FRECUENCIAS[frecuencia]?.label.toLowerCase()} es de <strong>{formatoMoneda(ingreso)}</strong>.
                  Esto se usará para calcular las aportaciones sugeridas a cada sobre.
                </p>
              </div>
            </div>
            
            {/* Configurar categorías */}
            <div className="configurar-categorias">
              <h3>📊 Configurar Categorías</h3>
              <p className="descripcion">
                Ingresa el gasto máximo mensual que has tenido en cada categoría:
              </p>
              
              {categorias.map(cat => (
                <div key={cat.id} className="form-group categoria-config">
                  <label htmlFor={`gasto-${cat.id}`}>
                    {cat.icono} {cat.nombre}
                  </label>
                  <input
                    type="number"
                    id={`gasto-${cat.id}`}
                    value={cat.gastoMaximo || ''}
                    onChange={(e) => actualizarGastoMaximo(cat.id, e.target.value)}
                    placeholder="Ej: 2000"
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
            
            <button className="btn-reset" onClick={resetearDatos}>
              🗑️ Resetear Todos los Datos
            </button>
          </section>
        )}
      </main>
      
      <footer className="footer">
        <p>Organigastos © 2024 - Controla tus finanzas 💪</p>
      </footer>
    </div>
  )
}

export default App
