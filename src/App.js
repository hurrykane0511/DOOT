import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/auth';
import ForgotPage from './pages/ForgotPage';
import HomePage from './pages/HomePage';
import LoginForm from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot' element={<ForgotPage />} />
          <Route index element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App;