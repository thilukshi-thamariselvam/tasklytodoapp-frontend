import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TodayPage from './pages/TodayPage';
import InboxPage from './pages/InboxPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route index element={<TodayPage />} /> 
        <Route path="inbox" element={<InboxPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;