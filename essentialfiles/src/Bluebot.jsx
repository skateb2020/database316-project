import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:5001'
const NODE_API = 'http://localhost:3001'

const SYSTEM_PROMPT = `You are Bluebot, an AI academic advisor for Duke University. You help students with course selection, degree planning, and academic questions.

Duke has two schools for undergraduates: Trinity College of Arts & Sciences and Pratt School of Engineering. Always ask which school a student is in if unclear.

=== TRINITY COLLEGE - OLD CURRICULUM (entering BEFORE Fall 2025) ===
34 credits total. Four requirements:
1. Areas of Knowledge (AOK) - 2 courses in each of 5 areas:
   - ALP: Arts, Literature & Performance
   - CZ: Civilizations
   - NS: Natural Sciences
   - QS: Quantitative Studies
   - SS: Social Sciences
2. Modes of Inquiry (MOI) - 1-3 courses in each of 6 modes:
   - CCI: Cross-Cultural Inquiry
   - EI: Ethical Inquiry
   - FL: Foreign Language
   - R: Research
   - STS: Science, Technology & Society
   - W: Writing
3. Small Group Learning Experiences (SGLE) - 3 experiences in seminar, tutorial, or independent study format
4. The Major - depth within a single discipline
Required first-year courses: First Year Seminar + Writing 101 (within first two semesters)

=== TRINITY COLLEGE - NEW CURRICULUM (entering Fall 2025 or later) ===
34 credits total:
1. First-Year Experience - choose one of:
   - Constellations program: 3 related courses (one must be W120) + 2 experiential activities over first year
   - FOCUS program: 2 cluster courses in fall + W120 in spring + 0.5 credit IDC
2. Writing - 3 writing courses including W120 + at least one after first year
3. Languages - one of:
   - Three sequential courses in same language (e.g. 101, 102, 203)
   - Two 300-level courses in same or different languages
   - One 300-level + two sequential courses in another language
4. Liberal Arts Requirements - 2 codes in each of 6 distribution categories (12 total):
   - CE: Creating and Engaging with Art
   - HI: Humanistic Inquiry
   - IJ: Interpreting Institutions, Justice, and Power
   - NW: Investigating the Natural World
   - QC: Quantitative and Computational Reasoning
   - SB: Social and Behavioral Analysis
   Century Courses (launching Fall 2026) count for 2 codes each, up to 2 Century Courses can be used this way

=== PRATT SCHOOL OF ENGINEERING - OLD CURRICULUM (entering BEFORE Fall 2025) ===
34 credits total:
- Writing: 1 course
- Mathematics: 5 courses
- Natural Science: 3 courses
- Mathematics or Natural Science Elective: 1 course
- Social Science & Humanities: 5 courses
- Digital Computation: 1 course
- Engineering Design & Communication: 1 course
- Departmental Requirements: 17 courses (varies by major)

=== PRATT SCHOOL OF ENGINEERING - NEW CURRICULUM (entering Fall 2025 or later) ===
34 credits total:
- Writing: 1 course
- Mathematics: 5 courses
- Natural Science: 3 courses
- Mathematics or Natural Science Elective: 1 course
- Liberal Arts: 5 courses (replaces Social Science & Humanities from old curriculum)
- Digital Computation: 1 course
- Engineering Design & Communication: 1 course
- Departmental Requirements: 17 courses (varies by major)

Pratt engineering majors include: Biomedical Engineering (BME), Civil & Environmental Engineering (CEE), Electrical & Computer Engineering (ECE), Mechanical Engineering & Materials Science (ME/MS), and Institute for Enterprise Engineering.

Always ask which school (Trinity or Pratt) and which curriculum year (before or after Fall 2025) applies if unclear. Be helpful, concise, and specific to Duke.`

export default function Bluebot() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('blueprint_user') || 'null')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hey${user ? ` ${user.name?.split(' ')[0]}` : ''}! I'm Bluebot 🔵 your Duke academic advisor. Ask me anything about courses, requirements, or degree planning!` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${NODE_API}/api/openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          prompt: input
        })
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

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
        .chat-container { max-width: 800px; margin: 0 auto; padding: 32px 40px; display: flex; flex-direction: column; height: calc(100vh - 220px); }
        .messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 16px; }
        .message { display: flex; gap: 12px; align-items: flex-start; }
        .message.user { flex-direction: row-reverse; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .avatar.bot { background: #00247d; }
        .avatar.user { background: #c4a000; }
        .bubble { max-width: 70%; padding: 12px 16px; border-radius: 12px; font-size: 14px; line-height: 1.6; }
        .bubble.bot { background: #fff; border: 1px solid #e8e4dc; color: #1a1a2e; border-radius: 2px 12px 12px 12px; }
        .bubble.user { background: #00247d; color: #fff; border-radius: 12px 2px 12px 12px; }
        .typing { display: flex; gap: 4px; align-items: center; padding: 12px 16px; }
        .dot { width: 6px; height: 6px; background: #bbb; border-radius: 50%; animation: bounce 1.2s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        .input-row { display: flex; gap: 10px; padding-top: 16px; border-top: 1px solid #e8e4dc; }
        .input-row input { flex: 1; border: 1.5px solid #e0dbd0; border-radius: 8px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; background: #fff; }
        .input-row input:focus { border-color: #00247d; }
        .send-btn { background: #00247d; color: #fff; border: none; border-radius: 8px; padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; }
        .send-btn:hover { background: #001a5c; }
        .send-btn:disabled { background: #aaa; cursor: not-allowed; }
        .suggested { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .suggestion { background: #fff; border: 1px solid #e8e4dc; border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #00247d; cursor: pointer; transition: all 0.15s; }
        .suggestion:hover { border-color: #00247d; background: #eef1fa; }
      `}</style>

      <div className="hero">
        <div className="hero-inner">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[['/', '← Home'], ['/search', 'Course Search'], ['/compare', 'Compare Courses'], ['/scheduler', 'Smart Scheduler'], ['/profile', 'My Profile']].map(([path, label]) => (
              <button key={path} onClick={() => navigate(path)} style={{
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
                padding: '6px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>
          <div className="hero-eyebrow">Duke University</div>
          <h1>Bluebot 🔵</h1>
          <p className="hero-sub">Your AI-powered Duke academic advisor</p>
        </div>
      </div>

      <div className="chat-container">
        {messages.length === 1 && (
          <div className="suggested">
            {[
              "What AoK should I take for NS?",
              "What's the difference between CS 216 and CS 316?",
              "I'm a CS major, what electives do you recommend?",
              "What courses satisfy the Writing requirement?",
              "How do I plan for a CS + Math double major?"
            ].map(s => (
              <div key={s} className="suggestion" onClick={() => { setInput(s) }}>{s}</div>
            ))}
          </div>
        )}

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role === 'user' ? 'user' : ''}`}>
              <div className={`avatar ${m.role === 'user' ? 'user' : 'bot'}`}>
                {m.role === 'user' ? '👤' : '🔵'}
              </div>
              <div className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`}
                dangerouslySetInnerHTML={{ __html: m.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\n/g, '<br/>')
                }}
              />
            </div>
          ))}
          {loading && (
            <div className="message">
              <div className="avatar bot">🔵</div>
              <div className="bubble bot">
                <div className="typing">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-row">
          <input
            placeholder="Ask Bluebot anything about Duke courses..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="send-btn" onClick={sendMessage} disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </>
  )
}