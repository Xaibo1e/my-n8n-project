import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import Product from './pages/product';
import Orders from './pages/orders'; 
import Customers from './pages/customers'; 
import Reports from './pages/reports'; 
import Shop from './pages/shop'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/products" element={<Product />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers/>} />
        <Route path="/reports" element={<Reports/>} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;