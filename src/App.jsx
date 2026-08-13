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

const FRECUENCIAS = {
  semanal: { valor: 1, label: 'Semanal', divisor: 4.33 },
  quincenal: { valor: 2, label: 'Quincenal', divisor: 2.17 },
  mensual: { valor: 3, label: 'Mensual', divisor: 1 }
}

// Iconos SVG
const IconoSobre = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconoInicio = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const IconoSobres = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)

const IconoMovimientos = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

const IconoPerfil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconoWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
  </svg>
)

const IconoChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)

function App() {
  const [ingreso, setIngreso] = useState(() => {
    const guardado = localStorage.getItem('ingreso')
    return guardado ? parseFloat(guardado) : 15000
  })
  const [frecuencia, setFrecuencia] = useState(() => {
    return localStorage.getItem('frecuencia') || 'mensual'
  })
  
  const [categorias, setCategorias] = useState(() => {
    const guardado = localStorage.getItem('categorias')
    return guardado ? JSON.parse(guardado) : CATEGORIAS_DEFAULT.map(cat => ({
      ...cat,
      gastoMaximo: 0,
      asignadoActual: 0,
      gastadoAcumulado: 0
    }))
  })
  
  const [vistaActiva, setVistaActiva] = useState('inicio')
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [sobreSeleccionado, setSobreSeleccionado] = useState(null)

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias))
  }, [categorias])
  
  useEffect(() => {
    localStorage.setItem('ingreso', ingreso.toString())
    localStorage.setItem('frecuencia', frecuencia)
  }, [ingreso, frecuencia])
  
  const totalGastosMaximos = categorias.reduce((sum, cat) => sum + cat.gastoMaximo, 0)
  const totalAsignado = categorias.reduce((sum, cat) => sum + cat.asignadoActual, 0)
  const totalGastado = categorias.reduce((sum, cat) => sum + cat.gastadoAcumulado, 0)
  const saldoDisponible = ingreso - totalAsignado
  
  const actualizarGastoMaximo = (id, valor) => {
    setCategorias(prev => prev.map(cat => 
      cat.id === id ? { ...cat, gastoMaximo: parseFloat(valor) || 0 } : cat
    ))
  }
  
  const asignarDinero = (id, cantidad) => {
    setCategorias(prev => prev.map(cat =>
      cat.id === id ? { ...cat, asignadoActual: cat.asignadoActual + parseFloat(cantidad) } : cat
    ))
  }
  
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
  
  const abrirDrawer = (sobre) => {
    setSobreSeleccionado(sobre)
    setDrawerAbierto(true)
  }
  
  const cerrarDrawer = () => {
    setDrawerAbierto(false)
    setTimeout(() => setSobreSeleccionado(null), 200)
  }
  
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }
  
  return (
    <div className="shell">
      {/* Contenido principal */}
      <div className="content">
        {/* Brandbar */}
        <div className="brandbar">
          <div className="brand">
            <div className="brand-dot">
              <IconoSobre />
            </div>
            <span className="brand-name">Sobres</span>
          </div>
          <div className="sideFoot">
            <span className="side-chip">Ingreso: <b>{formatoMoneda(ingreso)}</b></span>
            <span className="pill"><i></i> {FRECUENCIAS[frecuencia]?.label}</span>
          </div>
        </div>
        
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="eyebrow">Resumen</div>
            <h1>Tu dinero organizado</h1>
            <p>Administra tu presupuesto por categorías y mantén el control de tus gastos.</p>
          </div>
          <div className="config-frecuencia">
            <div className="seg">
              {Object.entries(FRECUENCIAS).map(([key, data]) => (
                <button
                  key={key}
                  className={frecuencia === key ? 'active' : ''}
                  onClick={() => setFrecuencia(key)}
                >
                  {data.label}
                </button>
              ))}
            </div>
            <div className="rows">
              <div className="field">
                <label>Ingreso {FRECUENCIAS[frecuencia]?.label.toLowerCase()}</label>
                <input
                  type="number"
                  value={ingreso || ''}
                  onChange={(e) => setIngreso(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Vista INICIO */}
        {vistaActiva === 'inicio' && (
          <>
            {/* Summary Grid */}
            <div className="sum-grid">
              <div className="card sum-card hero">
                <div className="sum-label">
                  <IconoWallet />
                  Disponible
                </div>
                <div className="sum-val mono">{formatoMoneda(saldoDisponible)}</div>
                <div className="sum-sub">Para asignar a sobres</div>
              </div>
              
              <div className="card sum-card">
                <div className="sum-label">
                  <IconoChart />
                  Asignado
                </div>
                <div className="sum-val mono">{formatoMoneda(totalAsignado)}</div>
                <div className="sum-sub">En {categorias.filter(c => c.asignadoActual > 0).length} sobres</div>
              </div>
              
              <div className="card sum-card">
                <div className="sum-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Gastado
                </div>
                <div className="sum-val mono">{formatoMoneda(totalGastado)}</div>
                <div className="sum-sub">Este periodo</div>
              </div>
            </div>
            
            {/* Banner informativo */}
            {saldoDisponible > 0 && saldoDisponible < ingreso * 0.1 && (
              <div className="banner banner-warn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div>
                  <strong>Casi sin margen</strong>
                  Te queda poco sin asignar. Revisa tus sobres.
                </div>
              </div>
            )}
            
            {saldoDisponible < 0 && (
              <div className="banner banner-danger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div>
                  <strong>Presupuesto excedido</strong>
                  Has asignado más de lo disponible. Ajusta tus sobres.
                </div>
              </div>
            )}
            
            {/* Envelope Grid */}
            <div style={{marginTop: '20px'}}>
              <div className="eyebrow">Tus Sobres</div>
              <div className="env-grid">
                {categorias.map(cat => {
                  const porcentaje = cat.gastoMaximo > 0 ? (cat.asignadoActual / cat.gastoMaximo) * 100 : 0
                  return (
                    <div 
                      key={cat.id} 
                      className="env"
                      onClick={() => abrirDrawer(cat)}
                      style={{cursor: 'pointer'}}
                    >
                      <div className="env-top">
                        <div 
                          className="env-ico"
                          style={{background: cat.colorSecundario + '20', color: cat.colorSecundario}}
                        >
                          <span style={{fontSize: '20px'}}>{cat.icono}</span>
                        </div>
                        <div>
                          <div className="env-name">{cat.nombre}</div>
                          <div className="env-meta">
                            {cat.gastoMaximo > 0 ? `${Math.round(porcentaje)}% completado` : 'Sin límite'}
                          </div>
                        </div>
                        <div className="env-bal mono">{formatoMoneda(cat.asignadoActual)}</div>
                      </div>
                      
                      {cat.gastoMaximo > 0 && (
                        <div className="env-bar">
                          <i style={{width: `${Math.min(porcentaje, 100)}%`, background: cat.colorSecundario}}></i>
                        </div>
                      )}
                      
                      <div className="env-foot">
                        <span>Meta: <strong className="mono">{formatoMoneda(cat.gastoMaximo)}</strong></span>
                        <span>Disponible: <strong className="mono">{formatoMoneda(cat.asignadoActual)}</strong></span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
        
        {/* Vista SOBRES */}
        {vistaActiva === 'sobres' && (
          <>
            <div className="eyebrow">Configuración</div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th class="num">Gasto Máximo</th>
                    <th class="num">Asignado</th>
                    <th class="num">Gastado</th>
                    <th class="num">Disponible</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(cat => (
                    <tr key={cat.id}>
                      <td>
                        <div className="cell-env">
                          <i style={{background: cat.colorSecundario + '20', color: cat.colorSecundario}}>
                            {cat.icono}
                          </i>
                          {cat.nombre}
                        </div>
                      </td>
                      <td class="num">
                        <input
                          type="number"
                          value={cat.gastoMaximo || ''}
                          onChange={(e) => actualizarGastoMaximo(cat.id, e.target.value)}
                          style={{
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 10px',
                            width: '100px',
                            textAlign: 'right',
                            fontFamily: 'var(--font-mono)'
                          }}
                          placeholder="0"
                        />
                      </td>
                      <td class="num mono">{formatoMoneda(cat.asignadoActual)}</td>
                      <td class="num mono">{formatoMoneda(cat.gastadoAcumulado)}</td>
                      <td class="num mono" style={{color: cat.asignadoActual <= 0 ? 'var(--danger)' : 'var(--fg)'}}>
                        {formatoMoneda(cat.asignadoActual)}
                      </td>
                      <td>
                        <button 
                          className="btn btn-soft btn-sm"
                          onClick={() => abrirDrawer(cat)}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr class="total">
                    <td>Total</td>
                    <td class="num mono">{formatoMoneda(totalGastosMaximos)}</td>
                    <td class="num mono">{formatoMoneda(totalAsignado)}</td>
                    <td class="num mono">{formatoMoneda(totalGastado)}</td>
                    <td class="num mono" style={{color: saldoDisponible < 0 ? 'var(--danger)' : 'var(--ok)'}}>
                      {formatoMoneda(saldoDisponible)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {/* Vista MOVIMIENTOS */}
        {vistaActiva === 'movimientos' && (
          <>
            <div className="eyebrow">Registrar</div>
            <div className="card">
              <div className="card-t">Nuevo Movimiento</div>
              <div className="card-s">Registra un gasto o abono a tus sobres</div>
              
              <div className="rows" style={{marginTop: '16px'}}>
                <div className="field">
                  <label>Tipo</label>
                  <select 
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '11px 13px',
                      fontSize: '15px',
                      background: 'var(--surface)',
                      minHeight: '44px',
                      minWidth: '150px'
                    }}
                  >
                    <option value="gasto">Registrar Gasto</option>
                    <option value="abono">Abonar a Sobre</option>
                  </select>
                </div>
                
                <div className="field">
                  <label>Monto</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    style={{width: '150px'}}
                  />
                </div>
                
                <div className="field">
                  <label>Categoría</label>
                  <select
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '11px 13px',
                      fontSize: '15px',
                      background: 'var(--surface)',
                      minHeight: '44px',
                      minWidth: '200px'
                    }}
                  >
                    <option value="">Selecciona...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icono} {cat.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div className="field" style={{alignSelf: 'flex-end'}}>
                  <button className="btn btn-primary">Guardar</button>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: '20px'}}>
              <div className="eyebrow">Historial</div>
              <div className="banner banner-ok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <strong>Sin movimientos recientes</strong>
                  Los movimientos que registres aparecerán aquí.
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Vista PERFIL */}
        {vistaActiva === 'perfil' && (
          <>
            <div className="eyebrow">Configuración</div>
            <div className="card">
              <div className="card-t">Preferencias</div>
              <div className="card-s">Personaliza tu experiencia</div>
              
              <div className="rows" style={{marginTop: '16px'}}>
                <div className="field">
                  <label>Frecuencia de ingreso</label>
                  <div className="seg">
                    {Object.entries(FRECUENCIAS).map(([key, data]) => (
                      <button
                        key={key}
                        className={frecuencia === key ? 'active' : ''}
                        onClick={() => setFrecuencia(key)}
                      >
                        {data.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="field">
                  <label>Ingreso {FRECUENCIAS[frecuencia]?.label.toLowerCase()}</label>
                  <input
                    type="number"
                    value={ingreso || ''}
                    onChange={(e) => setIngreso(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)'}}>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm('¿Estás seguro de borrar todos los datos?')) {
                      localStorage.removeItem('categorias')
                      localStorage.removeItem('ingreso')
                      setCategorias(CATEGORIAS_DEFAULT.map(cat => ({
                        ...cat,
                        gastoMaximo: 0,
                        asignadoActual: 0,
                        gastadoAcumulado: 0
                      })))
                      setIngreso(0)
                    }
                  }}
                >
                  Borrar todos los datos
                </button>
              </div>
            </div>
            
            <div style={{marginTop: '20px'}}>
              <div className="eyebrow">Acerca de</div>
              <div className="banner banner-ok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <div>
                  <strong>Sobres v1.0</strong>
                  Una app simple para organizar tu dinero en sobres virtuales.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Drawer lateral */}
      <div className={`scrim ${drawerAbierto ? 'show' : ''}`} onClick={cerrarDrawer}></div>
      <div className={`drawer ${drawerAbierto ? 'show' : ''}`}>
        {sobreSeleccionado && (
          <>
            <div className="drawer-head">
              <div 
                className="env-ico"
                style={{background: sobreSeleccionado.colorSecundario + '20', color: sobreSeleccionado.colorSecundario}}
              >
                <span style={{fontSize: '20px'}}>{sobreSeleccionado.icono}</span>
              </div>
              <div>
                <h3>{sobreSeleccionado.nombre}</h3>
                <div className="env-meta">Gestión del sobre</div>
              </div>
              <button className="drawer-close" onClick={cerrarDrawer}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className="drawer-body">
              <div className="d-stats">
                <div className="d-stat">
                  <label>Meta</label>
                  <b className="mono">{formatoMoneda(sobreSeleccionado.gastoMaximo)}</b>
                </div>
                <div className="d-stat">
                  <label>Asignado</label>
                  <b className="mono">{formatoMoneda(sobreSeleccionado.asignadoActual)}</b>
                </div>
                <div className="d-stat">
                  <label>Gastado</label>
                  <b className="mono">{formatoMoneda(sobreSeleccionado.gastadoAcumulado)}</b>
                </div>
              </div>
              
              {sobreSeleccionado.gastoMaximo > 0 && (
                <div>
                  <div className="card-s" style={{marginBottom: '8px'}}>Progreso</div>
                  <div className="env-bar" style={{height: '10px'}}>
                    <i 
                      style={{
                        width: `${Math.min((sobreSeleccionado.asignadoActual / sobreSeleccionado.gastoMaximo) * 100, 100)}%`,
                        background: sobreSeleccionado.colorSecundario
                      }}
                    ></i>
                  </div>
                </div>
              )}
              
              <div className="d-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const monto = prompt('Monto a asignar:')
                    if (monto && parseFloat(monto) > 0) {
                      asignarDinero(sobreSeleccionado.id, monto)
                      // Actualizar el sobre seleccionado con el nuevo valor
                      setSobreSeleccionado(prev => ({
                        ...prev,
                        asignadoActual: prev.asignadoActual + parseFloat(monto)
                      }))
                    }
                  }}
                >
                  + Asignar dinero
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    const monto = prompt('Monto del gasto:')
                    if (monto && parseFloat(monto) > 0) {
                      registrarGasto(sobreSeleccionado.id, monto)
                      // Actualizar el sobre seleccionado con los nuevos valores
                      setSobreSeleccionado(prev => ({
                        ...prev,
                        asignadoActual: prev.asignadoActual - parseFloat(monto),
                        gastadoAcumulado: prev.gastadoAcumulado + parseFloat(monto)
                      }))
                    }
                  }}
                >
                  Registrar gasto
                </button>
              </div>
              
              <div>
                <div className="card-s" style={{marginBottom: '8px'}}>Configurar meta</div>
                <div className="field">
                  <label>Gasto máximo {FRECUENCIAS[frecuencia]?.label.toLowerCase()}</label>
                  <input
                    type="number"
                    value={sobreSeleccionado.gastoMaximo || ''}
                    onChange={(e) => {
                      actualizarGastoMaximo(sobreSeleccionado.id, e.target.value)
                      setSobreSeleccionado(prev => ({
                        ...prev,
                        gastoMaximo: parseFloat(e.target.value) || 0
                      }))
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="tx-list">
                <div className="tx">
                  <div className="tx-ico" style={{background: sobreSeleccionado.colorSecundario + '20'}}>
                    {sobreSeleccionado.icono}
                  </div>
                  <div className="tx-info">
                    <div className="tx-nombre">Último movimiento</div>
                    <div className="tx-date">Reciente</div>
                  </div>
                  <div className="tx-amt mono">-</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Navegación inferior */}
      <div className="sidebar">
        <nav className="nav">
          <button 
            className={vistaActiva === 'inicio' ? 'active' : ''}
            onClick={() => setVistaActiva('inicio')}
          >
            <IconoInicio />
            Inicio
          </button>
          <button 
            className={vistaActiva === 'sobres' ? 'active' : ''}
            onClick={() => setVistaActiva('sobres')}
          >
            <IconoSobres />
            Sobres
          </button>
          <button 
            className={vistaActiva === 'movimientos' ? 'active' : ''}
            onClick={() => setVistaActiva('movimientos')}
          >
            <IconoMovimientos />
            Movimientos
          </button>
          <button 
            className={vistaActiva === 'perfil' ? 'active' : ''}
            onClick={() => setVistaActiva('perfil')}
          >
            <IconoPerfil />
            Perfil
          </button>
        </nav>
      </div>
    </div>
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
