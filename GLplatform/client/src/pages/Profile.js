import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const badgeList = [
  { name:'Beginner', icon:'🥉', minXP:0   },
  { name:'Scholar',  icon:'🥈', minXP:100 },
  { name:'Expert',   icon:'🥇', minXP:300 },
  { name:'Master',   icon:'🏆', minXP:600 },
];

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [form, setForm] = useState({
    name:     user?.name     || '',
    college:  user?.college  || '',
    branch:   user?.branch   || 'CSE',
    semester: user?.semester || 1,
  });

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API}/users/me`, form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser(res.data);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
  };

  const xp = user?.xp || 0;
  const streak = user?.streak || 0;
  const earnedBadges = badgeList.filter(b => xp >= b.minXP);
  const nextBadge    = badgeList.find(b => xp < b.minXP);
  const currentBadge = earnedBadges[earnedBadges.length - 1];
  const progress     = nextBadge
    ? ((xp - currentBadge.minXP) / (nextBadge.minXP - currentBadge.minXP)) * 100
    : 100;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Profile Card */}
        <div style={styles.card}>
          <div style={styles.avatarWrap}>
            <div style={styles.avatar}>{initials}</div>
            <div style={styles.streakBadge}>🔥 {streak}</div>
          </div>

          {editing ? (
            <div style={styles.editForm}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} />

              <label style={styles.label}>College</label>
              <input style={styles.input} value={form.college}
                onChange={e => setForm({...form, college: e.target.value})} />

              <label style={styles.label}>Branch</label>
              <select style={styles.input} value={form.branch}
                onChange={e => setForm({...form, branch: e.target.value})}>
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
                <option>ME</option>
              </select>

              <label style={styles.label}>Semester</label>
              <select style={styles.input} value={form.semester}
                onChange={e => setForm({...form, semester: Number(e.target.value)})}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
              </select>

              <div style={styles.btnRow}>
                <button style={styles.btnSave} onClick={handleSave}>💾 Save</button>
                <button style={styles.btnCancel} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={styles.info}>
              <h2 style={styles.name}>{user?.name}</h2>
              <p style={styles.email}>✉️ {user?.email}</p>
              <p style={styles.detail}>🎓 {user?.branch} • Semester {user?.semester || 1}</p>
              <p style={styles.detail}>🏫 {user?.college || 'Not set'}</p>
              {saved && <p style={styles.savedMsg}>✅ Profile updated!</p>}
              <button style={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>⭐</span>
            <span style={styles.statVal}>{xp}</span>
            <span style={styles.statLabel}>Total XP</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🔥</span>
            <span style={styles.statVal}>{streak}</span>
            <span style={styles.statLabel}>Day Streak</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>{currentBadge.icon}</span>
            <span style={styles.statVal}>{currentBadge.name}</span>
            <span style={styles.statLabel}>Current Rank</span>
          </div>
        </div>

        {/* XP Progress */}
        <div style={styles.xpCard}>
          <div style={styles.xpHeader}>
            <span style={{color:'#fff', fontWeight:'bold'}}>XP Progress</span>
            <span style={{color:'#aaa', fontSize:'0.85rem'}}>
              {nextBadge ? `${xp} / ${nextBadge.minXP} XP to ${nextBadge.name}` : '🏆 Max rank reached!'}
            </span>
          </div>
          <div style={styles.barBg}>
            <div style={{...styles.barFill, width:`${progress}%`}} />
          </div>
        </div>

        {/* Badges */}
        <div style={styles.badgesCard}>
          <h3 style={styles.sectionTitle}>🏅 Badges</h3>
          <div style={styles.badgesGrid}>
            {badgeList.map(b => {
              const earned = xp >= b.minXP;
              return (
                <div key={b.name} style={{...styles.badge, opacity: earned ? 1 : 0.3}}>
                  <span style={styles.badgeIcon}>{b.icon}</span>
                  <span style={styles.badgeName}>{b.name}</span>
                  {earned
                    ? <span style={styles.badgeEarned}>✅ Earned</span>
                    : <span style={styles.badgeLocked}>🔒 {b.minXP} XP</span>
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Info */}
        <div style={styles.streakCard}>
          <h3 style={styles.sectionTitle}>🔥 Daily Streak</h3>
          <div style={styles.streakInfo}>
            <div style={styles.flameBig}>{streak > 0 ? '🔥' : '💤'}</div>
            <div>
              <p style={styles.streakCount}>{streak} day{streak !== 1 ? 's' : ''} in a row</p>
              <p style={styles.streakTip}>
                {streak === 0
                  ? 'Log in and take a quiz today to start your streak!'
                  : streak < 3
                  ? 'Great start! Keep going to build your streak 💪'
                  : streak < 7
                  ? 'On fire! Keep logging in daily 🔥'
                  : '🌟 Incredible streak! You\'re a dedicated learner!'}
              </p>
            </div>
          </div>
          {/* Streak dots — last 7 days visualization */}
          <div style={styles.streakDots}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => (
              <div key={day} style={styles.dotWrap}>
                <div style={{...styles.dot, background: i < streak % 7 ? '#f97316' : '#2a2a4a'}} />
                <span style={styles.dotLabel}>{day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page:         { background:'#0f0f1a', minHeight:'100vh', padding:'2rem', color:'#fff' },
  container:    { maxWidth:'700px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.5rem' },
  card:         { background:'#1a1a2e', borderRadius:'1rem', padding:'2rem', display:'flex', gap:'2rem', alignItems:'flex-start', flexWrap:'wrap' },
  avatarWrap:   { position:'relative', flexShrink:0 },
  avatar:       { width:'90px', height:'90px', borderRadius:'50%', background:'#7c3aed', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', fontWeight:'bold', border:'3px solid #9f67ff' },
  streakBadge:  { position:'absolute', bottom:'-8px', right:'-8px', background:'#f97316', borderRadius:'99px', padding:'2px 8px', fontSize:'0.8rem', fontWeight:'bold', color:'#fff' },
  info:         { flex:1 },
  name:         { margin:'0 0 0.4rem', fontSize:'1.6rem' },
  email:        { color:'#aaa', margin:'0 0 0.3rem', fontSize:'0.9rem' },
  detail:       { color:'#ccc', margin:'0 0 0.3rem', fontSize:'0.9rem' },
  savedMsg:     { color:'#22c55e', margin:'0.5rem 0' },
  editBtn:      { marginTop:'1rem', background:'#7c3aed', color:'#fff', border:'none', padding:'0.5rem 1.2rem', borderRadius:'0.5rem', cursor:'pointer' },
  editForm:     { flex:1, display:'flex', flexDirection:'column', gap:'0.5rem' },
  label:        { color:'#aaa', fontSize:'0.8rem' },
  input:        { padding:'0.6rem', borderRadius:'0.5rem', border:'1px solid #333', background:'#0f0f1a', color:'#fff', fontSize:'0.95rem' },
  btnRow:       { display:'flex', gap:'0.75rem', marginTop:'0.5rem' },
  btnSave:      { background:'#7c3aed', color:'#fff', border:'none', padding:'0.6rem 1.2rem', borderRadius:'0.5rem', cursor:'pointer', flex:1 },
  btnCancel:    { background:'#2a2a4a', color:'#fff', border:'none', padding:'0.6rem 1.2rem', borderRadius:'0.5rem', cursor:'pointer' },
  statsRow:     { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' },
  statCard:     { background:'#1a1a2e', borderRadius:'1rem', padding:'1.25rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem' },
  statIcon:     { fontSize:'1.8rem' },
  statVal:      { color:'#fff', fontWeight:'bold', fontSize:'1.4rem' },
  statLabel:    { color:'#aaa', fontSize:'0.8rem' },
  xpCard:       { background:'#1a1a2e', borderRadius:'1rem', padding:'1.5rem' },
  xpHeader:     { display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' },
  barBg:        { background:'#0f0f1a', borderRadius:'99px', height:'10px' },
  barFill:      { background:'linear-gradient(90deg,#7c3aed,#f97316)', borderRadius:'99px', height:'10px', transition:'width 0.5s' },
  badgesCard:   { background:'#1a1a2e', borderRadius:'1rem', padding:'1.5rem' },
  sectionTitle: { margin:'0 0 1rem', fontSize:'1.1rem' },
  badgesGrid:   { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'1rem' },
  badge:        { background:'#0f0f1a', borderRadius:'0.75rem', padding:'1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', transition:'opacity 0.3s' },
  badgeIcon:    { fontSize:'2rem' },
  badgeName:    { color:'#fff', fontWeight:'bold', fontSize:'0.9rem' },
  badgeEarned:  { color:'#22c55e', fontSize:'0.75rem' },
  badgeLocked:  { color:'#aaa', fontSize:'0.75rem' },
  streakCard:   { background:'#1a1a2e', borderRadius:'1rem', padding:'1.5rem' },
  streakInfo:   { display:'flex', gap:'1.5rem', alignItems:'center', marginBottom:'1.5rem' },
  flameBig:     { fontSize:'3.5rem' },
  streakCount:  { color:'#f97316', fontWeight:'bold', fontSize:'1.3rem', margin:0 },
  streakTip:    { color:'#aaa', fontSize:'0.9rem', margin:'0.3rem 0 0' },
  streakDots:   { display:'flex', gap:'0.75rem', justifyContent:'center' },
  dotWrap:      { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem' },
  dot:          { width:'32px', height:'32px', borderRadius:'50%', transition:'background 0.3s' },
  dotLabel:     { color:'#aaa', fontSize:'0.7rem' },
};