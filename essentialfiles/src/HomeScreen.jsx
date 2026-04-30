import { useNavigate } from 'react-router-dom'

export default function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '40px' }}>
      <h1>Course Explorer</h1>
      <ul>
        <li><a onClick={() => navigate('/search')} style={{ cursor: 'pointer', color: 'blue' }}>Search Courses</a></li>
        <li><a onClick={() => navigate('/compare')} style={{ cursor: 'pointer', color: 'blue' }}>Compare Courses</a></li>
      </ul>
    </div>
  )
}