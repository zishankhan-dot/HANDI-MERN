import React from 'react';
import Register from './pages/register_login';
import Dashboard from './pages/dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/Authenticate' element={<Register/>}></Route>
          <Route path='/Dashboard' element={<Dashboard/>}></Route>
        </Routes>
      </Router>
      
      
    </div>
  );
}

export default App;
