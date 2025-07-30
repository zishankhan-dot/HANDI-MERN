import React from 'react';
import Register from './pages/register_login';
import Dashboard from './pages/dashboard';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import Navigation from './components/Navigation';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global-square.css';

function App() {
  return (
    <CartProvider>
      <div>
        <Router>
          <Navigation />
          <Routes>
            {/* Default route - redirect to dashboard */}
            <Route path='/' element={<Navigate to="/dashboard" replace />} />
            
            {/* User authentication routes */}
            <Route path='/authenticate' element={<Register/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Register/>} />
            
            {/* Main dashboard route */}
            <Route path='/dashboard' element={<Dashboard/>} />
            
            {/* Cart route */}
            <Route path='/cart' element={<Cart/>} />
            
            {/* Admin routes - using obscure path for security */}
            <Route path='/admin-portal-secure' element={<AdminPanel/>} />
            <Route path='/admin' element={<Navigate to="/admin-portal-secure" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path='*' element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </div>
    </CartProvider>
  );
}

export default App;
