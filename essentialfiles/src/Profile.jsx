import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:5001'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('blueprint_user')
    return saved ? JSON.parse(saved) : null
  })
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState({ net_id: '', password: '', name: '', year: '', major: '', minor: '' })
  const [error, setError] = useState('')
  const [completedCourses, setCompletedCourses] = useState([])
  const [courseSearch, setCourseSearch] = useState('')
  const [courseResults, setCourseResults] = useState([])
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    if (user) fetchCompleted()
  }, [user])

  const fetchCompleted = async () => {
    const res = await fetch(`${API}/api/student/${user.student_id}/completed`)
    const data = await res.json()
    setCompletedCourses(data)
  }

  const handleAuth = async () => {
    setError('')
    const endpoint = mode === 'login' ? '/api/login' : '/api/register'
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    localStorage.setItem('blueprint_user', JSON.stringify(data))
    setUser(data)
  }

  const handleLogout = () => {
    localStorage.removeItem('blueprint_user')
    setUser(null)
    setCompletedCourses([])
  }

  const searchCourses = async () => {
    if (!courseSearch) return
    const res = await fetch(`${API}/api/courses?search=${courseSearch}`)
    const data = await res.json()
    setCourseResults(data)
  }

  const addCompleted = async (course_id) => {
    await fetch(`${API}/api/student/${user.student_id}/completed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id })
    })
    fetchCompleted()
    setCourseResults([])
    setCourseSearch('')
  }

  const removeCompleted = async (course_id) => {
    await fetch(`${API}/api/student/${user.student_id}/completed`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id })
    })
    fetchCompleted()
  }

  const saveProfile = async () => {
    await fetch(`${API}/api/student/${user.student_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
    const updated = { ...user, ...editForm }
    localStorage.setItem('blueprint_user', JSON.stringify(updated))
    setUser(updated)
    setEditing(false)
  }

  const yearLabel = { 1: 'First Year', 2: 'Sophomore', 3: 'Junior', 4: 'Senior' }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ee; font-family: 'DM Sans', sans-serif; color: #1a1a2e; min-height: 100vh; }
        .hero { background: #00247d; padding: 48px 40px 40px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 300px; height: 300px; background: rgba(196,160,0,0.12); border-radius: 50%; }
        .hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .hero-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #c4a000; margin-bottom: 10px; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .hero-sub { color: rgba(255,255,255,0.6); font-size: 15px; font-weight: 300; }
        .nav-btns { display: flex; gap: 8px; margin-bottom: 24px; }
        .nav-btn { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; padding: 6px 16px; font-family: 'DM Sans, sans-serif'; font-size: 13px; cursor: pointer; }
        .nav-btn:hover { background: rgba(255,255,255,0.1); }
        .content { max-width: 1100px; margin: 0 auto; padding: 40px; }
        .auth-card { background: #fff; border: 1px solid #e8e4dc; border-radius: 12px; padding: 40px; max-width: 480px; margin: 0 auto; }
        .auth-title { font-family: 'Playfair Display', serif; font-size: 26px; margin-bottom: 8px; color: #1a1a2e; }
        .auth-sub { font-size: 14px; color: #888; margin-bottom: 28px; }
        .field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
        .field label { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: #888; }
        .field input, .field select { border: 1.5px solid #e0dbd0; border-radius: 6px; padding: 9px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a2e; background: #fafaf8; outline: none; }
        .field input:focus, .field select:focus { border-color: #00247d; }
        .btn-primary { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 11px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; width: 100%; margin-top: 8px; }
        .btn-primary:hover { background: #001a5c; }
        .btn-secondary { background: transparent; color: #00247d; border: 1.5px solid #00247d; border-radius: 6px; padding: 9px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; }
        .btn-secondary:hover { background: #eef1fa; }
        .btn-danger { background: transparent; color: #c0392b; border: 1.5px solid #c0392b; border-radius: 6px; padding: 9px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; }
        .toggle { text-align: center; margin-top: 20px; font-size: 13px; color: #888; }
        .toggle span { color: #00247d; cursor: pointer; font-weight: 500; }
        .error { background: #fef0f0; border: 1px solid #f5c6cb; color: #c0392b; padding: 10px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; }
        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .card { background: #fff; border: 1px solid #e8e4dc; border-radius: 12px; padding: 28px; }
        .card-title { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 20px; color: #1a1a2e; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0ece4; font-size: 14px; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-weight: 500; color: #1a1a2e; }
        .course-tag { display: inline-flex; align-items: center; gap: 6px; background: #eef1fa; color: #00247d; border-radius: 6px; padding: 5px 10px; font-size: 12px; font-weight: 500; margin: 4px; }
        .course-tag button { background: none; border: none; color: #00247d; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; }
        .search-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .search-row input { flex: 1; border: 1.5px solid #e0dbd0; border-radius: 6px; padding: 9px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; }
        .search-row input:focus { border-color: #00247d; }
        .search-row button { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 9px 18px; font-size: 13px; cursor: pointer; white-space: nowrap; }
        .result-item { padding: 10px 12px; border: 1px solid #e8e4dc; border-radius: 6px; cursor: pointer; font-size: 13px; margin-bottom: 6px; transition: all 0.15s; }
        .result-item:hover { border-color: #00247d; background: #eef1fa; color: #00247d; }
        .profile-actions { display: flex; gap: 10px; margin-bottom: 20px; }
      `}</style>

      <div className="hero">
        <div className="hero-inner">
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[['/', '← Home'], ['/search', 'Course Search'], ['/compare', 'Compare Courses'], ['/scheduler', 'Smart Scheduler'], ['/programs', 'Programs 🎓'], ['/bluebot', 'Bluebot 🔵']].map(([path, label]) => (
                <button key={path} onClick={() => navigate(path)} style={{
                  background: 'transparent', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
                  padding: '6px 16px', fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13, cursor: 'pointer'
                }}>{label}</button>
              ))}
            </div>
          <div className="hero-eyebrow">Duke University</div>
          <h1>{user ? `Welcome, ${user.name?.split(' ')[0]}` : 'My Profile'}</h1>
          <p className="hero-sub">{user ? `${yearLabel[user.year] || ''} · ${user.major || ''}` : 'Sign in to track your academic journey'}</p>
        </div>
      </div>

      <div className="content">
        {!user ? (
          <div className="auth-card">
            <div className="auth-title">{mode === 'login' ? 'Sign In' : 'Create Account'}</div>
            <div className="auth-sub">{mode === 'login' ? 'Welcome back to BluePrint' : 'Start planning your Duke journey'}</div>
            {error && <div className="error">{error}</div>}
            {mode === 'register' && (
              <div className="field">
                <label>Full Name</label>
                <input placeholder="e.g. Uzair Chaudhry" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
            )}
            <div className="field">
              <label>NetID</label>
              <input placeholder="e.g. uc123" value={form.net_id} onChange={e => setForm({...form, net_id: e.target.value})} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && handleAuth()} />
            </div>
            {mode === 'register' && (
              <>
                <div className="field">
                  <label>Year</label>
                  <select value={form.year} onChange={e => setForm({...form, year: e.target.value})}>
                    <option value="">Select year</option>
                    <option value="1">First Year</option>
                    <option value="2">Sophomore</option>
                    <option value="3">Junior</option>
                    <option value="4">Senior</option>
                  </select>
                </div>
                <div className="field">
                  <label>Major</label>
                  <input placeholder="e.g. Computer Science" value={form.major} onChange={e => setForm({...form, major: e.target.value})} />
                </div>
                <div className="field">
                  <label>Minor (optional)</label>
                  <input placeholder="e.g. Mathematics" value={form.minor} onChange={e => setForm({...form, minor: e.target.value})} />
                </div>
              </>
            )}
            <button className="btn-primary" onClick={handleAuth}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            <div className="toggle">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
                {mode === 'login' ? 'Register' : 'Sign In'}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="profile-actions">
              <button className="btn-secondary" onClick={() => { setEditing(!editing); setEditForm({ name: user.name, year: user.year, major: user.major, minor: user.minor }) }}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className="btn-danger" onClick={handleLogout}>Sign Out</button>
            </div>

            {editing ? (
              <div className="auth-card" style={{ maxWidth: '100%', marginBottom: 24 }}>
                <div className="card-title">Edit Profile</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="field"><label>Full Name</label><input value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                  <div className="field">
                    <label>Year</label>
                    <select value={editForm.year || ''} onChange={e => setEditForm({...editForm, year: e.target.value})}>
                      <option value="1">First Year</option>
                      <option value="2">Sophomore</option>
                      <option value="3">Junior</option>
                      <option value="4">Senior</option>
                    </select>
                  </div>
                  <div className="field"><label>Major</label><input value={editForm.major || ''} onChange={e => setEditForm({...editForm, major: e.target.value})} /></div>
                  <div className="field"><label>Minor</label><input value={editForm.minor || ''} onChange={e => setEditForm({...editForm, minor: e.target.value})} /></div>
                </div>
                <button className="btn-primary" style={{ marginTop: 8 }} onClick={saveProfile}>Save Changes</button>
              </div>
            ) : (
              <div className="profile-grid">
                <div className="card">
                  <div className="card-title">Profile</div>
                  <div className="info-row"><span className="info-label">Name</span><span className="info-value">{user.name}</span></div>
                  <div className="info-row"><span className="info-label">NetID</span><span className="info-value">{user.net_id}</span></div>
                  <div className="info-row"><span className="info-label">Year</span><span className="info-value">{yearLabel[user.year] || user.year}</span></div>
                  <div className="info-row"><span className="info-label">Major</span><span className="info-value">{user.major || '—'}</span></div>
                  <div className="info-row"><span className="info-label">Minor</span><span className="info-value">{user.minor || '—'}</span></div>
                </div>

                <div className="card">
                  <div className="card-title">Completed Courses</div>
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
                        <div key={c.course_id} className="result-item" onClick={() => addCompleted(c.course_id)}>
                          <strong>{c.subject} {c.number}</strong> — {c.name}
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    {completedCourses.length === 0 && <p style={{ fontSize: 13, color: '#bbb' }}>No courses added yet.</p>}
                    {completedCourses.map(c => (
                      <span key={c.course_id} className="course-tag">
                        {c.subject} {c.number}
                        <button onClick={() => removeCompleted(c.course_id)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}