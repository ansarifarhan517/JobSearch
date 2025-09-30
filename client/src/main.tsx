import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeWrapper from './ui-library/utilities/components/ThemeWrapper.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <ThemeWrapper>
     <BrowserRouter>
       <App />
     </BrowserRouter>
  </ThemeWrapper>
)
