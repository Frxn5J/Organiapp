import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    try { window.postMessage('sw-update-ready', '*') } catch {}
    try { window.__splashHasUpdate && window.__splashHasUpdate() } catch {}
    updateSW(true)
  },
  onOfflineReady() {
    try { window.__splashAllowHide && window.__splashAllowHide() } catch {}
  },
})
setTimeout(()=>{ try{ window.__splashAllowHide && window.__splashAllowHide() }catch{} }, 2800)
if(!navigator.onLine){ try{ window.__splashAllowHide && window.__splashAllowHide() }catch{} }
window.addEventListener('online', ()=>{ try{ window.__splashAllowHide && window.__splashAllowHide() }catch{} }, {once:true})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
