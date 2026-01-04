import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import EcommerceStore from './components/EcommerceStore'
import ProductDetail from './components/ProductDetail'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EcommerceStore />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
