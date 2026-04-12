import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { CartProvider } from './context/CartContext';
import LandingPage  from './pages/LandingPage';
import App          from './App';
import SinglePrint  from './pages/SinglePrint';
import SuccessPage  from './pages/SuccessPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/"             element={<LandingPage />} />
          <Route path="/travel-map"   element={<App />} />
          <Route path="/single-print" element={<SinglePrint />} />
          <Route path="/success"      element={<SuccessPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
