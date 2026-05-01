import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:5001'

export default function Professors() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const searchProfessors = async () => {
    if (!search.trim()) return
    setLoading(true)
    setSearched(true)
    const res = await fetch(`${API}/api/rmp/search?name=${encodeURIComponent(search)}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  const ratingColor = (r) => r >= 4 ? '#2e7d32' : r >= 3 ? '#c4a000' : '#c0392b'
  const ratingBg = (r) => r >= 4 ? '#e8f5e9' : r >= 3 ? '#fdf8e1' : '#fef0f0'

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
        .search-area { max-width: 600px; margin: 0 auto; padding: 40px 40px 0; }
        .search-row { display: flex; gap: 10px; }
        .search-row input { flex: 1; border: 1.5px solid #e0dbd0; border-radius: 8px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; background: #fff; }
        .search-row input:focus { border-color: #00247d; }
        .search-row button { background: #00247d; color: #fff; border: none; border-radius: 8px; padding: 12px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; }
        .search-row button:hover { background: #001a5c; }
        .results-area { max-width: 1100px; margin: 0 auto; padding: 32px 40px; display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
        .prof-card { background: #fff; border: 1px solid #e8e4dc; border-radius: 12px; padding: 24px; width: 380px; }
        .prof-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
        .prof-dept { font-size: 13px; color: #888; margin-bottom: 20px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .stat-box { border-radius: 8px; padding: 14px; text-align: center; }
        .stat-value { font-size: 28px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
        .num-ratings { text-align: center; margin-top: 14px; font-size: 12px; color: #aaa; }
        .empty-state { text-align: center; padding: 80px 40px; color: #bbb; grid-column: 1/-1; }
        .loading { text-align: center; padding: 60px; color: #aaa; grid-column: 1/-1; }
      `}</style>

      <div className="hero">
        <div className="hero-inner">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[['/', '← Home'], ['/search', 'Course Search'], ['/compare', 'Compare Courses'],
              ['/scheduler', 'Smart Scheduler'], ['/programs', 'Programs 🎓'], ['/bluebot', 'Bluebot 🔵']].map(([path, label]) => (
              <button key={path} onClick={() => navigate(path)} style={{
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
                padding: '6px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>
          <div className="hero-eyebrow">Duke University</div>
          <h1>Professor Ratings</h1>
          <p className="hero-sub">Search Duke professors and view their RateMyProfessor ratings</p>
        </div>
      </div>

      <div className="search-area">
        <div className="search-row">
          <input
            placeholder="Search by professor name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchProfessors()}
          />
          <button onClick={searchProfessors}>Search</button>
        </div>
      </div>



      <div className="results-area">
        {loading && <div className="loading">Searching RateMyProfessor...</div>}
        {!loading && results.length > 0 && results.map((p, i) => (
          <div key={i} className="prof-card">
            <div className="prof-name">{p.name}</div>
            <div className="prof-dept">{p.department}</div>
            <div className="stats-grid">
              <div className="stat-box" style={{ background: ratingBg(p.rating), color: ratingColor(p.rating) }}>
                <div className="stat-value">{p.rating}</div>
                <div className="stat-label">Overall</div>
              </div>
              <div className="stat-box" style={{ background: p.difficulty <= 2.5 ? '#e8f5e9' : p.difficulty <= 3.5 ? '#fdf8e1' : '#fef0f0', color: p.difficulty <= 2.5 ? '#2e7d32' : p.difficulty <= 3.5 ? '#c4a000' : '#c0392b' }}>
                <div className="stat-value">{p.difficulty}</div>
                <div className="stat-label">Difficulty</div>
              </div>
              <div className="stat-box" style={{ background: '#eef1fa', color: '#00247d', gridColumn: '1/-1' }}>
                <div className="stat-value">{p.wouldTakeAgain}%</div>
                <div className="stat-label">Would Take Again</div>
              </div>
            </div>
            <div className="num-ratings">Based on {p.numRatings} ratings</div>
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <a href={`https://www.ratemyprofessors.com/search/professors/1350?q=${encodeURIComponent(p.name)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: '#00247d', fontWeight: 500 }}>
                View full profile on RMP →
              </a>
            </div>
          </div>
        ))}

        {!loading && searched && results.length === 0 && (
          <div className="empty-state">No professors found. Try a different name.</div>
        )}

        {!searched && (
          <div className="empty-state">Search for a Duke professor above to see their ratings.</div>
        )}
      </div>
    </>
  )
}