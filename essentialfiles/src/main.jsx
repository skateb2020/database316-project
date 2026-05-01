import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './HomeScreen.jsx'
import SearchScreen from './App.jsx'
import CompareScreen from './Compare.jsx'
import ProfileScreen from './Profile.jsx'
import SchedulerScreen from './Scheduler.jsx'
import BluebotScreen from './Bluebot.jsx'
import ProgramsScreen from './Programs.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/compare" element={<CompareScreen />} />
        <Route path="/scheduler" element={<SchedulerScreen />} />
        <Route path="/bluebot" element={<BluebotScreen />} />
        <Route path="/programs" element={<ProgramsScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)