import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/leaderboard',
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(r => setUsers(r.data)).catch(console.log);
  }, [token]);

  const medals = ['🥇','🥈','🥉'];

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🏆 Leaderboard</h2>
      <div style={styles.list}>
        {users.map((u, i) => (
          <div key={u._id} style={styles.row}>
            <span style={styles.rank}>{medals[i] || `#${i+1}`}</span>
            <span style={styles.name}>{u.name}</span>
            <span style={styles.pts}>⭐ {u.xp} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { background:'#0f0f1a', minHeight:'100vh', padding:'2rem', color:'#fff' },
  title: { textAlign:'center', fontSize:'2rem', marginBottom:'2rem' },
  list: { maxWidth:'600px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'1rem' },
  row: { background:'#1a1a2e', borderRadius:'0.75rem', padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem' },
  rank: { fontSize:'1.5rem', width:'2rem' },
  name: { flex:1, fontSize:'1.1rem' },
  pts: { color:'#fbbf24', fontWeight:'bold' }
};