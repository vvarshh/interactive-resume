// Main React app
const { useState, useEffect, useRef } = React;

const NAV_TABS = ['Experience', 'Projects', 'Education', 'Skills', 'Tools', 'Leadership'];

function NavBar() {
  const [active, setActive] = useState('Experience');

  useEffect(() => {
    const observers = [];
    NAV_TABS.forEach(name => {
      const el = document.getElementById(`sec-${name.toLowerCase()}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(name); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (name) => {
    const el = document.getElementById(`sec-${name.toLowerCase()}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(name);
  };

  return (
    <nav className="section-nav" aria-label="Resume sections">
      {NAV_TABS.map(name => (
        <button
          key={name}
          className={`nav-tab${active === name ? ' active' : ''}`}
          onClick={() => scrollTo(name)}
        >
          {name}
        </button>
      ))}
    </nav>
  );
}

function ExpCard({ exp, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setMaxH(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`exp-card ${isOpen ? 'is-open' : ''} ${exp.current ? 'is-current' : ''}`}>
      <button className="exp-header" onClick={onToggle} aria-expanded={isOpen}>
        <div className={`exp-logo${exp.logoImg ? ' logo-has-img' : ''}`} style={{ background: exp.logoImg ? 'white' : exp.logoColor, color: 'white' }}>
          {exp.logoImg
            ? <img src={exp.logoImg} alt={exp.company} className="logo-img" />
            : exp.logoText}
        </div>
        <div className="exp-meta">
          <p className="exp-role">{exp.role}</p>
          <p className="exp-company">
            {exp.company}
            {exp.current && <span className="exp-current-badge">Now</span>}
          </p>
          {exp.client && <p className="exp-loc" style={{marginTop: 3}}>Client: {exp.client}</p>}
        </div>
        <div className="exp-dates">
          <p className="exp-date">{exp.dates}</p>
          <p className="exp-loc">
            <Icon name="pin" size={11} /> {exp.location}
          </p>
        </div>
        <div className="exp-chevron"><Icon name="chevron" size={14} /></div>
      </button>
      <div className="exp-body" style={{ maxHeight: maxH + 'px' }} ref={bodyRef}>
        <div className="exp-body-inner">
          <p className="exp-tagline">{exp.tagline}</p>
          <ul className="exp-bullets">
            {exp.bullets.map((b, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
            ))}
          </ul>
          <div className="exp-tags">
            {exp.tags.map((t, i) => (
              <span key={i} className={i === 0 ? 'tag tag-accent' : 'tag'}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ data }) {
  return (
    <aside className="sidebar">
      <div className={`avatar${data.profilePhoto ? '' : ' avatar-stripes'}`}>
        {data.profilePhoto
          ? <img src={data.profilePhoto} alt={data.name} className="avatar-photo" />
          : <span style={{background:'rgba(0,0,0,0.25)',padding:'4px 8px',borderRadius:6,backdropFilter:'blur(4px)'}}>VR</span>
        }
      </div>
      <h1 className="name">{data.name}</h1>
      <p className="role">{data.role}</p>

      <p className="quote">
        {data.quote.text}
        <span className="quote-author">— {data.quote.author}</span>
      </p>

      <div className="info-list">
        <a className="info-item" href={`mailto:${data.contact.email}`}>
          <span className="info-icon"><Icon name="mail" size={14} /></span>
          <div>
            <p className="info-label">Email</p>
            <p className="info-value">{data.contact.email}</p>
          </div>
        </a>
        <a className="info-item" href={`tel:${data.contact.phone}`}>
          <span className="info-icon"><Icon name="phone" size={14} /></span>
          <div>
            <p className="info-label">Phone</p>
            <p className="info-value">{data.contact.phone}</p>
          </div>
        </a>
        <div className="info-item">
          <span className="info-icon"><Icon name="pin" size={14} /></span>
          <div>
            <p className="info-label">Location</p>
            <p className="info-value">{data.contact.location}</p>
            <p className="info-value" style={{fontSize:11, color:'var(--text-faint)', marginTop:3}}>{data.citizenship}</p>
          </div>
        </div>
        <a className="info-item" href={data.contact.linkedinUrl} target="_blank" rel="noreferrer">
          <span className="info-icon"><Icon name="linkedin" size={14} /></span>
          <div>
            <p className="info-label">LinkedIn</p>
            <p className="info-value">{data.contact.linkedin}</p>
          </div>
        </a>
      </div>

      <p className="side-h">About</p>
      <p style={{fontSize:12, color:'var(--text-on-dark)', margin:0, lineHeight:1.55}}>{data.about}</p>

      <p className="side-h">Languages</p>
      <div className="lang-list">
        {data.languages.map((l, i) => (
          <div key={i} className="lang-item">
            <span className="flag">{l.flag}</span>
            <div>
              <p className="lang-name">{l.name}</p>
              <p className="lang-level">{l.level}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('rt') || 'light');
  const [openIdx, setOpenIdx] = useState(0);
  const data = window.RESUME;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rt', theme);
  }, [theme]);

  useEffect(() => {
    const tb = document.getElementById('toolbar');
    if (!tb) return;
    tb.innerHTML = '';
    const toggle = document.createElement('button');
    toggle.className = 'icon-btn';
    toggle.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.onclick = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    const print = document.createElement('button');
    print.className = 'icon-btn';
    print.title = 'Print to PDF';
    print.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
    print.onclick = () => window.print();

    tb.appendChild(toggle);
    tb.appendChild(print);
  }, [theme]);

  return (
    <div className="page">
      <Sidebar data={data} />
      <main className="main">
        <NavBar />
        <div className="timeline">

          <section id="sec-experience" className="section" data-screen-label="Experience">
            <h2 className="section-title">Experience</h2>
            <p style={{fontSize:12,color:'var(--text-faint)',margin:'-12px 0 16px'}}>Click any role to expand the details.</p>
            {data.experience.map((exp, i) => (
              <ExpCard
                key={i}
                exp={exp}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
              />
            ))}
          </section>

          <section id="sec-projects" className="section" data-screen-label="Projects">
            <h2 className="section-title">Latest Projects</h2>
            <div className="projects-grid">
              {data.projects.map((p, i) => (
                <a key={i} className="project-card" href="#">
                  <div className="project-thumb">
                    <div className="project-thumb-icon" style={{color: p.iconColor, fontSize: 22}}>{p.icon}</div>
                  </div>
                  <div className="project-body">
                    <p className="project-title">{p.title}</p>
                    <p className="project-desc">{p.desc}</p>
                    <span className="project-link">
                      <Icon name="ext" size={11} /> {p.link}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section id="sec-education" className="section" data-screen-label="Education">
            <h2 className="section-title">Education</h2>
            <div className="edu-grid">
              {data.education.map((e, i) => (
                <div key={i} className="edu-card">
                  <div className={`edu-logo${e.logoImg ? ' logo-has-img' : ''}`} style={{background: e.logoImg ? 'white' : e.logoColor}}>
                    {e.logoImg ? <img src={e.logoImg} alt={e.school} className="logo-img" /> : e.logoText}
                  </div>
                  <div>
                    <p className="edu-tag">University</p>
                    <p className="edu-school">{e.school}</p>
                    <p className="edu-detail">{e.detail}</p>
                    <p className="edu-detail" style={{fontSize:11,color:'var(--text-faint)',marginTop:4}}>{e.coursework}</p>
                    <p className="edu-date">{e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="sec-skills" className="section" data-screen-label="Skills">
            <h2 className="section-title">Skills</h2>
            {data.skills.map((s, i) => (
              <div key={i} className="skill-row">
                <div className="skill-cat">
                  <span className="skill-cat-icon" style={{background: s.iconColor}}>
                    <Icon name={s.icon} size={14} stroke="white" />
                  </span>
                  <p className="skill-cat-name">{s.cat}</p>
                </div>
                <div className="skill-grid">
                  {s.items.map((it, j) => <span key={j} className="skill-pill">{it}</span>)}
                </div>
              </div>
            ))}
          </section>

          <section id="sec-tools" className="section" data-screen-label="Tools">
            <h2 className="section-title">Tools</h2>
            <div className="tools-grid">
              {data.tools.map((t, i) => (
                <div key={i} className="tool-card">
                  <div className={`tool-logo${t.imgUrl ? ' logo-has-img' : ''}`} style={{background: t.imgUrl ? 'white' : t.color, color: 'white', fontWeight: 600, fontSize: 14}}>
                    {t.imgUrl ? <img src={t.imgUrl} alt={t.name} className="logo-img" /> : t.letter}
                  </div>
                  <p className="tool-name">{t.name}</p>
                  <p className="tool-desc">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="sec-leadership" className="section" data-screen-label="Leadership">
            <h2 className="section-title">Leadership & Activities</h2>
            <div className="lead-grid">
              {data.leadership.map((l, i) => (
                <div key={i} className="lead-card">
                  <span className="lead-icon"><Icon name={l.icon} size={14} /></span>
                  <div>
                    <p className="lead-title">{l.title}</p>
                    <p className="lead-detail">{l.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
