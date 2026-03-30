import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TodayPage from './pages/TodayPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route index element={<TodayPage />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;