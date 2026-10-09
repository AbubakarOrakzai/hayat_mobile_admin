import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './Components/ProtectedRoute'
import Sidebar from './Components/Sidebar'
import Navbar from './Components/Navbar'
import AdminFooter from './Components/AdminFooter'
import Login from './Pages/Login'
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

// Sidebar and top bar around every page that needs a login.
function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="layout__main">
        <Navbar onMenu={() => setMenuOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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
        </Route>
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </>
  )
}