import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>
          } />
          <Route path="/quiz/:id" element={
            <PrivateRoute><><Navbar /><Quiz /></></PrivateRoute>
          } />
          <Route path="/leaderboard" element={
            <PrivateRoute><><Navbar /><Leaderboard /></></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><><Navbar /><Profile /></></PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;