import { useState, useEffect } from 'react'
import './App.css'

const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: 'Comida', icono: '🍔' },
  { id: 2, nombre: 'Transporte', icono: '🚗' },
  { id: 3, nombre: 'Renta', icono: '🏠' },
  { id: 4, nombre: 'Servicios', icono: '💡' },
  { id: 5, nombre: 'Gustos', icono: '🎉' },
  { id: 6, nombre: 'Ahorro', icono: '💰' },
  { id: 7, nombre: 'Emergencias', icono: '🚨' },
  { id: 8, nombre: 'Deudas', icono: '💳' }
]

const FRECUENCIAS = {
  semanal: { valor: 1, label: 'Semanal', divisor: 4.33 },
  quincenal: { valor: 2, label: 'Quincenal', divisor: 2.17 },
  mensual: { valor: 3, label: 'Mensual', divisor: 1 }
}

function App() {
  // Estado para ingresos y frecuencia
  const [ingreso, setIngreso] = useState(0)
  const [frecuencia, setFrecuencia] = useState('mensual')
  
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
  const [vistaActiva, setVistaActiva] = useState('dashboard')
  
  // Guardar en localStorage cuando cambien las categorías
  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias))
  }, [categorias])
  
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
        <h1>📊 OrganiGastos</h1>
        <p className="subtitle">Sistema de Sobres Virtuales</p>
      </header>
      
      <nav className="nav">
        <button 
          className={vistaActiva === 'dashboard' ? 'active' : ''}
          onClick={() => setVistaActiva('dashboard')}
        >
          📈 Dashboard
        </button>
        <button 
          className={vistaActiva === 'configurar' ? 'active' : ''}
          onClick={() => setVistaActiva('configurar')}
        >
          ⚙️ Configurar
        </button>
        <button 
          className={vistaActiva === 'sobres' ? 'active' : ''}
          onClick={() => setVistaActiva('sobres')}
        >
          💼 Sobres
        </button>
        <button 
          className={vistaActiva === 'calcular' ? 'active' : ''}
          onClick={() => setVistaActiva('calcular')}
        >
          🧮 Calcular
        </button>
      </nav>
      
      <main className="main-content">
        {vistaActiva === 'dashboard' && (
          <section className="dashboard">
            <h2>Resumen General</h2>
            
            <div className="resumen-cards">
              <div className="card resumen">
                <h3>Ingreso {FRECUENCIAS[frecuencia]?.label}</h3>
                <p className="monto">{formatoMoneda(ingreso)}</p>
              </div>
              
              <div className="card resumen">
                <h3>Total Gastos Máx.</h3>
                <p className="monto">{formatoMoneda(totalGastosMaximos)}</p>
              </div>
              
              <div className="card resumen">
                <h3>Total Asignado</h3>
                <p className="monto">{formatoMoneda(totalAsignado)}</p>
              </div>
              
              <div className="card resumen">
                <h3>Total Gastado</h3>
                <p className="monto">{formatoMoneda(totalGastado)}</p>
              </div>
            </div>
            
            <div className="categorias-resumen">
              <h3>Sobres por Categoría</h3>
              {categorias.map(cat => (
                <div key={cat.id} className="categoria-item">
                  <div className="categoria-header">
                    <span className="icono">{cat.icono}</span>
                    <span className="nombre">{cat.nombre}</span>
                  </div>
                  <div className="categoria-datos">
                    <div className="dato">
                      <small>Máximo:</small>
                      <strong>{formatoMoneda(cat.gastoMaximo)}</strong>
                    </div>
                    <div className="dato">
                      <small>Disponible:</small>
                      <strong>{formatoMoneda(cat.asignadoActual)}</strong>
                    </div>
                    <div className="dato">
                      <small>Gastado:</small>
                      <strong>{formatoMoneda(cat.gastadoAcumulado)}</strong>
                    </div>
                  </div>
                  <div className="progreso-bar">
                    <div 
                      className="progreso-fill" 
                      style={{ 
                        width: `${cat.gastoMaximo > 0 ? (cat.gastadoAcumulado / cat.gastoMaximo) * 100 : 0}%`,
                        backgroundColor: cat.asignadoActual <= 0 ? '#ef4444' : cat.asignadoActual < cat.gastoMaximo * 0.3 ? '#f59e0b' : '#10b981'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn-reset" onClick={resetearDatos}>
              🗑️ Resetear Todos los Datos
            </button>
          </section>
        )}
        
        {vistaActiva === 'configurar' && (
          <section className="configurar">
            <h2>Configuración de Ingresos</h2>
            
            <div className="form-group">
              <label htmlFor="ingreso">Ingresa tu ingreso:</label>
              <input
                type="number"
                id="ingreso"
                value={ingreso}
                onChange={(e) => setIngreso(parseFloat(e.target.value) || 0)}
                placeholder="Ej: 15000"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="frecuencia">Frecuencia de pago:</label>
              <select
                id="frecuencia"
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
            
            <h2>Configurar Categorías</h2>
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
          </section>
        )}
        
        {vistaActiva === 'sobres' && (
          <section className="sobres">
            <h2>Gestión de Sobres</h2>
            <p className="descripcion">
              Asigna dinero a cada sobre y registra tus gastos
            </p>
            
            {categorias.map(cat => (
              <div key={cat.id} className="sobre-card">
                <div className="sobre-header">
                  <span className="icono">{cat.icono}</span>
                  <h3>{cat.nombre}</h3>
                </div>
                
                <div className="sobre-info">
                  <div className="sobre-dato">
                    <small>Disponible:</small>
                    <strong className={cat.asignadoActual <= 0 ? 'negativo' : ''}>
                      {formatoMoneda(cat.asignadoActual)}
                    </strong>
                  </div>
                  <div className="sobre-dato">
                    <small>Gastado este mes:</small>
                    <strong>{formatoMoneda(cat.gastadoAcumulado)}</strong>
                  </div>
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
        
        {vistaActiva === 'calcular' && (
          <section className="calcular">
            <h2>Calculadora de Aportaciones</h2>
            <p className="descripcion">
              Basado en tu frecuencia de ingreso, calcula cuánto debes aportar a cada sobre
            </p>
            
            <div className="info-box">
              <h3>Tu configuración actual</h3>
              <p>
                Ingreso: <strong>{formatoMoneda(ingreso)}</strong> ({FRECUENCIAS[frecuencia]?.label.toLowerCase()})
              </p>
              <p>
                Total gastos máximos mensuales: <strong>{formatoMoneda(totalGastosMaximos)}</strong>
              </p>
              {totalGastosMaximos > ingreso && (
                <p className="alerta">
                  ⚠️ Tus gastos máximos superan tus ingresos. Considera ajustar tus categorías.
                </p>
              )}
            </div>
            
            <h3>Aportaciones Sugeridas</h3>
            <div className="tabla-aportaciones">
              <table>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Gasto Máx.</th>
                    <th>Aportación {FRECUENCIAS[frecuencia]?.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.icono} {cat.nombre}</td>
                      <td>{formatoMoneda(cat.gastoMaximo)}</td>
                      <td className="aporte-sugerido">
                        {formatoMoneda(calcularAportacion(cat.gastoMaximo, frecuencia))}
                      </td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>{formatoMoneda(totalGastosMaximos)}</strong></td>
                    <td><strong>{formatoMoneda(categorias.reduce((sum, cat) => sum + calcularAportacion(cat.gastoMaximo, frecuencia), 0))}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="formula-info">
              <h3>📐 ¿Cómo se calcula?</h3>
              <p>
                La aportación sugerida se calcula dividiendo el gasto máximo mensual entre el número de periodos de pago al mes:
              </p>
              <ul>
                <li><strong>Semanal:</strong> Gasto Máximo ÷ 4.33 semanas</li>
                <li><strong>Quincenal:</strong> Gasto Máximo ÷ 2.17 quincenas</li>
                <li><strong>Mensual:</strong> Gasto Máximo ÷ 1 mes</li>
              </ul>
            </div>
          </section>
        )}
      </main>
      
      <footer className="footer">
        <p>OrganiGastos © 2024 - Funciona sin internet 💪</p>
      </footer>
    </div>
  )
}

export default App
