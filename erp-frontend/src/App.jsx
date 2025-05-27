import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Vertrieb from './pages/Vertrieb';
import CRM from './pages/CRM';
import Auftragsmanagement from './pages/Auftragsmanagement';
import Lager from './pages/Lager'; // Import hinzufügen
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vertrieb" element={<Vertrieb />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/auftragsmanagement" element={<Auftragsmanagement />} />
        <Route path="/lager" element={<Lager />} /> {/* Neue Route */}
      </Routes>

      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
