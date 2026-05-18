import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Intake from './pages/Intake'
import Dashboard from './pages/Dashboard'
import Discovery from './pages/Discovery'
import Probate from './pages/Probate'
import EstateAccount from './pages/EstateAccount'
import Closures from './pages/Closures'
import Transfers from './pages/Transfers'
import Distribution from './pages/Distribution'
import HowItWorks from './pages/HowItWorks'
import { useStore } from './store'

function RequireAuth({ children }: { children: JSX.Element }) {
  const signedIn = useStore((s) => s.signedIn)
  return signedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/begin" element={<RequireAuth><Intake /></RequireAuth>} />
      <Route path="/app" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/app/discovery" element={<RequireAuth><Discovery /></RequireAuth>} />
      <Route path="/app/probate" element={<RequireAuth><Probate /></RequireAuth>} />
      <Route path="/app/estate-account" element={<RequireAuth><EstateAccount /></RequireAuth>} />
      <Route path="/app/closures" element={<RequireAuth><Closures /></RequireAuth>} />
      <Route path="/app/transfers" element={<RequireAuth><Transfers /></RequireAuth>} />
      <Route path="/app/distribution" element={<RequireAuth><Distribution /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
