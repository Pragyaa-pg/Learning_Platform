import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🎓 BPrep</Link>

      <div style={styles.right}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/leaderboard" style={styles.link}>🏆 Leaderboard</Link>
        <span style={styles.xp}>⭐ {user?.xp || 0} XP</span>

        {/* Profile Icon */}
        <div ref={ref} style={styles.profileWrap}>
          <div style={styles.avatar} onClick={() => setOpen(o => !o)}>{initials}</div>

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.dropHeader}>
                <div style={styles.avatarLg}>{initials}</div>
                <div>
                  <p style={styles.dropName}>{user?.name}</p>
                  <p style={styles.dropEmail}>{user?.email}</p>
                  <p style={styles.dropBranch}>🎓 {user?.branch || 'B.Tech'}</p>
                </div>
              </div>
              <hr style={styles.divider} />
              <div style={styles.xpBar}>
                <span style={styles.xpLabel}>⭐ {user?.xp || 0} XP</span>
                <div style={styles.barBg}>
                  <div style={{...styles.barFill, width: `${Math.min((user?.xp || 0) % 100, 100)}%`}} />
                </div>
              </div>
              <hr style={styles.divider} />
              <button style={styles.dropItem} onClick={() => { navigate('/profile'); setOpen(false); }}>👤 My Profile</button>
              <button style={styles.dropItem} onClick={() => { navigate('/leaderboard'); setOpen(false); }}>🏆 Leaderboard</button>
              
              <hr style={styles.divider} />
              <button style={{...styles.dropItem, color:'#f87171'}}
                onClick={() => { logout(); navigate('/login'); }}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background:'#1a1a2e', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #2a2a4a', position:'sticky', top:0, zIndex:100 },
  logo: { color:'#7c3aed', fontWeight:'bold', fontSize:'1.5rem', textDecoration:'none' },
  right: { display:'flex', gap:'1.5rem', alignItems:'center' },
  link: { color:'#ccc', textDecoration:'none', fontSize:'0.95rem' },
  xp: { color:'#fbbf24', fontWeight:'bold' },
  profileWrap: { position:'relative' },
  avatar: { width:'38px', height:'38px', borderRadius:'50%', background:'#7c3aed', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', cursor:'pointer', fontSize:'0.9rem', border:'2px solid #9f67ff' },
  dropdown: { position:'absolute', right:0, top:'48px', background:'#1a1a2e', border:'1px solid #2a2a4a', borderRadius:'0.75rem', width:'260px', padding:'1rem', zIndex:200, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' },
  dropHeader: { display:'flex', gap:'0.75rem', alignItems:'center', marginBottom:'0.75rem' },
  avatarLg: { width:'48px', height:'48px', borderRadius:'50%', background:'#7c3aed', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'1.2rem', flexShrink:0 },
  dropName: { color:'#fff', fontWeight:'bold', margin:0, fontSize:'0.95rem' },
  dropEmail: { color:'#aaa', margin:'2px 0', fontSize:'0.8rem' },
  dropBranch: { color:'#7c3aed', margin:0, fontSize:'0.8rem' },
  divider: { border:'none', borderTop:'1px solid #2a2a4a', margin:'0.5rem 0' },
  xpBar: { padding:'0.25rem 0' },
  xpLabel: { color:'#fbbf24', fontSize:'0.85rem' },
  barBg: { background:'#0f0f1a', borderRadius:'99px', height:'6px', marginTop:'4px' },
  barFill: { background:'#7c3aed', borderRadius:'99px', height:'6px', transition:'width 0.3s' },
  dropItem: { width:'100%', background:'none', border:'none', color:'#ccc', padding:'0.6rem 0.5rem', textAlign:'left', cursor:'pointer', borderRadius:'0.5rem', fontSize:'0.9rem' },
};