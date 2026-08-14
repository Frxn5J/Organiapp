import { useState, useEffect, useRef } from 'react'
import './App.css'

const LEGACY = {
  comida:      { name:'Comida',      icon:'comida',      c:'oklch(58% 0.14 60)',   t:'oklch(95% 0.04 60)' },
  transporte: { name:'Transporte',  icon:'transporte',  c:'oklch(58% 0.12 240)',  t:'oklch(95% 0.03 240)' },
  renta:      { name:'Renta',       icon:'renta',       c:'oklch(56% 0.12 285)',  t:'oklch(95% 0.03 285)' },
  servicios:  { name:'Servicios',   icon:'servicios',   c:'oklch(60% 0.10 210)',  t:'oklch(95% 0.03 210)' },
  gustos:     { name:'Gustos',      icon:'gustos',      c:'oklch(60% 0.15 30)',   t:'oklch(95% 0.04 30)' },
  ahorro:     { name:'Ahorro',      icon:'ahorro',      c:'oklch(56% 0.12 170)',  t:'oklch(95% 0.04 170)' },
  emergencias:{ name:'Emergencias', icon:'emergencias', c:'oklch(56% 0.12 310)',  t:'oklch(95% 0.03 310)' },
  deudas:     { name:'Deudas',      icon:'deudas',      c:'oklch(52% 0.05 250)',  t:'oklch(95% 0.02 250)' }
}

const ICON_LIB = [
  { id:'comida', p:'<path d="M6.5 3v6.5a2.5 2.5 0 0 0 5 0V3"/><path d="M9 12.5v8.5"/><path d="M17.5 3c-1.2 1.4-1.6 3.4-.6 5.3 1 1.9 1.6 2.7 1.6 4.2V21"/>' },
  { id:'transporte', p:'<rect x="4" y="5.5" width="16" height="12" rx="2.5"/><path d="M4 11.5h16"/><circle cx="8.5" cy="16.5" r="1.4"/><circle cx="15.5" cy="16.5" r="1.4"/><path d="M9.5 5.5V4h5v1.5"/>' },
  { id:'renta', p:'<path d="M4 11l8-6 8 6"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>' },
  { id:'servicios', p:'<path d="M13 2L5 13h6l-1 9 8-11h-6z"/>' },
  { id:'gustos', p:'<path d="M12 3l2.5 5.4 5.9.7-4.4 4 1.2 5.8-5.2-2.9L6.8 19l1.2-5.8-4.4-4 5.9-.7z"/>' },
  { id:'ahorro', p:'<ellipse cx="12" cy="8.5" rx="6" ry="2.4"/><path d="M6 8.5v3.4c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V8.5"/><path d="M6 11.9v3.4c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4v-3.4"/>' },
  { id:'emergencias', p:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>' },
  { id:'deudas', p:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 9.5h17"/><path d="M12 16.5V13M10 14.5l2-2 2 2"/>' },
  { id:'mascotas', p:'<path d="M8 10.5a1.8 1.8 0 1 0-1.8-1.8A1.8 1.8 0 0 0 8 10.5zM12 8.5a1.8 1.8 0 1 0-1.8-1.8A1.8 1.8 0 0 0 12 8.5zM16 10.5a1.8 1.8 0 1 0-1.8-1.8A1.8 1.8 0 0 0 16 10.5z"/><path d="M5 13c0 3 2.5 6 7 6s7-3 7-6c0-2-1.5-3.5-3.5-3.5-1.5 0-2.5.8-3.5.8s-2-.8-3.5-.8C6.5 9.5 5 11 5 13z"/>' },
  { id:'salud', p:'<path d="M12 20s-7-4.6-9.2-8.6C1.4 8.8 3 6 5.8 6c1.7 0 3 1 3.9 2.3C10.6 7 11.9 6 13.6 6 16.4 6 18 8.8 16.6 11.4 14.4 15.4 12 20 12 20z"/>' },
  { id:'educacion', p:'<path d="M12 5L2 9l10 4 10-4z"/><path d="M6 11.5v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4"/><path d="M22 9v4.5"/>' },
  { id:'ropa', p:'<path d="M9 3L4 6l2 5 3-2v12h6V9l3 2 2-5-5-3a2.5 2.5 0 0 1-6 0z"/>' },
  { id:'viajes', p:'<path d="M10.5 13.5L3 11l-1 2 8 2.5V20l1.5 1L13 20v-4.5l8-2.5-1-2-7.5 2.5"/>' },
  { id:'telefono', p:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>' },
  { id:'compras', p:'<circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/><path d="M3 4h2l2.5 12h11l2-8H6"/>' },
  { id:'regalo', p:'<rect x="4" y="9" width="16" height="4"/><path d="M5 13v7h14v-7"/><path d="M12 9v11"/><path d="M12 9C10 9 6 9 6 6.5S8 3 10 3c2 0 2 6 2 6z"/><path d="M12 9c2 0 6 0 6-2.5S16 3 14 3c-2 0-2 6-2 6z"/>' }
]

const ICON_N = { comida:'Comida', transporte:'Transporte', renta:'Renta', servicios:'Servicios', gustos:'Gustos', ahorro:'Ahorro', emergencias:'Emergencias', deudas:'Deudas', mascotas:'Mascotas', salud:'Salud', educacion:'Educación', ropa:'Ropa', viajes:'Viajes', telefono:'Teléfono', compras:'Compras', regalo:'Regalo' }

const COLORS = [
  { id:'teal',     name:'Verde azulado', a:'oklch(56% 0.12 170)', s:'oklch(45% 0.11 170)', h:'oklch(38% 0.11 170)', soft:'oklch(95% 0.04 170)' },
  { id:'green',    name:'Verde',         a:'oklch(55% 0.13 150)', s:'oklch(45% 0.12 150)', h:'oklch(38% 0.12 150)', soft:'oklch(95% 0.04 150)' },
  { id:'lime',     name:'Lima',          a:'oklch(60% 0.13 130)', s:'oklch(46% 0.12 130)', h:'oklch(39% 0.12 130)', soft:'oklch(95% 0.04 130)' },
  { id:'gold',     name:'Dorado',        a:'oklch(60% 0.12 100)', s:'oklch(44% 0.11 100)', h:'oklch(37% 0.11 100)', soft:'oklch(95% 0.04 100)' },
  { id:'amber',    name:'Ámbar',         a:'oklch(60% 0.13 80)',  s:'oklch(44% 0.12 80)',  h:'oklch(37% 0.12 80)',  soft:'oklch(95% 0.05 80)' },
  { id:'orange',   name:'Naranja',       a:'oklch(58% 0.13 60)',  s:'oklch(45% 0.12 60)',  h:'oklch(38% 0.12 60)',  soft:'oklch(95% 0.05 60)' },
  { id:'coral',    name:'Coral',         a:'oklch(58% 0.14 30)',  s:'oklch(45% 0.13 30)',  h:'oklch(38% 0.13 30)',  soft:'oklch(95% 0.04 30)' },
  { id:'rose',     name:'Rosa',          a:'oklch(58% 0.13 10)',  s:'oklch(45% 0.12 10)',  h:'oklch(38% 0.12 10)',  soft:'oklch(95% 0.04 10)' },
  { id:'magenta',  name:'Magenta',       a:'oklch(56% 0.15 350)', s:'oklch(45% 0.14 350)', h:'oklch(38% 0.14 350)', soft:'oklch(95% 0.05 350)' },
  { id:'purple',   name:'Púrpura',       a:'oklch(56% 0.13 310)', s:'oklch(45% 0.12 310)', h:'oklch(38% 0.12 310)', soft:'oklch(95% 0.04 310)' },
  { id:'violet',   name:'Violeta',       a:'oklch(56% 0.13 285)', s:'oklch(45% 0.12 285)', h:'oklch(38% 0.12 285)', soft:'oklch(95% 0.04 285)' },
  { id:'indigo',   name:'Índigo',        a:'oklch(54% 0.12 270)', s:'oklch(43% 0.11 270)', h:'oklch(36% 0.11 270)', soft:'oklch(95% 0.04 270)' },
  { id:'blue',     name:'Azul',          a:'oklch(54% 0.12 255)', s:'oklch(43% 0.11 255)', h:'oklch(36% 0.11 255)', soft:'oklch(95% 0.04 255)' },
  { id:'azure',    name:'Azul cielo',    a:'oklch(56% 0.11 240)', s:'oklch(45% 0.10 240)', h:'oklch(38% 0.10 240)', soft:'oklch(95% 0.03 240)' },
  { id:'cyan',     name:'Cian',          a:'oklch(56% 0.12 205)', s:'oklch(45% 0.11 205)', h:'oklch(38% 0.11 205)', soft:'oklch(95% 0.04 205)' },
  { id:'mint',     name:'Menta',         a:'oklch(56% 0.11 185)', s:'oklch(45% 0.10 185)', h:'oklch(38% 0.10 185)', soft:'oklch(95% 0.04 185)' },
  { id:'graphite', name:'Grafito',       a:'oklch(50% 0.02 240)', s:'oklch(40% 0.02 240)', h:'oklch(33% 0.02 240)', soft:'oklch(95% 0.01 240)' },
  { id:'brown',    name:'Marrón',        a:'oklch(52% 0.06 70)',  s:'oklch(42% 0.06 70)',  h:'oklch(35% 0.06 70)',  soft:'oklch(95% 0.02 70)' }
]

const FREQ = {
  mensual:   { label:'Mensual',   pays:1,     period:'al mes' },
  quincenal: { label:'Quincenal', pays:2,     period:'por quincena' },
  semanal:   { label:'Semanal',   pays:52/12, period:'por semana' }
}

const CURRENCIES = [
  { id:'EUR', symbol:'€', name:'Euro' },
  { id:'USD', symbol:'$', name:'Dólar' },
  { id:'GBP', symbol:'£', name:'Libra' },
  { id:'JPY', symbol:'¥', name:'Yen' },
  { id:'BRL', symbol:'R$', name:'Real' },
  { id:'MXN', symbol:'MX$', name:'Peso mexicano' },
]

function fmtBase(n, cur='€'){ const v=Math.round(n); const f=new Intl.NumberFormat('es-ES',{maximumFractionDigits:0}).format(v); return `${f} ${cur}` }
function today(){ return new Date().toLocaleDateString('es-ES',{day:'numeric',month:'short'}) }
function colorOf(id){ return COLORS.find(c=>c.id===id) || COLORS[0] }

function buildFresh(){
  return { view:'onboarding', freq:'quincenal', ingresoMensual:0, received:0, varIncome:false, varTotal:0, appColor:'teal', colorChosen:false, name:'', onbStep:0, onbMsgs:[], envelopes:[], currency:'€' }
}

const STORAGE_KEY = 'sobres-app-v2'
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(!raw) return null
    const s = JSON.parse(raw)
    if(!s || !Array.isArray(s.envelopes)) return null
    if(s.appColor==null) s.appColor='teal'
    if(s.currency==null) s.currency='€'
    if(s.name==null) s.name=''
    if(s.varIncome==null) s.varIncome=false
    if(s.varTotal==null) s.varTotal=0
    if(s.colorChosen==null) s.colorChosen=false
    if(s.onbStep==null) s.onbStep=0
    if(!Array.isArray(s.onbMsgs)) s.onbMsgs=[]
    for(const e of s.envelopes){
      if(e.color==null && LEGACY[e.id]){ e.name=LEGACY[e.id].name; e.icon=LEGACY[e.id].icon; e.color=LEGACY[e.id].c; e.tint=LEGACY[e.id].t }
      if(e.balance==null) e.balance=0
      if(!Array.isArray(e.txns)) e.txns=[]
    }
    return s
  }catch{ return null }
}

function Icon({ id }){
  const p = ICON_LIB.find(x=>x.id===id)?.p || ICON_LIB[0].p
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:p}} />
}

