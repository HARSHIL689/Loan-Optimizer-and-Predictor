import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { AuthProvider } from './context/AuthContext.jsx';
import { ScenarioProvider } from './context/ScenarioContext.jsx';
import App from './App.jsx'
import "./index.css"
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ScenarioProvider>
          <App />
        </ScenarioProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
