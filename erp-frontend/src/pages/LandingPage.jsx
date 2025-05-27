import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LandingPage() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Dashboard', path: '/dashboard', color: 'bg-green-600' },
    { name: 'Vertrieb', path: '/vertrieb', color: 'bg-blue-600' },
    { name: 'CRM', path: '/crm', color: 'bg-purple-600' },
    { name: 'Aufträge', path: '/auftragsmanagement', color: 'bg-yellow-600' },
    { name: 'Lager', path: '/lager', color: 'bg-red-600' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <img src={logo} alt="Logo" className="w-96 h-auto mb-8" />
      <h1 className="text-3xl font-bold mb-8">Willkommen bei deinem ERP-System 🚀</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-6xl">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`${cat.color} text-white text-xl font-semibold p-6 rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition text-center`}
            onClick={() => navigate(cat.path)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}