const OB_AV = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9 4l-3 2M15 4l3 2"/></svg>

export default function App(){
  const [state, setState] = useState(()=> loadState() || buildFresh())
  const [drawerId, setDrawerId] = useState(null)
  const [miniMode, setMiniMode] = useState('gasto')
  const [miniAmt, setMiniAmt] = useState('')
  const [miniNote, setMiniNote] = useState('')
  const [toast, setToast] = useState('')
  const [varModal, setVarModal] = useState(false)
  const [varAmount, setVarAmount] = useState('')
  const [catModal, setCatModal] = useState(false)
  const [catName, setCatName] = useState('')
  const [catIcon, setCatIcon] = useState('comida')
  const [catColor, setCatColor] = useState('teal')
  const [catMax, setCatMax] = useState('')
  const [varConcept, setVarConcept] = useState('')
  const [obPick, setObPick] = useState({ icon:'comida', color:'teal' })
  const [obName, setObName] = useState('')
  const [obIncome, setObIncome] = useState('')
  const [pop, setPop] = useState(false)
  const [splash, setSplash] = useState(true)
  const [splashOut, setSplashOut] = useState(false)
  const toastTimer = useRef(null)
  const chatBodyRef = useRef(null)

  function save(s){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) }catch{} }
  function update(patch){
    setState(prev=>{
      const next = typeof patch==='function' ? patch(prev) : { ...prev, ...patch }
      save(next)
      return next
    })
  }

  useEffect(()=>{
    const col = colorOf(state.appColor)
    const r = document.documentElement.style
    r.setProperty('--accent', col.a)
    r.setProperty('--accent-strong', col.s)
    r.setProperty('--accent-strong-hover', col.h)
    r.setProperty('--accent-soft', col.soft)
  }, [state.appColor])

  useEffect(()=>{
    if(state.view==='onboarding' && chatBodyRef.current){
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  })

  useEffect(()=>{
    const t1 = setTimeout(()=> setSplashOut(true), 1500)
    const t2 = setTimeout(()=> setSplash(false), 1950)
    return ()=>{ clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(()=>{
    function onEsc(e){
      if(e.key==='Escape'){
        if(splash) return
        if(catModal) setCatModal(false)
        else if(varModal) setVarModal(false)
        else if(drawerId) setDrawerId(null)
      }
    }
    document.addEventListener('keydown', onEsc)
    return ()=> document.removeEventListener('keydown', onEsc)
  }, [varModal, drawerId, splash, catModal])

  function openCatModal(){
    setCatName(''); setCatIcon('comida'); setCatColor('teal'); setCatMax(''); setCatModal(true)
  }
  function closeCatModal(){ setCatModal(false) }
  function submitCat(){
    const name = catName.trim()
    const n = parseFloat(catMax)
    if(!name){ showToast('Escribe un nombre para la categoría'); return }
    if(!(n>0) || !isFinite(n)){ showToast('Escribe un máximo válido'); return }
    const col = colorOf(catColor)
    const id = 'c'+Date.now()
    update(prev=> ({ ...prev, envelopes:[...prev.envelopes, { id, name, icon:catIcon, color:col.a, tint:col.soft, on:true, max:Math.round(n), balance:0, txns:[] }] }))
    closeCatModal()
    showToast('Categoría creada: '+name)
  }

  function showToast(msg){
    setToast(msg)
    if(toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(()=> setToast(''), 2600)
  }

  function go(view){
    update({ view })
    setDrawerId(null)
  }

  function perMonth(f){ return FREQ[f].pays }
  function incomePerPay(){ return state.ingresoMensual / perMonth(state.freq) }
  function contrib(e){ return Math.round(e.max / perMonth(state.freq)) }
  function totalContrib(){ return state.envelopes.filter(e=>e.on).reduce((s,e)=> s+contrib(e),0) }
  function freePerPay(){ return incomePerPay() - totalContrib() }
  function totalBalance(){ return state.envelopes.filter(e=>e.on).reduce((s,e)=> s+e.balance,0) }
  function envColor(e){ return e.color ? {c:e.color, t:e.tint||e.color} : (LEGACY[e.id]||LEGACY.comida) }
  function envName(e){ return e.name || (LEGACY[e.id]?.name || 'Categoría') }
  function envIconId(e){ return e.icon || (LEGACY[e.id]?.id || 'comida') }
  function getEnv(id){ return state.envelopes.find(e=>e.id===id) || null }

  function receiveIncome(){
    if(state.received >= state.ingresoMensual - 0.01){ showToast('Ya recibiste tus pagos de este mes'); return }
    const total = totalContrib()
    const t = today()
    update(prev=>{
      const envelopes = prev.envelopes.map(e=>{
        if(!e.on) return e
        const c = Math.round(e.max / perMonth(prev.freq))
        return { ...e, balance: e.balance + c, txns: [{kind:'aporte', amount:c, note:'Aporte de nómina', date:t}, ...e.txns] }
      })
      return { ...prev, envelopes, received: Math.min(prev.received + prev.ingresoMensual/perMonth(prev.freq), prev.ingresoMensual) }
    })
    setPop(true); setTimeout(()=>setPop(false),600)
    showToast('Ingreso registrado · '+fmt(total)+' repartidos en tus sobres')
  }

  function openVarModal(){ setVarModal(true); setVarAmount(''); setVarConcept('') }
  function closeVarModal(){ setVarModal(false) }
  function submitVar(){
    const n = parseFloat(varAmount)
    if(!(n>0) || !isFinite(n)){ showToast('Escribe un monto válido'); return }
    const amt = Math.round(n*100)/100
    update(prev=> ({ ...prev, varTotal: (prev.varTotal||0)+amt }))
    closeVarModal()
    showToast('Ingreso variable registrado')
  }

  function topbarTitle(){
    if(state.view==='dashboard') return ['Mis sobres','Aparta dinero en cada pago y gasta solo lo que cada sobre tiene disponible.']
    if(state.view==='spending') return ['¿En qué gastas al mes?','La distribución de tu gasto mensual por categoría, según los máximos que configuraste en cada sobre.']
    if(state.view==='calculator') return ['Planificador','Calcula cuánto debes apartar en cada pago para cubrir tus gastos máximos.']
    if(state.view==='settings') return ['Ajustes','Tu perfil de ingreso y el tope de cada sobre. Los cambios se guardan en este navegador.']
    return ['','']
  }

  const [topTitle, topSub] = topbarTitle()
  const freqTxt = FREQ[state.freq].period
  const fmt = (n) => fmtBase(n, state.currency)

  function renderDashboard(){
    const paidPays = state.ingresoMensual>0 ? Math.round(state.received/incomePerPay()) : 0
    const totalPays = Math.round(state.ingresoMensual>0 ? state.ingresoMensual/incomePerPay() : 0)
    const next = totalContrib()
    const full = state.received >= state.ingresoMensual - 0.01
    const inc = incomePerPay()
    const on = state.envelopes.filter(e=>e.on)

    return (
      <>
        <div className="sum-grid">
          <div className="card sum-card hero" data-od-id="card-total-balance">
            <div className="sum-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v18M7 8h7a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5h8"/></svg>Saldo total</div>
            <div className="sum-val">{fmt(totalBalance())}</div>
            <div className="sum-sub">repartido en {on.length} sobres</div>
          </div>
          <div className="card sum-card" data-od-id="card-received">
            <div className="sum-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16l-2 12H6z"/><path d="M4 7l2-3h12l2 3"/><path d="M9 11l2 2 4-4"/></svg>Recibido este mes</div>
            <div className="sum-val">{fmt(state.received + (state.varIncome ? state.varTotal : 0))}</div>
            <div className="sum-sub">{paidPays} de {totalPays} pagos de {fmt(incomePerPay())}{state.varIncome&&state.varTotal>0 ? ' · +'+fmt(state.varTotal)+' variables' : ''}</div>
          </div>
          <div className="card sum-card" data-od-id="card-next-contribution">
            <div className="sum-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Próxima aportación</div>
            <div className="sum-val">{fmt(next)}</div>
            <div className="sum-sub">se repartirá en {on.length} sobres {freqTxt}</div>
          </div>
        </div>

        <div className="card split-wrap" data-od-id="card-split">
          <div className="split-title"><div className="card-t">Reparto de tu ingreso</div><span className="card-s">{fmt(incomePerPay())} {freqTxt.replace('por ','cada ')}</span></div>
          <div className="split">
            {inc>0 ? (
              <>
                {on.map(e=>{
                  const ec=envColor(e); const w=(contrib(e)/inc*100)
                  return <i key={e.id} style={{flexGrow:w.toFixed(1), background:ec.c}} title={`${envName(e)}: ${fmt(contrib(e))} ${freqTxt}`} />
                })}
                {freePerPay()>0 && <i style={{flexGrow:(freePerPay()/inc*100).toFixed(1), background:'oklch(85% 0.01 240)'}} title={`Libre: ${fmt(freePerPay())}`} />}
              </>
            ) : <i style={{flex:1, background:'oklch(88% 0.01 240)'}} title="Añade tu ingreso para ver el reparto" />}
          </div>
          <div className="legend">
            {inc>0 ? (
              <>
                {on.map(e=>{ const ec=envColor(e); return <span key={e.id} className="lg"><i style={{background:ec.c}} />{envName(e)} <b>{fmt(contrib(e))}</b></span> })}
                <span className="lg"><i style={{background:'oklch(85% 0.01 240)'}} />Libre <b>{fmt(freePerPay())}</b></span>
              </>
            ) : <span className="lg" style={{color:'var(--muted)'}}>Añade tu ingreso en el Planificador para ver el reparto</span>}
          </div>
        </div>

        <div className={`env-grid${pop?' pop':''}`}>
          {on.map(ev=>{
            const ec=envColor(ev)
            const pct = ev.max>0 ? Math.min(100, Math.round(ev.balance/ev.max*100)) : 0
            return (
              <button key={ev.id} className="env" data-od-id={`envelope-card-${ev.id}`} onClick={()=>setDrawerId(ev.id)}>
                <div className="env-top">
                  <span className="env-ico" style={{"--c":ec.c,"--t":ec.t}}><Icon id={envIconId(ev)} /></span>
                  <div><div className="env-name">{envName(ev)}</div><div className="env-meta">Meta mensual · {fmt(ev.max)}</div></div>
                  <div className="env-bal mono">{fmt(ev.balance)}</div>
                </div>
                <div className="env-bar"><i style={{width:pct+'%', background:ec.c}} /></div>
                <div className="env-foot"><span>{freqTxt} · aportación</span><strong>{fmt(contrib(ev))}</strong></div>
              </button>
            )
          })}
        </div>
      </>
    )
  }

  function renderSpending(){
    const on = state.envelopes.filter(e=>e.on)
    const totalMax = on.reduce((s,e)=>s+e.max,0)
    const spent = on.reduce((s,e)=> s + e.txns.filter(t=>t.kind==='gasto').reduce((x,t)=>x+t.amount,0),0)
    const pct = state.ingresoMensual>0 ? Math.round(totalMax/state.ingresoMensual*100) : 0
    const sorted = [...on].sort((a,b)=>b.max-a.max)
    const largest = sorted.length ? sorted[0].max : 0
    return (
      <>
        <div className="sum-grid">
          <div className="card sum-card" data-od-id="card-total-spend">
            <div className="sum-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="9" width="4" height="11" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="16" y="12" width="4" height="8" rx="1"/></svg>Gasto máximo al mes</div>
            <div className="sum-val">{fmt(totalMax)}</div>
            <div className="sum-sub">repartido en {on.length} categorías{spent>0 ? ' · gastado este mes: '+fmt(spent) : ''}</div>
          </div>
          <div className="card sum-card" data-od-id="card-spend-income">
            <div className="sum-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>Ingreso mensual</div>
            <div className="sum-val">{fmt(state.ingresoMensual)}</div>
            <div className="sum-sub">según tu frecuencia de cobro</div>
          </div>
          <div className="card sum-card hero" data-od-id="card-coverage">
            <div className="sum-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9h-9z"/></svg>Cobertura del gasto</div>
            <div className="sum-val">{pct}%</div>
            <div className="sum-sub">de tu ingreso se destina a gastos mensuales</div>
          </div>
        </div>
        <div className="card split-wrap" data-od-id="card-spend-distribution">
          <div className="split-title"><div className="card-t">Distribución de tu gasto</div><span className="card-s">gasto máximo por categoría</span></div>
          <div className="split">
            {totalMax>0 ? on.map(e=>{ const ec=envColor(e); return <i key={e.id} style={{flexGrow:(e.max/totalMax*100).toFixed(1), background:ec.c}} title={`${envName(e)}: ${fmt(e.max)}`} /> }) : <i style={{flex:1,background:'oklch(88% 0.01 240)'}} title="Sin gastos configurados" />}
          </div>
          <div className="legend">
            {totalMax>0 ? on.map(e=>{ const ec=envColor(e); return <span key={e.id} className="lg"><i style={{background:ec.c}} />{envName(e)} <b>{fmt(e.max)}</b></span> }) : <span className="lg" style={{color:'var(--muted)'}}>Configura tus sobres para ver la distribución</span>}
          </div>
        </div>
        <div className="card" data-od-id="card-spend-ranking">
          <div className="card-t">Por categoría</div><div className="card-s">de mayor a menor gasto mensual</div>
          <div className="sp-bars" style={{marginTop:18}}>
            {sorted.length ? sorted.map(ev=>{
              const ec=envColor(ev); const w=largest>0?Math.round(ev.max/largest*100):0; const rowPct=totalMax>0?Math.round(ev.max/totalMax*100):0
              return (
                <div key={ev.id} className="sp-row" data-od-id={`spend-row-${ev.id}`}>
                  <span className="env-ico" style={{"--c":ec.c,"--t":ec.t}}><Icon id={envIconId(ev)} /></span>
                  <div className="sp-info">
                    <div className="sp-head"><span className="sp-name">{envName(ev)}</span><span className="sp-amt">{fmt(ev.max)}</span></div>
                    <div className="sp-bar"><i style={{width:w+'%', background:ec.c}} /></div>
                  </div>
                  <span className="sp-pct">{rowPct}%</span>
                </div>
              )
            }) : <div className="empty">No hay categorías activas.</div>}
          </div>
        </div>
      </>
    )
  }

  function fitBanner(total){
    const income = incomePerPay()
    const free = income - total
    const over = total - income
    if(over>0){
      return <div className="banner banner-danger" data-od-id="banner-over"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg><div><strong>Tus sobres piden más de lo que cobras</strong>Destinas {fmt(total)} {FREQ[state.freq].period}, pero recibes {fmt(income)}. Reduce tus máximos en al menos <b>{fmt(over)}</b> para que el plan cuadre.</div></div>
    }
    if(free>0){
      return <div className="banner banner-ok" data-od-id="banner-fit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4L12 14l-3-3"/></svg><div><strong>Tu plan cuadra</strong>De {fmt(income)} {FREQ[state.freq].period}, destinas {fmt(total)} y te quedan <b>{fmt(free)}</b> libres para lo que no tienes previsto.</div></div>
    }
    return <div className="banner banner-warn" data-od-id="banner-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div><strong>Lo usas todo</strong>Destinas exactamente lo que recibes y no queda margen de maniobra.</div></div>
  }

  function renderCalculator(){
    const total = totalContrib()
    return (
      <>
        <div className="card" style={{marginBottom:16}} data-od-id="card-calc-config">
          <div className="card-t">Tu ingreso</div><div className="card-s">¿Cada cuánto cobras? Ajustamos las aportaciones automáticamente.</div>
          <div className="rows">
            <div className="field"><label>Cada cuánto cobras</label><div className="seg">
              {['mensual','quincenal','semanal'].map(k=>(
                <button key={k} data-od-id={`freq-${k}`} className={state.freq===k?'active':''} onClick={()=>{ update({freq:k}); showToast('Frecuencia: '+FREQ[k].label.toLowerCase()) }}>{FREQ[k].label}</button>
              ))}
            </div></div>
            <div className="field hint"><label>Ingreso por pago</label><input type="number" value={Math.round(incomePerPay())||''} min="0" step="any" onChange={e=>{ const n=parseFloat(e.target.value); update(prev=>({...prev, ingresoMensual: (n>0&&isFinite(n))? n*perMonth(prev.freq):0})) }} /><span className="hint">Equivale a <strong>{fmt(state.ingresoMensual)}</strong> al mes</span></div>
          </div>
        </div>
        <div style={{marginBottom:16}}>{fitBanner(total)}</div>
        <div className="tbl-wrap" data-od-id="table-contributions">
          <table>
            <thead><tr><th>Sobre</th><th className="num">Gasto máximo mensual</th><th className="num">Aportación {FREQ[state.freq].period}</th></tr></thead>
            <tbody>
              {state.envelopes.filter(e=>e.on).map(e=>{
                const ec=envColor(e)
                return <tr key={e.id} data-od-id={`calc-row-${e.id}`}><td><div className="cell-env"><i style={{"--c":ec.c,"--t":ec.t}}><Icon id={envIconId(e)} /></i>{envName(e)}</div></td><td className="num">{fmt(e.max)}</td><td className="num">{fmt(contrib(e))}</td></tr>
              })}
              <tr className="total"><td>Total</td><td className="num">{fmt(state.envelopes.filter(x=>x.on).reduce((s,e)=>s+e.max,0))}</td><td className="num">{fmt(total)}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card-t" style={{margin:'22px 0 12px'}}>Cómo se calcula</div>
        <div className="how">
          <div className="how-step" data-od-id="how-mensual"><span className="freq">Mensual</span><b>El máximo, de una vez</b><span>Si cobras una vez al mes, aportas el gasto máximo completo en ese único pago.</span></div>
          <div className="how-step" data-od-id="how-quincenal"><span className="freq">Quincenal</span><b>La mitad cada quincena</b><span>Con dos pagos al mes, apartas la mitad del máximo en cada quincena.</span></div>
          <div className="how-step" data-od-id="how-semanal"><span className="freq">Semanal</span><b>Repartido en ~4,3 semanas</b><span>Con pago semanal, divides el máximo entre las semanas del mes (máx × 12 ÷ 52).</span></div>
        </div>
      </>
    )
  }

  function renderSettings(){
    return (
      <>
        <div className="card" style={{marginBottom:16}} data-od-id="card-settings-income">
          <div className="card-t">Tu ingreso</div><div className="card-s">Al cambiar la frecuencia, se recalculan todas las aportaciones.</div>
          <div className="rows">
            <div className="field"><label>Cada cuánto cobras</label><div className="seg">
              {['mensual','quincenal','semanal'].map(k=>(
                <button key={k} data-od-id={`setfreq-${k}`} className={state.freq===k?'active':''} onClick={()=>{ update({freq:k}); showToast('Frecuencia: '+FREQ[k].label.toLowerCase()) }}>{FREQ[k].label}</button>
              ))}
            </div></div>
            <div className="field hint"><label>Ingreso por pago</label><input type="number" value={Math.round(incomePerPay())||''} min="0" step="any" onChange={e=>{ const n=parseFloat(e.target.value); update(prev=>({...prev, ingresoMensual:(n>0&&isFinite(n))? n*perMonth(prev.freq):0})) }} /><span className="hint">Equivale a <strong>{fmt(state.ingresoMensual)}</strong> al mes</span></div>
            <div className="field" style={{marginTop:12}}><label>Moneda</label><div className="seg" style={{flexWrap:'wrap',gap:2}}>{CURRENCIES.map(c=>(
              <button key={c.id} data-od-id={`set-cur-${c.id}`} className={state.currency===c.symbol?'active':''} style={{minWidth:56,padding:'8px 12px',fontSize:13}} onClick={()=>{ update({currency:c.symbol}); showToast('Moneda: '+c.symbol) }}>{c.symbol} · {c.name}</button>
            ))}</div></div>
            <div style={{marginTop:16,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
              <label style={{display:'flex',alignItems:'center',gap:10,fontSize:'13.5px',color:'var(--muted)',cursor:'pointer',minHeight:44}}>
                <input type="checkbox" checked={state.varIncome} onChange={e=>{ update({varIncome:e.target.checked}); showToast(e.target.checked?'Ingresos variables activados':'Ingresos variables desactivados') }} style={{width:20,height:20,accentColor:'var(--accent-strong)',flex:'0 0 20px'}} />
                <span>¿Tienes ingresos variables?</span>
              </label>
              <span style={{fontSize:12,color:'var(--muted)'}}>Activa el botón para registrar ventas, extras o freelance.</span>
            </div>
          </div>
        </div>
        <div className="card" style={{marginBottom:16}} data-od-id="card-settings-envelopes">
          <div className="card-t" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>Tus sobres
            <button className="btn btn-primary btn-sm" data-od-id="add-category" onClick={openCatModal} style={{minHeight:36,padding:'8px 14px'}}><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>Agregar categoría</button>
          </div>
          <div className="card-s">Marca o desmarca sobres y ajusta el gasto máximo de cada mes.</div>
          <div className="cat-list" style={{marginTop:16,gridTemplateColumns:'1fr'}}>
            {state.envelopes.map(e=>{
              const ec=envColor(e)
              return (
                <div key={e.id} className="cat-item" data-od-id={`set-env-${e.id}`}>
                  <input type="checkbox" checked={!!e.on} onChange={()=> update(prev=>({ ...prev, envelopes: prev.envelopes.map(x=> x.id===e.id ? {...x, on:!x.on}:x)}))} aria-label={`Activar ${envName(e)}`} />
                  <span className="cat-ico" style={{"--c":ec.c,"--t":ec.t}}><Icon id={envIconId(e)} /></span>
                  <div className="cat-info"><div className="cat-name">{envName(e)}</div><div className="cat-sub">Máximo mensual</div></div>
                  <input type="number" min="0" step="any" value={e.max} onChange={ev=>{ const n=parseFloat(ev.target.value); update(prev=>({ ...prev, envelopes: prev.envelopes.map(x=> x.id===e.id ? {...x, max:(n>0&&isFinite(n))?Math.round(n):0}:x)})) }} aria-label={`Máximo mensual de ${envName(e)}`} />
                </div>
              )
            })}
          </div>
        </div>
        <div className="card" data-od-id="card-settings-actions">
          <div className="card-t">Datos</div><div className="card-s">Borra todos tus datos y vuelve a empezar. Esta acción no se puede deshacer.</div>
          <div className="d-actions" style={{marginTop:16}}>
            <button className="btn btn-danger" onClick={()=>{ try{localStorage.removeItem(STORAGE_KEY)}catch{}; const f=buildFresh(); save(f); setState(f); showToast('Datos borrados') }}>Borrar todos los datos</button>
          </div>
        </div>
      </>
    )
  }

  function renderDrawer(){
    const e = getEnv(drawerId)
    if(!e) return null
    const ec=envColor(e)
    const pct = e.max>0 ? Math.min(100, Math.round(e.balance/e.max*100)) : 0
    const amtNum = parseFloat(miniAmt)
    const hasErr = miniAmt && !(amtNum>0) ? false : (miniMode==='gasto' && amtNum>e.balance)
    const canSubmit = miniAmt && amtNum>0 && !(miniMode==='gasto' && amtNum>e.balance)
    function submitMini(){
      const amt = parseFloat(miniAmt)
      if(!(amt>0)) return
      if(miniMode==='gasto' && amt>e.balance) return
      const note = miniNote.trim() || (miniMode==='gasto' ? 'Gasto en '+envName(e) : 'Aporte manual')
      update(prev=>({
        ...prev,
        envelopes: prev.envelopes.map(x=>{
          if(x.id!==e.id) return x
          const tx = {kind: miniMode==='gasto'?'gasto':'aporte', amount: Math.round(amt), note, date: today()}
          return { ...x, balance: miniMode==='gasto' ? x.balance - Math.round(amt) : x.balance + Math.round(amt), txns: [tx, ...x.txns] }
        })
      }))
      setMiniAmt(''); setMiniNote('')
      showToast(miniMode==='gasto'?'Gasto registrado':'Dinero aportado al sobre')
    }
    return (
      <>
        <div className="drawer-head">
          <span className="env-ico" style={{"--c":ec.c,"--t":ec.t}}><Icon id={envIconId(e)} /></span>
          <h3>Sobre de {envName(e)}</h3>
          <button className="drawer-close" data-od-id="drawer-close" onClick={()=>setDrawerId(null)} aria-label="Cerrar"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </div>
        <div className="drawer-body">
          <div className="d-stats">
            <div className="d-stat"><label>Disponible</label><b>{fmt(e.balance)}</b></div>
            <div className="d-stat"><label>Meta mensual</label><b>{fmt(e.max)}</b></div>
            <div className="d-stat"><label>Aportación</label><b>{fmt(contrib(e))}</b></div>
          </div>
          <div className="env-bar"><i style={{width:pct+'%', background:ec.c}} /></div>
          <div className="d-actions">
            <button className="btn btn-primary btn-sm" data-od-id="drawer-btn-spend" onClick={()=>setMiniMode('gasto')}>Añadir gasto</button>
            <button className="btn btn-ghost btn-sm" data-od-id="drawer-btn-fund" onClick={()=>setMiniMode('aporte')}>Añadir dinero</button>
          </div>
          <div className="mini-form">
            <div className="card-t">{miniMode==='gasto'?'Nuevo gasto':'Aportar dinero'}</div>
            <div className="row">
              <input type="number" value={miniAmt} onChange={ev=>setMiniAmt(ev.target.value)} min="1" step="any" aria-label="Cantidad" />
              <input type="text" value={miniNote} onChange={ev=>setMiniNote(ev.target.value)} maxLength={40} aria-label="Nota" />
            </div>
            {hasErr && <div className="form-err">No hay suficiente saldo. Ajusta el monto o aporta más a este sobre.</div>}
            <button className="btn btn-primary btn-sm" disabled={!canSubmit} onClick={submitMini}>{miniMode==='gasto'?'Registrar gasto':'Aportar dinero'}</button>
          </div>
          <div className="card-t">Historial <span className="card-s">({e.txns.length})</span></div>
          <div className="tx-list">
            {e.txns.length ? e.txns.map((tx,idx)=>(
              <div key={idx} className="tx">
                <span className={`tx-ico ${tx.kind==='gasto'?'spend':'fund'}`}>{tx.kind==='gasto'
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>}</span>
                <div className="tx-info"><div className="tx-note">{tx.note}</div><div className="tx-date">{tx.date}</div></div>
                <span className={`tx-amt ${tx.kind==='gasto'?'minus':'plus'}`}>{tx.kind==='gasto'?'−':'+'}{fmt(tx.amount)}</span>
              </div>
            )) : <div className="empty">Todavía no hay movimientos en este sobre.</div>}
          </div>
        </div>
      </>
    )
  }

  function renderOnboarding(){
    function transcript(){
      const t=[]
      if(state.onbStep>=1){
        t.push(<div key="b1" className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¡Hola! Soy <b>Organibot</b>, tu organizador personal de sobres. Te haré unas preguntas y en un par de minutos tendrás tu presupuesto listo.</div></div>)
        t.push(<div key="b2" className="msg bot"><div className="av">{OB_AV}</div><div className="bub">Empezamos. <b>¿Cómo te llamas?</b></div></div>)
        t.push(<div key="u1" className="msg user"><div className="bub">{state.name}</div></div>)
      }
      if(state.onbStep>=2){
        t.push(<div key="b3" className="msg bot"><div className="av">{OB_AV}</div><div className="bub"><b>{state.name},</b> ¿cada cuánto cobras?</div></div>)
        t.push(<div key="u2" className="msg user"><div className="bub">{FREQ[state.freq].label} · <b>{fmt(state.ingresoMensual)}</b> al mes</div></div>)
      }
      if(state.onbStep>=3){
        t.push(<div key="b4" className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¿Tus ingresos son variables?</div></div>)
        t.push(<div key="u3" className="msg user"><div className="bub">{state.varIncome?'Sí, son variables':'No, son fijos'}</div></div>)
      }
      if(state.onbStep>=4){
        t.push(<div key="b5" className="msg bot"><div className="av">{OB_AV}</div><div className="bub">Ahora crea tus <b>categorías de gasto</b> con su máximo mensual.</div></div>)
        for(const e of state.envelopes){
          t.push(<div key={`u-cat-${e.id}`} className="msg user"><div className="bub"><b>{envName(e)}</b> · <b>{fmt(e.max)}</b> <span className="memo">máximo al mes</span></div></div>)
        }
      }
      if(state.onbStep>=5){
        t.push(<div key="b6" className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¿Qué <b>símbolo de moneda</b> usas?</div></div>)
        t.push(<div key="u4" className="msg user"><div className="bub">{state.currency}</div></div>)
      }
      if(state.onbStep>=6){
        t.push(<div key="b7" className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¿De qué color quieres la app?</div></div>)
        t.push(<div key="u5" className="msg user"><div className="bub">{colorOf(state.appColor).name}</div></div>)
      }
      return t
    }
    function prompt(){
      switch(state.onbStep){
        case 0:
          return <><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¡Hola! Soy <b>Organibot</b>, tu organizador personal de sobres. Te haré unas preguntas y en un par de minutos tendrás tu presupuesto listo.</div></div><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub"><div className="tool"><button className="btn btn-primary" data-od-id="onb-start" onClick={()=>update({onbStep:1})}>¡Empecemos!</button></div></div></div></>
        case 1:
          return <><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">Empezamos. <b>¿Cómo te llamas?</b></div></div><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub"><div className="fld"><input type="text" value={obName} onChange={e=>setObName(e.target.value)} maxLength={30} aria-label="Tu nombre" /><button className="btn btn-primary" data-od-id="onb-name" onClick={()=>{
            const n=obName.trim(); if(!n){showToast('Escribe tu nombre');return}
            update({name:n, onbStep:2}); setObName('')
          }}>Siguiente</button></div></div></div></>
        case 2: {
          return <><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">Perfecto. ¿Y cuánto recibes en <b>cada pago</b>?</div></div><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">
            <div className="radios">{['mensual','quincenal','semanal'].map(k=>(
              <label key={k} className="radio"><input type="radio" name="obFreq" value={k} checked={state.freq===k} onChange={()=>update({freq:k})} /><span>{FREQ[k].label}</span></label>
            ))}</div>
            <div className="fld" style={{marginTop:12}}><input type="text" value={obIncome} onChange={e=>setObIncome(e.target.value)} inputMode="decimal" aria-label="Ingreso por pago" /><button className="btn btn-primary" data-od-id="onb-salary" onClick={()=>{
              const v=parseFloat(obIncome); if(!(v>0)||!isFinite(v)){showToast('Escribe un monto válido');return}
              update({ingresoMensual: Math.round(v*perMonth(state.freq)), onbStep:3}); setObIncome('')
            }}>Listo</button></div>
            <span className="memo">Introduce el monto tal cual lo recibes en cada pago.</span>
          </div></div></>
        }
        case 3:
          return <><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¿Tus ingresos son <b>variables</b>? (ventas, extras, freelance, comisiones...)</div></div><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub"><div className="tool tc"><button className="btn btn-primary" data-od-id="onb-var-yes" onClick={()=>update({varIncome:true,onbStep:4})}>Sí, son variables</button><button className="btn btn-ghost" data-od-id="onb-var-no" onClick={()=>update({varIncome:false,onbStep:4})}>No, son fijos</button></div></div></div></>
        case 4: {
          const iconOpts = ICON_LIB.map(o=> <option key={o.id} value={o.id}>{ICON_N[o.id]||o.id}</option>)
          const colorOpts = COLORS.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)
          return (
            <>
              <div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">Ahora crea tus <b>categorías de gasto</b>. Ponle nombre, elige un icono y un color, y define cuánto máximo quieres gastar al mes.</div></div>
              <div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">
                <div className="cat-form">
                  <div className="cf-name"><input type="text" id="cfName" maxLength={24} aria-label="Nombre de la categoría" /></div>
                  <div className="cf-pick"><span className="pv" style={{display:'grid',placeItems:'center',width:44,height:44,borderRadius:12,background:'var(--accent-soft)',color:'var(--accent-strong)'}}><Icon id={obPick.icon} /></span><select defaultValue={obPick.icon} onChange={e=>setObPick(p=>({...p, icon:e.target.value}))} aria-label="Icono">{iconOpts}</select></div>
                  <div className="cf-pick"><span className="pv sw" style={{"--c":colorOf(obPick.color).a, width:44,height:44,borderRadius:12,display:'grid',placeItems:'center',background:'var(--c)',color:'var(--surface)'}}></span><select defaultValue={obPick.color} onChange={e=>setObPick(p=>({...p, color:e.target.value}))} aria-label="Color">{colorOpts}</select></div>
                  <div className="cf-max"><label>Máximo al mes</label><input type="number" id="cfMax" min="0" step="any" defaultValue={200} inputMode="decimal" /></div>
                  <div className="cf-add">
                    <button className="btn btn-primary" data-od-id="onb-add-cat" onClick={()=>{
                      const nameEl=document.getElementById('cfName'); const maxEl=document.getElementById('cfMax')
                      const name=nameEl? nameEl.value.trim():''; const max=parseFloat(maxEl?maxEl.value:'')
                      if(!name){showToast('Escribe un nombre para la categoría');return}
                      if(!(max>0)||!isFinite(max)){showToast('Escribe un monto máximo válido');return}
                      const col=colorOf(obPick.color)
                      update(prev=>({ ...prev, envelopes:[...prev.envelopes, { id:'c'+Date.now(), name, icon:obPick.icon, color:col.a, tint:col.soft, on:true, max:Math.round(max), balance:0, txns:[] }] }))
                      if(nameEl) nameEl.value=''; if(maxEl) maxEl.value='200'
                    }}>Añadir categoría</button>
                    {state.envelopes.length>0 && <button className="btn btn-ghost" data-od-id="onb-done-cats" onClick={()=>update({onbStep:5})}>Listo</button>}
                  </div>
                  {state.envelopes.length>0 && <div className="chip-row">{state.envelopes.map(e=>{
                    const ec=envColor(e)
                    return <span key={e.id} className="chip"><i style={{"--c":ec.c, background:'var(--c)'}} />{envName(e)} · <b>{fmt(e.max)}</b><button onClick={()=>update(prev=>({...prev, envelopes: prev.envelopes.filter(x=>x.id!==e.id)}))} aria-label={`Quitar ${envName(e)}`}>×</button></span>
                  })}</div>}
                </div>
              </div></div>
            </>
          )
        }
        case 5:
          return <><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¿Qué <b>símbolo de moneda</b> usas? (ej. €, $, £)</div></div><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">
            <div className="seg" style={{flexWrap:'wrap',gap:6}}>
              {CURRENCIES.map(c=>(
                <button key={c.id} data-od-id={`onb-cur-${c.id}`} className={state.currency===c.symbol?'active':''} style={{minWidth:72,padding:'10px 14px',borderRadius:10,fontWeight:700}} onClick={()=>update({currency:c.symbol})}>{c.symbol} · {c.name}</button>
              ))}
            </div>
            <div className="fld" style={{marginTop:12}}>
              <input type="text" value={state.currency} onChange={e=>{ const v=e.target.value.slice(0,4); update({currency:v||'€'}) }} maxLength={4} aria-label="Símbolo de moneda" style={{maxWidth:120}} />
              <button className="btn btn-primary" data-od-id="onb-cur-done" onClick={()=>{ if(!state.currency.trim()){showToast('Elige un símbolo de moneda');return} update({onbStep:6}) }}>Siguiente</button>
            </div>
          </div></div></>
        case 6:
          return <><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¡Buen trabajo! Último detalle: <b>¿de qué color</b> quieres la app?</div></div><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">
            <div className="sw-grid">{COLORS.map(c=>(
              <button key={c.id} className={`sw${state.appColor===c.id?' on':''}`} style={{"--c":c.a}} data-od-id={`onb-color-${c.id}`} onClick={()=>update({appColor:c.id, colorChosen:true})}><i style={{background:'var(--c)'}} /><span>{c.name}</span></button>
            ))}</div>
            {state.colorChosen && <div className="cf-add" style={{marginTop:14}}><button className="btn btn-primary" data-od-id="onb-done-color" onClick={()=>update({onbStep:7})}>Terminado</button></div>}
          </div></div></>
        case 7:
          return <><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub">¡Bienvenido, <b>{state.name}</b>! Ya tienes <b>{state.envelopes.length}</b> sobres listos{state.varIncome?' y los ':' '}{state.varIncome?<b>ingresos variables</b>:null}{state.varIncome?' activados':''}. Cuando cobres, pulsa &quot;Registrar ingreso&quot; y yo repartiré el dinero en tus sobres.</div></div><div className="msg bot"><div className="av">{OB_AV}</div><div className="bub"><div className="tool"><button className="btn btn-primary" data-od-id="onb-finish" onClick={()=>{
            if(!(state.ingresoMensual>0)){showToast('Primero escribe tu ingreso');return}
            if(!state.envelopes.length){showToast('Añade al menos una categoría');return}
            update(prev=>({ ...prev, envelopes: prev.envelopes.map(e=>({...e, balance:0, txns:[]})), received:0, onbStep:0, onbMsgs:[], colorChosen:false, view:'dashboard' }))
            showToast('Sobres creados · reparte tu ingreso cuando llegue')
          }}>¡Ir a mis sobres!</button></div></div></div></>
        default: return null
      }
    }

    return (
      <div className="onb-wrap"><div className="chat">
        <div className="chat-head"><div className="bot-ico">{OB_AV}</div><div><div className="tt">Organibot</div><div className="st">Asistente de configuración</div></div></div>
        <div className="chat-body" ref={chatBodyRef}>
          {transcript()}
          {prompt()}
        </div>
        <div className="chat-foot"><span style={{fontSize:'12.5px',color:'var(--muted)'}}>Tus datos se guardan solo en este dispositivo</span></div>
      </div></div>
    )
  }

  const showScrim = !!drawerId || varModal || catModal

  return (
    <div className="shell">
      <main className="content">
        <div className="brandbar">
          <div className="brand" data-od-id="brand-home" onClick={()=>go('dashboard')}>
            <span className="brand-dot"><img src="/pwa-192x192.png" alt="OrganiAPP" /></span>
            <span className="brand-name">OrganiAPP</span>
          </div>
          <div className="sideFoot" id="sideFoot">
            <span className="side-chip">Ingreso por pago: <b>{fmt(incomePerPay())}</b> · cobras {FREQ[state.freq].label.toLowerCase()}</span>
          </div>
        </div>

        {state.view!=='onboarding' && (
          <header className="topbar">
            <div><h1>{topTitle}</h1><p>{topSub}</p></div>
            {state.view==='dashboard' && (
              <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
                <button className="btn btn-primary" data-od-id="cta-receive-income" disabled={state.received >= state.ingresoMensual - 0.01} onClick={receiveIncome}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  {state.received >= state.ingresoMensual - 0.01 ? 'Mes completo' : 'Registrar ingreso'}
                </button>
                {state.varIncome && (
                  <button className="btn btn-ghost" data-od-id="cta-variable-income" onClick={openVarModal}>
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v8M8 12h8"/><circle cx="12" cy="12" r="9"/></svg>Ingreso variable</button>
                )}
              </div>
            )}
          </header>
        )}
        {state.view==='onboarding' && <header className="topbar" style={{marginBottom:0}}><div style={{display:'none'}}></div></header>}

        {state.view==='dashboard' && <section className="view" data-od-id="dashboard">{renderDashboard()}</section>}
        {state.view==='spending' && <section className="view" data-od-id="spending">{renderSpending()}</section>}
        {state.view==='calculator' && <section className="view" data-od-id="calculator">{renderCalculator()}</section>}
        {state.view==='settings' && <section className="view" data-od-id="settings">{renderSettings()}</section>}
        {state.view==='onboarding' && <section className="view" data-od-id="onboarding">{renderOnboarding()}</section>}
      </main>

      <aside className="sidebar" data-od-id="sidebar">
        <nav className="nav">
          <a href="#" data-nav="dashboard" data-od-id="nav-dashboard" className={state.view==='dashboard'?'active':''} onClick={e=>{e.preventDefault(); go('dashboard')}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="7.5" height="16" rx="1.5"/><rect x="13.5" y="4" width="7.5" height="9.5" rx="1.5"/><rect x="13.5" y="16.5" width="7.5" height="3.5" rx="1.5"/></svg><span>Sobres</span>
          </a>
          <a href="#" data-nav="spending" data-od-id="nav-spending" className={state.view==='spending'?'active':''} onClick={e=>{e.preventDefault(); go('spending')}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M12 3a9 9 0 0 1 9 9"/></svg><span>En qué gastas</span>
          </a>
          <a href="#" data-nav="calculator" data-od-id="nav-calculator" className={state.view==='calculator'?'active':''} onClick={e=>{e.preventDefault(); go('calculator')}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/></svg><span>Planificador</span>
          </a>
          <a href="#" data-nav="settings" data-od-id="nav-settings" className={state.view==='settings'?'active':''} onClick={e=>{e.preventDefault(); go('settings')}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg><span>Ajustes</span>
          </a>
        </nav>
      </aside>

      <div className={`scrim${showScrim?' show':''}`} onClick={()=>{ if(catModal) closeCatModal(); else if(varModal) closeVarModal(); else setDrawerId(null) }} />

      {catModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Nueva categoría">
          <div className="modal-card">
            <h3>Nueva categoría</h3>
            <div className="lead">Dale nombre, icono, color y máximo mensual.</div>
            <div className="field"><label>Nombre</label><input type="text" value={catName} onChange={e=>setCatName(e.target.value)} maxLength={24} placeholder="Ej. Mascotas" /></div>
            <div className="field"><label>Icono</label>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <span className="cat-ico" style={{"--c":colorOf(catColor).a,"--t":colorOf(catColor).soft}}><Icon id={catIcon} /></span>
                <select value={catIcon} onChange={e=>setCatIcon(e.target.value)} style={{flex:1,minHeight:44,border:'1.5px solid var(--border)',borderRadius:10,padding:'0 10px',background:'var(--surface)'}}>
                  {ICON_LIB.map(o=> <option key={o.id} value={o.id}>{ICON_N[o.id]||o.id}</option>)}
                </select>
              </div>
            </div>
            <div className="field"><label>Color</label>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <span style={{width:22,height:22,borderRadius:7,background:colorOf(catColor).a,display:'inline-block',flex:'0 0 22px'}} />
                <select value={catColor} onChange={e=>setCatColor(e.target.value)} style={{flex:1,minHeight:44,border:'1.5px solid var(--border)',borderRadius:10,padding:'0 10px',background:'var(--surface)'}}>
                  {COLORS.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="field"><label>Máximo mensual ({state.currency})</label><input type="number" value={catMax} onChange={e=>setCatMax(e.target.value)} min="0" step="any" inputMode="decimal" placeholder="200" /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeCatModal}>Cancelar</button>
              <button className="btn btn-primary" data-od-id="cta-category-confirm" onClick={submitCat}>Crear</button>
            </div>
          </div>
        </div>
      )}

      {varModal && (
        <div className="modal">
          <div className="modal-card">
            <h3>Ingreso variable</h3>
            <div className="lead">Registra un ingreso extra de este mes (venta, extra, freelance...).</div>
            <div className="field"><label>Monto ({state.currency})</label><input type="number" value={varAmount} onChange={e=>setVarAmount(e.target.value)} min="0" step="any" inputMode="decimal" /></div>
            <div className="field"><label>Concepto (opcional)</label><input type="text" value={varConcept} onChange={e=>setVarConcept(e.target.value)} maxLength={40} /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeVarModal}>Cancelar</button>
              <button className="btn btn-primary" data-od-id="cta-variable-confirm" onClick={submitVar}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`drawer${drawerId?' show':''}`} data-od-id="envelope-drawer" aria-hidden={!drawerId}>
        {drawerId && renderDrawer()}
      </aside>

      <div className={`toast${toast?' show':''}`}>{toast}</div>

      {splash && (
        <div
          className={`splash${splashOut?' out':''}`}
          role="presentation"
          aria-hidden="true"
          onClick={()=>{ setSplashOut(true); setTimeout(()=> setSplash(false), 420) }}
        >
          <img src="/splash.png" alt="" draggable="false" />
        </div>
      )}
    </div>
  )
}
