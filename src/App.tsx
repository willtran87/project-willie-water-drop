import { BrowserRouter, Routes, Route } from 'react-router'
import { HomePage } from './pages/HomePage'
import { LevelSelectPage } from './pages/LevelSelectPage'
import { GamePage } from './pages/GamePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/levels" element={<LevelSelectPage />} />
        <Route path="/game/:levelId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
