import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:5001'

export default function Programs() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [ptype, setPtype] = useState('')
  const [programs, setPrograms] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchPrograms = async () => {
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (ptype) params.append('ptype', ptype)
    const res = await fetch(`${API}/api/programs?${params}`)
    const data = await res.json()
    setPrograms(data)
    setLoading(false)
  }

  const typeColor = { Major: '#00247d', Minor: '#c4a000', Certificate: '#2e7d32' }
  const typeBg = { Major: '#eef1fa', Minor: '#fdf8e1', Certificate: '#e8f5e9' }

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
        .filter-bar { background: #fff; border-bottom: 1px solid #e8e4dc; padding: 20px 40px; position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .filter-bar-inner { max-width: 1100px; margin: 0 auto; display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
        .filter-group { display: flex; flex-direction: column; gap: 4px; }
        .filter-label { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: #888; }
        select, input { border: 1.5px solid #e0dbd0; border-radius: 6px; padding: 9px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a2e; background: #fafaf8; outline: none; }
        select:focus, input:focus { border-color: #00247d; }
        .btn-filter { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 10px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; }
        .btn-filter:hover { background: #001a5c; }
        .results-area { padding: 32px 40px; max-width: 1100px; margin: 0 auto; }
        .results-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
        .results-count { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #1a1a2e; }
        .program-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .program-card { background: #fff; border: 1px solid #e8e4dc; border-radius: 10px; padding: 18px 20px; transition: box-shadow 0.2s, transform 0.2s; text-decoration: none; display: block; }
        .program-card:hover { box-shadow: 0 6px 24px rgba(0,36,125,0.10); transform: translateY(-2px); }
        .card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .type-badge { font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; }
        .degree-badge { font-size: 11px; color: #bbb; }
        .program-name { font-size: 14px; font-weight: 500; line-height: 1.4; color: #1a1a2e; margin-bottom: 10px; }
        .view-link { font-size: 12px; color: #00247d; font-weight: 500; }
        .empty-state { text-align: center; padding: 80px 40px; color: #bbb; }
        .loading { text-align: center; padding: 60px; color: #aaa; font-size: 14px; }
      `}</style>

      <div className="hero">
        <div className="hero-inner">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[['/', '← Home'], ['/search', 'Course Search'], ['/compare', 'Compare Courses'],
              ['/scheduler', 'Smart Scheduler'], ['/profile', 'My Profile'], ['/bluebot', 'Bluebot 🔵']].map(([path, label]) => (
              <button key={path} onClick={() => navigate(path)} style={{
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
                padding: '6px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>
          <div className="hero-eyebrow">Duke University</div>
          <h1>Programs</h1>
          <p className="hero-sub">Search majors, minors, and certificates offered at Duke</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-group">
            <span className="filter-label">Type</span>
            <select value={ptype} onChange={e => setPtype(e.target.value)}>
              <option value="">All Types</option>
              <option value="Major">Majors</option>
              <option value="Minor">Minors</option>
              <option value="Certificate">Certificates</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Search</span>
            <input
              placeholder="e.g. computer science, economics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchPrograms()}
              style={{ width: 280 }}
            />
          </div>
          <button className="btn-filter" onClick={fetchPrograms}>Search Programs</button>
        </div>
      </div>

      <div className="results-area">
        {loading && <div className="loading">Searching programs...</div>}

        {!loading && programs.length > 0 && (
          <>
            <div className="results-header">
              <span className="results-count">{programs.length} programs found</span>
            </div>
            <div className="program-grid">
              {programs.map(p => (
                <a key={p.program_id} className="program-card" href={p.url} target="_blank" rel="noopener noreferrer">
                  <div className="card-top">
                    <span className="type-badge" style={{
                      background: typeBg[p.type] || '#eef1fa',
                      color: typeColor[p.type] || '#00247d'
                    }}>{p.type}</span>
                    {p.degree && <span className="degree-badge">{p.degree}</span>}
                  </div>
                  <div className="program-name">{p.name}</div>
                  <div className="view-link">View requirements →</div>
                </a>
              ))}
            </div>
          </>
        )}

        {!loading && searched && programs.length === 0 && (
          <div className="empty-state"><p>No programs found. Try a different search.</p></div>
        )}

        {!searched && (
          <div className="empty-state"><p>Search for a program above to view requirements.</p></div>
        )}
      </div>
    </>
  )
}