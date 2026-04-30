import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:5001'

const AOK_LABELS = {
  'ALP': 'Arts, Literature & Performance',
  'CZ': 'Civilizations',
  'NS': 'Natural Sciences',
  'QS': 'Quantitative Studies',
  'SS': 'Social Sciences'
}

const MOI_LABELS = {
  'CCI': 'Cross-Cultural Inquiry',
  'EI': 'Ethical Inquiry',
  'FL': 'Foreign Language',
  'R': 'Research',
  'STS': 'Science, Technology & Society',
  'W': 'Writing'
}

export default function App() {
  const [subjects, setSubjects] = useState([])
  const [courses, setCourses] = useState([])
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [aok, setAok] = useState('')
  const [moi, setMoi] = useState([])
  const [aokOptions, setAokOptions] = useState([])
  const [moiOptions, setMoiOptions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/api/subjects`).then(r => r.json()).then(setSubjects)
    fetch(`${API}/api/aok`).then(r => r.json()).then(setAokOptions)
    fetch(`${API}/api/moi`).then(r => r.json()).then(setMoiOptions)
  }, [])
    

  const fetchCourses = () => {
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams()
    if (subject) params.append('subject', subject)
    if (level) params.append('level', level)
    if (search) params.append('search', search)
    if (aok) params.append('aok', aok)
    moi.forEach(m => params.append('moi', m))
    fetch(`${API}/api/courses?${params}`)
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false) })
  }

  const handleKey = e => { if (e.key === 'Enter') fetchCourses() }

  const levelLabel = n => ({ 100: '100-level', 200: '200-level', 300: '300-level', 400: '400-level', 500: '500-level' }[n] || '')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ee; font-family: 'DM Sans', sans-serif; color: #1a1a2e; min-height: 100vh; }

        .hero {
          background: #00247d;
          padding: 48px 40px 40px;
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        .hero-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          background: rgba(196,160,0,0.12);
          border-radius: 50%;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: -80px; left: 30%;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c4a000;
          margin-bottom: 10px;
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .hero-sub {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          font-weight: 300;
        }

        .filter-bar {
          background: #fff;
          border-bottom: 1px solid #e8e4dc;
          padding: 20px 40px;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .filter-bar-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          gap: 12px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filter-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #888;
        }
        select, input {
          border: 1.5px solid #e0dbd0;
          border-radius: 6px;
          padding: 9px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a2e;
          background: #fafaf8;
          outline: none;
          transition: border-color 0.2s;
        }
        select:focus, input:focus { border-color: #00247d; background: #fff; }
        input.search { width: 260px; }

        .btn-filter {
          background: #00247d;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-filter:hover { background: #001a5c; }
        .btn-filter:active { transform: scale(0.98); }

        .results-area { padding: 32px 40px; max-width: 1100px; margin: 0 auto; }

        .results-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 20px;
        }
        .results-count {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: #1a1a2e;
        }
        .results-sub { font-size: 13px; color: #999; }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .course-card {
          background: #fff;
          border: 1px solid #e8e4dc;
          border-radius: 10px;
          padding: 18px 20px;
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }
        .course-card:hover {
          box-shadow: 0 6px 24px rgba(0,36,125,0.10);
          transform: translateY(-2px);
        }
        .card-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .subject-badge {
          background: #eef1fa;
          color: #00247d;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 4px;
        }
        .course-num {
          font-size: 12px;
          color: #bbb;
          font-weight: 400;
        }
        .level-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #c4a000;
          margin-left: auto;
          flex-shrink: 0;
        }
        .course-name {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          color: #1a1a2e;
        }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
          color: #bbb;
        }
        .empty-state p { font-size: 15px; }
        .loading { text-align: center; padding: 60px; color: #aaa; font-size: 14px; letter-spacing: 1px; }
      `}</style>

      <div className="hero">
        <div className="hero-inner">

          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button onClick={() => navigate('/')} style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
              padding: '6px 16px', fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, cursor: 'pointer'
            }}>← Home</button>
            <button onClick={() => navigate('/compare')} style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
              padding: '6px 16px', fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, cursor: 'pointer'
            }}>Compare Courses </button>
            <button onClick={() => navigate('/profile')} style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
              padding: '6px 16px', fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, cursor: 'pointer'
            }}>My Profile</button>
            <button onClick={() => navigate('/scheduler')} style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
              padding: '6px 16px', fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, cursor: 'pointer'
            }}>Smart Scheduler</button>
            <button onClick={() => navigate('/bluebot')} style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
              padding: '6px 16px', fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, cursor: 'pointer'
            }}>Bluebot 🔵</button>
          </div>          

          <div className="hero-eyebrow">Duke University</div>
          <h1>Course Search</h1>
          <p className="hero-sub">Browse and filter Duke courses by subject, level, or keyword</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-group">
            <span className="filter-label">Subject</span>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Level</span>
            <select value={level} onChange={e => setLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value="100">100-level</option>
              <option value="200">200-level</option>
              <option value="300">300-level</option>
              <option value="400">400-level</option>
              <option value="500">500-level</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Area of Knowledge</span>
            <select value={aok} onChange={e => setAok(e.target.value)}>
              <option value="">All Areas</option>
              {aokOptions.map(a => <option key={a} value={a}>{AOK_LABELS[a] || a}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Mode of Inquiry</span>
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 6, width: '100%'}}>
              {moiOptions.map(m => (
                <label key={m} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: moi.includes(m) ? '#eef1fa' : '#fafaf8',
                  border: `1.5px solid ${moi.includes(m) ? '#00247d' : '#e0dbd0'}`,
                  borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
                  fontSize: 13, color: moi.includes(m) ? '#00247d' : '#1a1a2e'
                }}>
                  <input
                    type="checkbox"
                    checked={moi.includes(m)}
                    onChange={e => {
                      if (e.target.checked) setMoi([...moi, m])
                      else setMoi(moi.filter(x => x !== m))
                    }}
                    style={{display: 'none'}}
                  />
                  {MOI_LABELS[m] || m}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Keyword</span>
            <input className="search" placeholder="e.g. machine learning, ethics..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleKey} />
          </div>
          <button className="btn-filter" onClick={fetchCourses}>Filter Courses</button>
        </div>
      </div>

      <div className="results-area">
        {loading && <div className="loading">Loading courses...</div>}

        {!loading && courses.length > 0 && (
          <>
            <div className="results-header">
              <span className="results-count">{courses.length} courses found</span>
              <span className="results-sub">
                {subject || 'All subjects'}{level ? ` · ${levelLabel(parseInt(level))}` : ''}{search ? ` · "${search}"` : ''}
              </span>
            </div>
            <div className="course-grid">
              {courses.map(c => (
                <div className="course-card" key={c.course_id}>
                  <div className="card-top">
                    <span className="subject-badge">{c.subject}</span>
                    <span className="course-num">{c.number}</span>
                    <span className="level-dot" />
                  </div>
                  <div className="course-name">{c.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && searched && courses.length === 0 && (
          <div className="empty-state">
            <p>No courses match your filters. Try broadening your search.</p>
          </div>
        )}

        {!searched && (
          <div className="empty-state">
            <p>Select filters above and click <strong>Filter Courses</strong> to browse.</p>
          </div>
        )}
      </div>
    </>
  )
}