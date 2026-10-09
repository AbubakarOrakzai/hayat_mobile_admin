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
  {
    name: 'Muhammad Umer',
    role: 'ML/AI Cloud Engineer',
    linkedin: 'https://www.linkedin.com/in/muhammad-umer-3a9120213/',
    github: 'https://github.com/umerkang66',
  },
]

// First and last initial, e.g. "Muhammad Umer" -> "MU"
const initials = (name) => {
  const words = name.split(' ')
  return words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')
}

// variant="dark" for dark backgrounds (customer footer), "light" for light pages (admin).
export default function Credits({ variant = 'light' }) {
  return (
    <div className={`credits credits--${variant}`}>
      <p className="credits__label">Designed and developed by</p>

      <ul className="credits__team">
        {TEAM.map((m) => (
          <li key={m.name} className="credits__person">
            <span className="credits__avatar" aria-hidden="true">{initials(m.name)}</span>
            <span className="credits__who">
              <span className="credits__name">{m.name}</span>
              <span className="credits__role">{m.role}</span>
            </span>
            {/* a button only shows when that link is filled in */}
            <span className="credits__links">
              {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label={`${m.name} on LinkedIn`}><FaLinkedinIn /></a>}
              {m.github && <a href={m.github} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label={`${m.name} on GitHub`}><FaGithub /></a>}
              {m.email && <a href={`mailto:${m.email}`} title={m.email} aria-label={`Email ${m.name}`}><FiMail /></a>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
