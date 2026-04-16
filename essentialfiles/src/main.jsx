import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './HomeScreen.jsx'
import SearchScreen from './App.jsx'
import CompareScreen from './Compare.jsx'
import ChatbotScreen from './Chatbot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/compare" element={<CompareScreen />} />
        <Route path="/chat" element={<ChatbotScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
