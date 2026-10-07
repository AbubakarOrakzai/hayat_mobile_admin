import { NavLink } from 'react-router-dom'
import { FiHome, FiShoppingCart, FiFileText, FiBox, FiPlusSquare, FiSmartphone, FiCreditCard, FiMail } from 'react-icons/fi'
import { SHOP } from '../config'
import './Sidebar.css'

const links = [
  ['/', 'Dashboard', FiHome, true],
  ['/new-sale', 'New sale', FiShoppingCart],
  ['/sales', 'Sales and bills', FiFileText],
  ['/inventory', 'Inventory', FiBox, true],
  ['/inventory/add', 'Add device', FiPlusSquare],
  ['/products', 'Products', FiSmartphone],
  ['/loans', 'Loans', FiCreditCard],
  ['/messages', 'Messages', FiMail],
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="sidebar__backdrop" onClick={onClose} />}
      <aside className={open ? 'sidebar sidebar--open' : 'sidebar'}>
        <div className="sidebar__brand">
          <span className="sidebar__logo"><FiSmartphone /></span>
          <div>
            <p className="sidebar__name">{SHOP.name}</p>
            <p className="sidebar__role">Admin panel</p>
          </div>
        </div>
        <nav className="sidebar__nav" aria-label="Admin">
          {links.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} className="sidebar__link" onClick={onClose}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}