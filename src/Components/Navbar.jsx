import { useLocation } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import './Navbar.css'

const titles = {
  '/': 'Dashboard',
  '/new-sale': 'New sale',
  '/sales': 'Sales and bills',
  '/inventory': 'Inventory',
  '/inventory/add': 'Add device',
  '/products': 'Products',
  '/products/add': 'Add product',
  '/loans': 'Loans',
  '/messages': 'Messages',
}

export default function Navbar({ onMenu }) {
  const { pathname } = useLocation()
  const title = titles[pathname] || (pathname.endsWith('/edit') ? 'Edit product' : 'Admin')
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <header className="navbar">
      <button className="navbar__menu" onClick={onMenu} aria-label="Open menu"><FiMenu size={22} /></button>
      <p className="navbar__title">{title}</p>
      <p className="navbar__date">{today}</p>
    </header>
  )
}