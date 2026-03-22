import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import RoboticsLandingPage from './pages/RoboticsLandingPage.jsx'

function App() {
  return (
    <HelmetProvider>
      <RoboticsLandingPage />
    </HelmetProvider>
  )
}

export default App
