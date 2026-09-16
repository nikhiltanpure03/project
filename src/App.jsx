import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import DiscoverPage from './pages/DiscoverPage'
import ExperiencesPage from './pages/ExperiencesPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import UserPage from './pages/UserPage'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
