import { useState, useEffect } from 'react'

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
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [search, setSearch] = useState('')
  const [aok, setAok] = useState('')
  const [moi, setMoi] = useState([])
  const [aokOptions, setAokOptions] = useState([])
  const [moiOptions, setMoiOptions] = useState([])

  useEffect(() => {
    fetch(`${API}/api/subjects`).then(r => r.json()).then(setSubjects)
    fetch(`${API}/api/aok`).then(r => r.json()).then(setAokOptions)
    fetch(`${API}/api/moi`).then(r => r.json()).then(setMoiOptions)
  }, [])

  const handleKey = e => { 
    if (e.key === 'Enter') {
      console.log({subject, level, aok, moi, search}) // placeholder action
    }
  }

  return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'DM Sans', sans-serif; color: #1a1a2e; }

      .filter-bar { background: #fff; border-bottom: 1px solid #e8e4dc; padding: 20px 40px; }
      .filter-bar-inner { display: flex; gap: 12px; flex-wrap: wrap; }
      .filter-group { display: flex; flex-direction: column; gap: 4px; }
      .filter-label { font-size: 10px; font-weight: 500; color: #888; }
      select, input { border: 1.5px solid #e0dbd0; border-radius: 6px; padding: 9px 14px; font-size: 14px; }
      select:focus, input:focus { border-color: #00247d; background: #fff; }
      input.search { width: 260px; }
      .btn-filter { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 10px 28px; cursor: pointer; }
      .btn-filter:hover { background: #001a5c; }

      /* New: container for both filter bars side by side */
      .filter-bars-container { display: flex; gap: 20px; }
    `}</style>

    <div className="filter-bars-container">
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-group">
            <span className="filter-label">Search Course Name</span>
            <input
              className="search"
              placeholder="First course to compare."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button
            className="btn-filter"
            onClick={() => console.log({ search })}
          >
            Search
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-group">
            <span className="filter-label">Search Course Name</span>
            <input
              className="search"
              placeholder="Second course to compare."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button
            className="btn-filter"
            onClick={() => console.log({ search })}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </>
)
}