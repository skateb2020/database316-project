import { useState, useEffect } from 'react'

const API = 'http://127.0.0.1:5001'

export default function Compare() {
  const [subjects, setSubjects] = useState([])

  const [search1, setSearch1] = useState('')
  const [search2, setSearch2] = useState('')
  const [results1, setResults1] = useState([])
  const [results2, setResults2] = useState([])
  const [selected1, setSelected1] = useState(null)
  const [selected2, setSelected2] = useState(null)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [comparison, setComparison] = useState('')
  const [comparing, setComparing] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/subjects`).then(r => r.json()).then(setSubjects)
  }, [])

  const searchCourses = (searchTerm, setResults, setLoading) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    fetch(`${API}/api/courses?${params}`)
      .then(r => r.json())
      .then(data => { setResults(data); setLoading(false) })
  }

  const selectCourse1 = (c) => {
    fetch(`${API}/api/courses/${c.course_id}`)
      .then(r => r.json())
      .then(data => setSelected1(data))
  }

  const selectCourse2 = (c) => {
    fetch(`${API}/api/courses/${c.course_id}`)
      .then(r => r.json())
      .then(data => setSelected2(data))
  }

  const compareCourses = async (course1, course2) => {
    const systemPrompt = `Based on the names and descriptions of these 2 courses at Duke University, clearly explain the similarities and differences in individual bulleted lists. Make sure to return a comparison of the AOKs (Areas of Knowledge) and MODs (Modes of Inquiry). Also, include which careers/jobs both classes would prepare an undergraduate student for best. Return the response as a JSON object with no additional text or explanation. The key should be called "comparison" and the value should be the comparison between the 2 courses. Call the separate keys within comparision the following: "Similarities," "Differences," "Areas of Knowledge," "Modes of Inquiry," and "Career Preparations."`;

    try {
      const result = await fetch('http://localhost:3001/api/openai', {
        method: 'POST',
        body: JSON.stringify({
          systemPrompt,
          prompt: `Compare these two courses: ${JSON.stringify(course1)} and ${JSON.stringify(course2)}`
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await result.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.error("Error comparing courses:", e);
      return '';
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ee; font-family: 'DM Sans', sans-serif; color: #1a1a2e; min-height: 100vh; }

        .hero { background: #00247d; padding: 48px 40px 40px; }
        .hero-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #c4a000; margin-bottom: 10px; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .hero-sub { color: rgba(255,255,255,0.6); font-size: 15px; font-weight: 300; }

        .compare-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 32px 40px; max-width: 1100px; margin: 0 auto; }

        .search-panel { background: #fff; border: 1px solid #e8e4dc; border-radius: 10px; padding: 20px; }
        .panel-title { font-family: 'Playfair Display', serif; font-size: 18px; margin-bottom: 16px; color: #1a1a2e; }

        .filter-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
        .filter-label { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: #888; }
        input { border: 1.5px solid #e0dbd0; border-radius: 6px; padding: 9px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a2e; background: #fafaf8; outline: none; width: 100%; }
        input:focus { border-color: #00247d; background: #fff; }

        .btn-filter { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 10px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; width: 100%; }
        .btn-filter:hover { background: #001a5c; }
        .btn-filter:disabled { background: #aaa; cursor: not-allowed; }

        .btn-compare { background: #00247d; color: #fff; border: none; border-radius: 6px; padding: 12px 48px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; }
        .btn-compare:hover { background: #001a5c; }

        .compare-btn-row { display: flex; justify-content: center; padding: 0 40px 32px; }

        .results-list { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; }
        .course-card { background: #fafaf8; border: 1.5px solid #e8e4dc; border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: all 0.15s; }
        .course-card:hover { border-color: #00247d; background: #eef1fa; }
        .course-card.selected { border-color: #00247d; background: #eef1fa; }
        .course-card.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .subject-badge { background: #eef1fa; color: #00247d; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; margin-right: 8px; }
        .course-num { font-size: 12px; color: #bbb; }
        .course-name { font-size: 14px; font-weight: 500; margin-top: 6px; color: #1a1a2e; }
        .selected-banner { margin-top: 12px; padding: 10px; background: #eef1fa; border-radius: 6px; font-size: 13px; color: #00247d; font-weight: 500; }
        .loading { text-align: center; padding: 20px; color: #aaa; font-size: 14px; }

        .collapsed-summary { display: flex; justify-content: space-between; align-items: center; padding: 16px 40px; background: #fff; border-bottom: 1px solid #e8e4dc; }
        .collapsed-courses { font-size: 14px; color: #1a1a2e; font-weight: 500; }
        .btn-reset { background: none; border: 1.5px solid #00247d; color: #00247d; border-radius: 6px; padding: 6px 16px; font-size: 13px; cursor: pointer; }
        .btn-reset:hover { background: #eef1fa; }

        .comparing-state { text-align: center; padding: 60px; color: #00247d; font-size: 15px; letter-spacing: 1px; }
      `}</style>

      <div className="hero">
        <div className="hero-eyebrow">Duke University</div>
        <h1>Compare Courses</h1>
        <p className="hero-sub">Evaluate the pros and cons between two courses</p>
      </div>

      {/* Show collapsed summary or full search panels */}
      {collapsed ? (
        <div className="collapsed-summary">
          <div className="collapsed-courses">
             {selected1?.name} <span style={{ color: '#aaa', margin: '0 8px' }}>vs</span> {selected2?.name}
          </div>
          <button className="btn-reset" onClick={() => { setCollapsed(false); setComparison('') }}>New Comparison</button>
        </div>
      ) : (
        <>
          <div className="compare-container">
            {/* Panel 1 */}
            <div className="search-panel">
              <div className="panel-title">Course 1</div>
              <div className="filter-group">
                <span className="filter-label">Search Course Name</span>
                <input
                  placeholder="e.g. machine learning..."
                  value={search1}
                  onChange={e => setSearch1(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchCourses(search1, setResults1, setLoading1)}
                />
              </div>
              <button className="btn-filter" onClick={() => searchCourses(search1, setResults1, setLoading1)}>Search</button>

              {loading1 && <div className="loading">Searching...</div>}

              {!loading1 && results1.length > 0 && (
                <div className="results-list">
                  {results1.map(c => (
                    <div
                      key={c.course_id}
                      className={`course-card ${selected1?.course_id === c.course_id ? 'selected' : ''} ${selected2?.course_id === c.course_id ? 'disabled' : ''}`}
                      onClick={() => selected2?.course_id !== c.course_id && selectCourse1(c)}
                    >
                      <span className="subject-badge">{c.subject}</span>
                      <span className="course-num">{c.number}</span>
                      <div className="course-name">{c.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {selected1 && <div className="selected-banner">✓ Selected: {selected1.name}</div>}
            </div>

            {/* Panel 2 */}
            <div className="search-panel">
              <div className="panel-title">Course 2</div>
              <div className="filter-group">
                <span className="filter-label">Search Course Name</span>
                <input
                  placeholder="e.g. data structures..."
                  value={search2}
                  onChange={e => setSearch2(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchCourses(search2, setResults2, setLoading2)}
                />
              </div>
              <button className="btn-filter" onClick={() => searchCourses(search2, setResults2, setLoading2)}>Search</button>

              {loading2 && <div className="loading">Searching...</div>}

              {!loading2 && results2.length > 0 && (
                <div className="results-list">
                  {results2.map(c => (
                    <div
                      key={c.course_id}
                      className={`course-card ${selected2?.course_id === c.course_id ? 'selected' : ''} ${selected1?.course_id === c.course_id ? 'disabled' : ''}`}
                      onClick={() => selected1?.course_id !== c.course_id && selectCourse2(c)}
                    >
                      <span className="subject-badge">{c.subject}</span>
                      <span className="course-num">{c.number}</span>
                      <div className="course-name">{c.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {selected2 && <div className="selected-banner">✓ Selected: {selected2.name}</div>}
            </div>
          </div>

          {/* Centered compare button */}
          {selected1 && selected2 && (
            <div className="compare-btn-row">
              <button className="btn-compare" onClick={async () => {
                setComparing(true)
                setCollapsed(true)
                const result = await compareCourses(selected1, selected2)
                setComparison(result)
                setComparing(false)
              }}>
                Compare Courses
              </button>
            </div>
          )}
        </>
      )}

      {/* Loading state */}
      {comparing && <div className="comparing-state">Comparing...</div>}

      {/* Results */}
      {comparison && !comparing && (() => {
        try {
          const parsed = JSON.parse(comparison).comparison
          return (
            <div style={{ padding: '20px 40px', maxWidth: '1100px', margin: '0 auto' }}>
              {Object.entries(parsed).map(([section, items]) => (
                <div key={section} style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#00247d', fontSize: '20px', marginBottom: '12px' }}>{section}</h3>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((item, i) => (
                      <li key={i} style={{ fontSize: '14px', lineHeight: '1.6', color: '#1a1a2e' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        } catch {
          return <div style={{ padding: '20px 40px', whiteSpace: 'pre-wrap' }}>{comparison}</div>
        }
      })()}

    {!comparison && !comparing && (
    <div style={{ textAlign: 'center', padding: '60px 40px', color: '#bbb' }}>
      <p>Search and select two courses above and click <strong>Compare Courses</strong> to see the comparison.</p>
    </div>
    )}
    </>
  )
}