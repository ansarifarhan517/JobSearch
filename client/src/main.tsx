import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeWrapper from './ui-library/utilities/components/ThemeWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeWrapper>
    <App />
  </ThemeWrapper>
)
