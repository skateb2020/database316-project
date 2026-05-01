import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:5001'

const AOK_LABELS = {
  'ALP': 'Arts, Literature & Performance', 'CZ': 'Civilizations',
  'NS': 'Natural Sciences', 'QS': 'Quantitative Studies', 'SS': 'Social Sciences'
}
const MOI_LABELS = {
  'CCI': 'Cross-Cultural Inquiry', 'EI': 'Ethical Inquiry', 'FL': 'Foreign Language',
  'R': 'Research', 'STS': 'Science, Technology & Society', 'W': 'Writing'
}
const AOK_NEW_LABELS = {
  'CE': 'Creating & Engaging with Art', 'HI': 'Humanistic Inquiry',
  'IJ': 'Institutions, Justice & Power', 'NW': 'Investigating the Natural World',
  'QC': 'Quantitative & Computational Reasoning', 'SB': 'Social & Behavioral Analysis'
}

export default function Optimizer() {
  const navigate = useNavigate()
  const [aokOptions, setAokOptions] = useState([])
  const [moiOptions, setMoiOptions] = useState([])
  const [aokNewOptions, setAokNewOptions] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedAok, setSelectedAok] = useState([])
  const [selectedMoi, setSelectedMoi] = useState([])
  const [selectedAokNew, setSelectedAokNew] = useState([])
  const [subject, setSubject] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/aok`).then(r => r.json()).then(setAokOptions)
    fetch(`${API}/api/moi`).then(r => r.json()).then(setMoiOptions)
    fetch(`${API}/api/aok_new`).then(r => r.json()).then(setAokNewOptions)
    fetch(`${API}/api/subjects`).then(r => r.json()).then(setSubjects)
  }, [])

  const findCourses = async () => {
    if (selectedAok.length + selectedMoi.length + selectedAokNew.length < 2) {
      alert('Select at least 2 requirements to find overlapping courses')
      return
    }
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams()
    selectedAok.forEach(a => params.append('aok', a))
    selectedMoi.forEach(m => params.append('moi', m))
    selectedAokNew.forEach(a => params.append('aok_new', a))
    if (subject) params.append('subject', subject)
    const res = await fetch(`${API}/api/optimize?${params}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) setList(list.filter(x => x !== item))
    else setList([...list, item])
  }

  const pillStyle = (active) => ({
    display: 'inline-flex', alignItems: 'center',
    background: active ? '#eef1fa' : '#fafaf8',
    border: `1.5px solid ${active ? '#00247d' : '#e0dbd0'}`,
    borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
    fontSize: 13, color: active ? '#00247d' : '#1a1a2e',
    margin: '3px'
  })

  const totalSelected = selectedAok.length + selectedMoi.length + selectedAokNew.length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ee; font-family: 'DM Sans', sans-serif; color: #1a1a2e; min-height: 100vh; }
        .hero { background: #00247d; padding: 48px 40px 40px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 300px; height: 300px; background: rgba(196,160,0,0.12); border-radius: 50%; }
        .hero::after { content: ''; position: absolute; bottom: -80px; left: 30%; width: 200px; height: 200px; background: rgba(255,255,255,0.04); border-radius: 50%; }
        .hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .hero-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #c4a000; margin-bottom: 10px; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .hero-sub { color: rgba(255,255,255,0.6); font-size: 15px; font-weight: 300; }
        .content { max-width: 1100px; margin: 0 auto; padding: 32px 40px; }
        .card { background: #fff; border: 1px solid #e8e4dc; border-radius: 12px; padding: 28px; margin-bottom: 24px; }
        .card-title { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 6px; color: #1a1a2e; }
        .card-sub { font-size: 13px; color: #888; margin-bottom: 16px; }
        .section-label { font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: #888; margin-bottom: 8px; margin-top: 16px; }
        .btn-primary { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 12px 32px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; }
        .btn-primary:hover { background: #001a5c; }
        .results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .course-card { background: #fff; border: 1px solid #e8e4dc; border-radius: 10px; padding: 18px 20px; }
        .card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
        .subject-badge { background: #eef1fa; color: #00247d; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; }
        .req-badge { background: #e8f5e9; color: #2e7d32; font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 4px; }
        .course-name { font-size: 14px; font-weight: 500; color: #1a1a2e; margin-bottom: 8px; }
        .req-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .empty-state { text-align: center; padding: 60px; color: #bbb; }
        .selected-count { display: inline-block; background: #00247d; color: #fff; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 600; margin-left: 8px; }
      `}</style>

      <div className="hero">
        <div className="hero-inner">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[['/', '← Home'], ['/search', 'Course Search'], ['/compare', 'Compare Courses'],
              ['/scheduler', 'Smart Scheduler'], ['/programs', 'Programs 🎓'],
              ['/professors', 'Prof Ratings ⭐'], ['/bluebot', 'Bluebot 🔵']].map(([path, label]) => (
              <button key={path} onClick={() => navigate(path)} style={{
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
                padding: '6px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>
          <div className="hero-eyebrow">Duke University</div>
          <h1>Course Optimizer</h1>
          <p className="hero-sub">Find courses that satisfy multiple requirements at once</p>
        </div>
      </div>

      <div className="content">
        <div className="card">
          <div className="card-title">
            Select Requirements
            {totalSelected > 0 && <span className="selected-count">{totalSelected} selected</span>}
          </div>
          <div className="card-sub">Pick 2 or more requirements — we'll find courses satisfying all of them simultaneously</div>

          <div className="section-label">Areas of Knowledge (Classic)</div>
          <div>
            {aokOptions.map(a => (
              <span key={a} style={pillStyle(selectedAok.includes(a))}
                onClick={() => toggleItem(a, selectedAok, setSelectedAok)}>
                {AOK_LABELS[a] || a}
              </span>
            ))}
          </div>

          <div className="section-label">Modes of Inquiry</div>
          <div>
            {moiOptions.map(m => (
              <span key={m} style={pillStyle(selectedMoi.includes(m))}
                onClick={() => toggleItem(m, selectedMoi, setSelectedMoi)}>
                {MOI_LABELS[m] || m}
              </span>
            ))}
          </div>

          <div className="section-label">Distribution Categories (2025+)</div>
          <div>
            {aokNewOptions.filter(a => ['CE','HI','IJ','NW','QC','SB'].includes(a)).map(a => (
              <span key={a} style={pillStyle(selectedAokNew.includes(a))}
                onClick={() => toggleItem(a, selectedAokNew, setSelectedAokNew)}>
                {AOK_NEW_LABELS[a] || a}
              </span>
            ))}
          </div>

          <div className="section-label">Filter by Subject (optional)</div>
          <select value={subject} onChange={e => setSubject(e.target.value)}
            style={{ border: '1.5px solid #e0dbd0', borderRadius: 6, padding: '9px 14px', fontFamily: 'DM Sans', fontSize: 14, outline: 'none', marginBottom: 20 }}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div>
            <button className="btn-primary" onClick={findCourses}>
              {loading ? 'Finding courses...' : 'Find Overlapping Courses'}
            </button>
          </div>
        </div>

        {!loading && results.length > 0 && (
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
              {results.length} courses found
            </div>
            <div className="results-grid">
              {results.map(c => (
                <div key={c.course_id} className="course-card">
                  <div className="card-top">
                    <span className="subject-badge">{c.subject}</span>
                    <span style={{ fontSize: 12, color: '#bbb' }}>{c.number}</span>
                  </div>
                  <div className="course-name">{c.name}</div>
                  <div className="req-row">
                    {c.aok.map(a => <span key={a} className="req-badge">{AOK_LABELS[a] || a}</span>)}
                    {c.moi.map(m => <span key={m} className="req-badge" style={{ background: '#fdf8e1', color: '#c4a000' }}>{MOI_LABELS[m] || m}</span>)}
                    {c.aok_new.map(a => <span key={a} className="req-badge" style={{ background: '#eef1fa', color: '#00247d' }}>{AOK_NEW_LABELS[a] || a}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="empty-state">No courses found satisfying all selected requirements simultaneously.</div>
        )}

        {!searched && (
          <div className="empty-state">Select at least 2 requirements above and click Find Overlapping Courses.</div>
        )}
      </div>
    </>
  )
}