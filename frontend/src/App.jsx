import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RoboticsLandingPage from './pages/RoboticsLandingPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import ContactInvitationPage from './pages/ContactInvitationPage.jsx'
import TermsOfServicePage from './pages/TermsOfServicePage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<RoboticsLandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/contact/invite" element={<ContactInvitationPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
