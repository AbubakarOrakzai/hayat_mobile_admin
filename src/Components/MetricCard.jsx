import './MetricCard.css'

export default function MetricCard({ label, value, hint, tone = 'default' }) {
  return (
    <div className={`metric metric--${tone}`}>
      <p className="metric__label">{label}</p>
      <p className="metric__value">{value}</p>
      {hint && <p className="metric__hint">{hint}</p>}
    </div>
  )
}