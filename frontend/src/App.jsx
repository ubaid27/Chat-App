import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

import { useAuthStore } from './store/useAuthStore';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';

const App = () => {
  const { authUser, checkAuth,isCheckingAuth, onlineUsers } = useAuthStore(); 
  const {theme} = useThemeStore();
 
  console.log({onlineUsers});
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if(isCheckingAuth && !authUser) 
    return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>  
    )

  return (
    <div data-theme={theme} className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 ">
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to= "/" /> } />
        <Route path="/login" element={ !authUser ?  <LogInPage />  : <Navigate to= "/" /> } />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
      </Routes>
      </div>

      <Toaster/>
    </div>
  );
};

export default App;
