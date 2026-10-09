import { FiMail } from 'react-icons/fi'
import { FaLinkedinIn, FaGithub } from 'react-icons/fa'
import './Credit.css'

const TEAM = [
  {
    name: 'Abubakar Orakzai',
    role: 'Software Engineer',
    email: 'abubakarorakzai15@gmail.com',
    linkedin: 'https://www.linkedin.com/in/abubakar-orakzai-7040642a1/',
    github: 'https://github.com/AbubakarOrakzai',
  },
  {
    name: 'Haseeb Khan',
    role: 'AI/ML Engineer',
    email: 'haseebkhanbettani@gmail.com',
    linkedin: 'https://www.linkedin.com/in/haseeb-khan-347aa22b8/',
    github: 'https://github.com/Haseebi-khan',
  },
]

const initials = (name) => name.split(' ').map((w) => w[0]).join('')

// variant="dark" for dark backgrounds (customer footer), "light" for light pages (admin).
export default function Credits({ variant = 'light' }) {
  return (
    <div className={`credits credits--${variant}`}>
      <p className="credits__label">Designed and developed by</p>

      <ul className="credits__team">
        {TEAM.map((m) => (
          <li key={m.email} className="credits__person">
            <span className="credits__avatar" aria-hidden="true">{initials(m.name)}</span>
            <span className="credits__who">
              <span className="credits__name">{m.name}</span>
              <span className="credits__role">{m.role}</span>
            </span>
            <span className="credits__links">
              <a href={m.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label={`${m.name} on LinkedIn`}><FaLinkedinIn /></a>
              <a href={m.github} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label={`${m.name} on GitHub`}><FaGithub /></a>
              <a href={`mailto:${m.email}`} title={m.email} aria-label={`Email ${m.name}`}><FiMail /></a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
