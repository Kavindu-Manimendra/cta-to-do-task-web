import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {SnackbarProvider} from "notistack";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <SnackbarProvider
          maxSnack={5}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
          <App />
      </SnackbarProvider>
  </StrictMode>,
)
