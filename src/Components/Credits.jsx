import { FiMail } from 'react-icons/fi'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
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

// variant="dark" for dark backgrounds (customer footer), "light" for light pages (admin).
export default function Credits({ variant = 'light' }) {
  return (
    <details className={`credits credits--${variant}`}>
      <summary className="credits__summary">
        <span>
          Designed and developed by <strong>Abubakar Orakzai</strong> &amp; <strong>Haseeb Khan</strong>
        </span>
        <span className="credits__more">Team profiles</span>
      </summary>

      <div className="credits__grid">
        {TEAM.map((m) => (
          <article key={m.email} className="credits__card">
            <h3 className="credits__name">{m.name}</h3>
            <p className="credits__role">{m.role}</p>
            <ul className="credits__links">
              <li><a href={`mailto:${m.email}`}><FiMail /> {m.email}</a></li>
              <li><a href={m.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a></li>
              <li><a href={m.github} target="_blank" rel="noopener noreferrer"><FaGithub /> GitHub</a></li>
            </ul>
          </article>
        ))}
      </div>
    </details>
  )
}