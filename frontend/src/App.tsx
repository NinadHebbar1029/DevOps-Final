import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import BillPage from './pages/BillPage';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bill" element={<BillPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

export default App;