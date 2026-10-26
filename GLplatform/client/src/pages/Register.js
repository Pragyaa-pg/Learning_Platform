import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', branch:'CSE', college:'' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      await register(form.name, form.email, form.password, form.branch, form.college);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎓 BPrep</h1>
        <h2 style={styles.sub}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Full Name"
          onChange={e => setForm({...form, name: e.target.value})} />
        <input style={styles.input} placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input style={styles.input} placeholder="Password" type="password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <select style={styles.input}
          onChange={e => setForm({...form, branch: e.target.value})}>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
        </select>
        <input style={styles.input} placeholder="College Name"
          onChange={e => setForm({...form, college: e.target.value})} />
        <button style={styles.btn} onClick={handleSubmit}>Register</button>
        <p style={styles.link}>Have account? <Link to="/login" style={{color:'#7c3aed'}}>Login</Link></p>
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