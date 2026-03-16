import React, { Suspense, lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import LoadingBar from './components/LoadingBar'

const RoboticsLandingPage = lazy(() => import('./pages/RoboticsLandingPage.jsx'))

function App() {
  return (
    <HelmetProvider>
      <Suspense fallback={<LoadingBar />}>
        <RoboticsLandingPage />
      </Suspense>
    </HelmetProvider>
  )
}

export default App
