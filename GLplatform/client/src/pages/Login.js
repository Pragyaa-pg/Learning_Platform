import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎓 BPrep</h1>
        <h2 style={styles.sub}>Welcome Back</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input style={styles.input} placeholder="Password" type="password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <button style={styles.btn} onClick={handleSubmit}>Login</button>
        <p style={styles.link}>No account? <Link to="/register" style={{color:'#7c3aed'}}>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#0f0f1a', display:'flex', alignItems:'center', justifyContent:'center' },
  card: { background:'#1a1a2e', padding:'2rem', borderRadius:'1rem', width:'360px', display:'flex', flexDirection:'column', gap:'1rem' },
  title: { color:'#7c3aed', textAlign:'center', margin:0, fontSize:'2rem' },
  sub: { color:'#fff', textAlign:'center', margin:0 },
  input: { padding:'0.75rem', borderRadius:'0.5rem', border:'1px solid #333', background:'#0f0f1a', color:'#fff', fontSize:'1rem' },
  btn: { padding:'0.75rem', borderRadius:'0.5rem', background:'#7c3aed', color:'#fff', border:'none', fontSize:'1rem', cursor:'pointer' },
  error: { color:'#f87171', textAlign:'center' },
  link: { color:'#aaa', textAlign:'center' }
};