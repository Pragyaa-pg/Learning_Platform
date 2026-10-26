import { createContext, useContext, useState , useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(localStorage.getItem('token'));
  const [user,  setUser]    = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user',  JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password, branch, college) => {
    const res = await axios.post(`${API}/auth/register`, { name, email, password, branch, college });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user',  JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };
  
  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const merged = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...res.data };
        localStorage.setItem('user', JSON.stringify(merged));
        setUser(merged);
      })
      .catch(err => { if (err.response?.status === 401) logout(); });
  }, [token]);
  
  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);