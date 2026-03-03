import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import Impressum from './pages/Impressum'
import AGB from './pages/AGB'
import Datenschutz from './pages/Datenschutz'
import Disclaimer from './pages/Disclaimer'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompanySetup from './pages/CompanySetup'
import QuoteEditor from './pages/QuoteEditor'

export default function App() {
    const location = useLocation()
    const isAppRoute = location.pathname.startsWith('/app')

    return (
        <>
            <Header />
            <main>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/impressum" element={<Impressum />} />
                    <Route path="/agb" element={<AGB />} />
                    <Route path="/datenschutz" element={<Datenschutz />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/login" element={<Login />} />

                    {/* App (protected) */}
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/app/company" element={<CompanySetup />} />
                    <Route path="/app/editor/:id" element={<QuoteEditor />} />
                </Routes>
            </main>
            {!isAppRoute && <Footer />}
        </>
    )
}
