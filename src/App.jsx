import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Components/Sidebar'
import Navbar from './Components/Navbar'
import Dashboard from './Pages/Dashboard'
import NewSale from './Pages/NewSale'
import Sales from './Pages/Sales'
import Inventory from './Pages/Inventory'
import AddDevice from './Pages/AddDevice'
import ProductList from './Pages/ProductList'
import AddProduct from './Pages/AddProduct'
import EditProduct from './Pages/EditProduct'
import Loans from './Pages/Loans'
import Messages from './Pages/Messages'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="layout__main">
        <Navbar onMenu={() => setMenuOpen(true)} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-sale" element={<NewSale />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/add" element={<AddDevice />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/:id/edit" element={<EditProduct />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<p className="empty">Page not found.</p>} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </div>
  )
}