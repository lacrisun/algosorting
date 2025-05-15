import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Keep global styles
// Import the Home component which contains our visualizer logic
import Home from './app/page' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Render the Home component instead of the default App */}
    <Home />
  </StrictMode>,
)

