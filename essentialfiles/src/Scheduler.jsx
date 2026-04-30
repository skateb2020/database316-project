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
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function Scheduler() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('blueprint_user') || 'null')

  const [plannedCourses, setPlannedCourses] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [courseSearch, setCourseSearch] = useState('')
  const [courseResults, setCourseResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [aokOptions, setAokOptions] = useState([])
  const [moiOptions, setMoiOptions] = useState([])

  // Preferences
  const [earliestTime, setEarliestTime] = useState('09:00')
  const [avoidDays, setAvoidDays] = useState([])
  const [prefAok, setPrefAok] = useState('')
  const [prefMoi, setPrefMoi] = useState('')
  const [prefSubject, setPrefSubject] = useState('')
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    fetch(`${API}/api/aok`).then(r => r.json()).then(setAokOptions)
    fetch(`${API}/api/moi`).then(r => r.json()).then(setMoiOptions)
    fetch(`${API}/api/subjects`).then(r => r.json()).then(setSubjects)
    if (user) fetchPlanned()
  }, [])

  const fetchPlanned = async () => {
    const res = await fetch(`${API}/api/student/${user.student_id}/planned-offerings`)
    const data = await res.json()
    setPlannedCourses(data)
  }

  const searchCourses = async () => {
    if (!courseSearch) return
    const res = await fetch(`${API}/api/courses?search=${courseSearch}`)
    const data = await res.json()
    setCourseResults(data)
  }

  const addPlanned = async (course_id) => {
    await fetch(`${API}/api/student/${user.student_id}/planned-offerings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id })
    })
    fetchPlanned()
    setCourseResults([])
    setCourseSearch('')
  }

  const removePlanned = async (course_id) => {
    await fetch(`${API}/api/student/${user.student_id}/planned-offerings`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id })
    })
    fetchPlanned()
  }

  const getRecommendations = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('student_id', user.student_id)
    params.append('earliest_time', earliestTime)
    avoidDays.forEach(d => params.append('avoid_days', d))
    if (prefAok) params.append('aok', prefAok)
    if (prefMoi) params.append('moi', prefMoi)
    if (prefSubject) params.append('subject', prefSubject)
    const res = await fetch(`${API}/api/recommendations?${params}`)
    const data = await res.json()
    setRecommendations(data)
    setLoading(false)
  }

  const formatTime = (t) => {
    if (!t) return 'TBA'
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const formatDays = (days) => {
    if (!days || days.length === 0) return 'TBA'
    const short = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri' }
    return days.filter(Boolean).map(d => short[d] || d).join(', ')
  }

  if (!user) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Please <span style={{ color: '#00247d', cursor: 'pointer' }} onClick={() => navigate('/profile')}>sign in</span> to use Smart Scheduler.</p>
    </div>
  )

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
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .card { background: #fff; border: 1px solid #e8e4dc; border-radius: 12px; padding: 28px; }
        .card-title { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 20px; color: #1a1a2e; }
        .field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
        .field label { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: #888; }
        .field input, .field select { border: 1.5px solid #e0dbd0; border-radius: 6px; padding: 9px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a2e; background: #fafaf8; outline: none; }
        .field input:focus, .field select:focus { border-color: #00247d; }
        .search-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .search-row input { flex: 1; border: 1.5px solid #e0dbd0; border-radius: 6px; padding: 9px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; }
        .search-row input:focus { border-color: #00247d; }
        .search-row button { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 9px 18px; font-size: 13px; cursor: pointer; }
        .btn-primary { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 11px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; width: 100%; margin-top: 8px; }
        .btn-primary:hover { background: #001a5c; }
        .result-item { padding: 10px 12px; border: 1px solid #e8e4dc; border-radius: 6px; cursor: pointer; font-size: 13px; margin-bottom: 6px; transition: all 0.15s; }
        .result-item:hover { border-color: #00247d; background: #eef1fa; }
        .course-tag { display: inline-flex; align-items: center; gap: 6px; background: #eef1fa; color: #00247d; border-radius: 6px; padding: 5px 10px; font-size: 12px; font-weight: 500; margin: 4px; }
        .course-tag button { background: none; border: none; color: #00247d; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; }
        .day-pills { display: flex; flex-wrap: wrap; gap: 6px; }
        .day-pill { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1.5px solid #e0dbd0; background: #fafaf8; color: #1a1a2e; }
        .day-pill.active { background: #eef1fa; border-color: #00247d; color: #00247d; }
        .rec-card { background: #fff; border: 1px solid #e8e4dc; border-radius: 10px; padding: 18px 20px; margin-bottom: 12px; transition: box-shadow 0.2s; }
        .rec-card:hover { box-shadow: 0 4px 16px rgba(0,36,125,0.1); }
        .rec-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .subject-badge { background: #eef1fa; color: #00247d; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; }
        .rec-name { font-size: 15px; font-weight: 500; color: #1a1a2e; margin-bottom: 6px; }
        .rec-meta { font-size: 12px; color: #888; display: flex; gap: 16px; flex-wrap: wrap; }
        .empty { text-align: center; padding: 40px; color: #bbb; font-size: 14px; }
        .full-width { grid-column: 1 / -1; }
      `}</style>

      <div className="hero">
        <div className="hero-inner">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[['/', '← Home'], ['/search', 'Course Search'], ['/compare', 'Compare Courses'], ['/profile', 'My Profile'], ['/bluebot', 'Bluebot 🔵']].map(([path, label]) => (
              <button key={path} onClick={() => navigate(path)} style={{
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
                padding: '6px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>
          <div className="hero-eyebrow">Duke University</div>
          <h1>Smart Scheduler</h1>
          <p className="hero-sub">Build your perfect schedule — we'll find courses that fit</p>
        </div>
      </div>

      <div className="content">
        <div className="grid">

          {/* Current Schedule */}
          <div className="card">
            <div className="card-title">My Registered Courses</div>
            <div className="search-row">
              <input
                placeholder="Search to add a course..."
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchCourses()}
              />
              <button onClick={searchCourses}>Add</button>
            </div>
            {courseResults.length > 0 && (
              <div style={{ marginBottom: 12, maxHeight: 180, overflowY: 'auto' }}>
                {courseResults.slice(0, 8).map(c => (
                  <div key={c.course_id} className="result-item" onClick={() => addPlanned(c.course_id)}>
                    <strong>{c.subject} {c.number}</strong> — {c.name}
                  </div>
                ))}
              </div>
            )}
            {plannedCourses.length === 0
              ? <div className="empty">No courses added yet.</div>
              : plannedCourses.map(c => (
                <div key={c.offering_id} className="rec-card">
                  <div className="rec-top">
                    <span className="subject-badge">{c.subject}</span>
                    <span style={{ fontSize: 12, color: '#bbb' }}>{c.number}</span>
                  </div>
                  <div className="rec-name">{c.name}</div>
                  <div className="rec-meta">
                    <span>🕐 {formatTime(c.start_time)} – {formatTime(c.end_time)}</span>
                    <span>📅 {formatDays(c.days)}</span>
                    {c.location && <span>📍 {c.location}</span>}
                    <button onClick={() => removePlanned(c.course_id)} style={{
                      background: 'none', border: 'none', color: '#c0392b',
                      cursor: 'pointer', fontSize: 12, marginLeft: 'auto'
                    }}>Remove</button>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="card-title">My Preferences</div>
            <div className="field">
              <label>Earliest Start Time</label>
              <input type="time" value={earliestTime} onChange={e => setEarliestTime(e.target.value)} />
            </div>
            <div className="field">
              <label>Avoid These Days</label>
              <div className="day-pills">
                {DAYS.map(d => (
                  <div key={d} className={`day-pill ${avoidDays.includes(d) ? 'active' : ''}`}
                    onClick={() => setAvoidDays(avoidDays.includes(d) ? avoidDays.filter(x => x !== d) : [...avoidDays, d])}>
                    {d.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Must Satisfy AoK</label>
              <select value={prefAok} onChange={e => setPrefAok(e.target.value)}>
                <option value="">Any</option>
                {aokOptions.map(a => <option key={a} value={a}>{AOK_LABELS[a] || a}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Must Satisfy MoI</label>
              <select value={prefMoi} onChange={e => setPrefMoi(e.target.value)}>
                <option value="">Any</option>
                {moiOptions.map(m => <option key={m} value={m}>{MOI_LABELS[m] || m}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Subject / Department</label>
              <select value={prefSubject} onChange={e => setPrefSubject(e.target.value)}>
                <option value="">Any</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn-primary" onClick={getRecommendations}>
              {loading ? 'Finding courses...' : 'Find Courses For Me'}
            </button>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="card full-width">
              <div className="card-title">Recommended Courses ({recommendations.length})</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {recommendations.map(c => (
                  <div key={c.offering_id} className="rec-card">
                    <div className="rec-top">
                      <span className="subject-badge">{c.subject}</span>
                      <span style={{ fontSize: 12, color: '#bbb' }}>{c.number}</span>
                    </div>
                    <div className="rec-name">{c.name}</div>
                    <div className="rec-meta">
                      <span>🕐 {formatTime(c.start_time)} – {formatTime(c.end_time)}</span>
                      <span>📅 {formatDays(c.days)}</span>
                      {c.location && <span>📍 {c.location}</span>}
                      {c.instructor && c.instructor !== 'TBA' && <span>👤 {c.instructor}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <div className="card full-width">
              <div className="empty">Set your preferences and click "Find Courses For Me" to get recommendations.</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}