import { useNavigate } from 'react-router-dom'

export default function HomeScreen() {
  const navigate = useNavigate()
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ee; font-family: 'DM Sans', sans-serif; color: #1a1a2e; min-height: 100vh; }
        .home-hero {
          background: #00247d;
          padding: 72px 40px 64px;
          position: relative;
          overflow: hidden;
          min-height: 340px;
          display: flex;
          align-items: center;
        }
        .home-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          background: rgba(196,160,0,0.12);
          border-radius: 50%;
        }
        .home-hero::after {
          content: '';
          position: absolute;
          bottom: -80px; left: 30%;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .home-hero-inner { max-width: 1100px; margin: 0 auto; width: 100%; position: relative; z-index: 1; }
        .home-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 3px;
          text-transform: uppercase; color: #c4a000; margin-bottom: 14px;
        }
        .home-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 52px; font-weight: 700; color: #fff;
          line-height: 1.1; margin-bottom: 14px;
        }
        .home-hero p {
          color: rgba(255,255,255,0.65);
          font-size: 17px; font-weight: 300; max-width: 480px;
        }
        .cards-area {
          max-width: 1100px; margin: 0 auto;
          padding: 48px 40px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }
        .nav-card {
          background: #fff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          padding: 36px 32px;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .nav-card:hover {
          box-shadow: 0 8px 32px rgba(0,36,125,0.12);
          transform: translateY(-3px);
        }
        .card-icon {
          width: 44px; height: 44px;
          background: #eef1fa;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          font-size: 22px;
        }
        .nav-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1a1a2e; margin-bottom: 10px;
        }
        .nav-card p {
          font-size: 14px; color: #888;
          line-height: 1.6; font-weight: 300;
        }
        .card-arrow {
          margin-top: 24px;
          font-size: 13px; font-weight: 500;
          color: #00247d; letter-spacing: 0.5px;
        }
      `}</style>

      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="home-eyebrow">Duke University</div>
          <h1>BluePrint</h1>
          <p>Explore, filter, and compare Duke courses to plan your perfect semester.</p>
        </div>
      </div>

      <div className="cards-area">
        <div className="nav-card" onClick={() => navigate('/profile')}>
          <div className="card-icon">👤</div>
          <h2>My Profile</h2>
          <p>Track your completed courses, manage your major and minor, and personalize your BluePrint experience.</p>
          <div className="card-arrow">View profile →</div>
        </div>        
        <div className="nav-card" onClick={() => navigate('/search')}>
          <div className="card-icon">🔍</div>
          <h2>Course Search</h2>
          <p>Filter Duke's full course catalog by subject, level, area of knowledge, mode of inquiry, or keyword.</p>
          <div className="card-arrow">Browse courses →</div>
        </div>
        <div className="nav-card" onClick={() => navigate('/compare')}>
          <div className="card-icon">⚖️</div>
          <h2>Compare Courses</h2>
          <p>Select any two courses and get an AI-powered breakdown of similarities, differences, and career outcomes.</p>
          <div className="card-arrow">Start comparing →</div>
        </div>
        <div className="nav-card" onClick={() => navigate('/scheduler')}>
          <div className="card-icon">🗓️</div>
          <h2>Smart Scheduler</h2>
          <p>Add your registered courses and let BluePrint recommend what to take next based on your schedule and requirements.</p>
          <div className="card-arrow">Plan my schedule →</div>
        </div>
        <div className="nav-card" onClick={() => navigate('/optimizer')}>
          <div className="card-icon">🔀</div>
          <h2>Course Optimizer</h2>
          <p>Find courses that satisfy multiple degree requirements simultaneously — maximize every credit hour.</p>
          <div className="card-arrow">Optimize my schedule →</div>
        </div>
        <div className="nav-card" onClick={() => navigate('/bluebot')}>
          <div className="card-icon">🔵</div>
          <h2>Bluebot</h2>
          <p>Ask our AI academic advisor anything about Duke courses, requirements, and degree planning.</p>
          <div className="card-arrow">Chat now →</div>
        </div>
        <div className="nav-card" onClick={() => navigate('/programs')}>
          <div className="card-icon">🎓</div>
          <h2>Programs</h2>
          <p>Search Duke's majors, minors, and certificates and view their requirements.</p>
          <div className="card-arrow">Explore programs →</div>
        </div>
        <div className="nav-card" onClick={() => navigate('/professors')}>
          <div className="card-icon">⭐</div>
          <h2>Professor Ratings</h2>
          <p>Search Duke professors and view their RateMyProfessor ratings, difficulty scores, and student reviews.</p>
          <div className="card-arrow">Find professors →</div>
        </div>
      </div>
    </>
  )
}