import './StatusBadge.css'

const labels = { paid: 'Paid', pending: 'Pending', partial: 'Part paid', in_stock: 'In stock', sold: 'Sold' }

export default function StatusBadge({ status }) {
  return <span className={`badge badge--${status}`}>{labels[status] || status}</span>
}