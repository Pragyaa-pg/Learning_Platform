import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const subjects = [
  { id: '1', name: 'Data Structures',    icon: '🌲', color: '#4f46e5' },
  { id: '2', name: 'Operating Systems',  icon: '💻', color: '#0891b2' },
  { id: '3', name: 'DBMS',               icon: '🗄️', color: '#059669' },
  { id: '4', name: 'Computer Networks',  icon: '🌐', color: '#d97706' },
  { id: '5', name: 'OOP Concepts',       icon: '🧩', color: '#db2777' },
  { id: '6', name: 'Algorithms',         icon: '⚡', color: '#7c3aed' },
];

const badges = [
  { name: 'Beginner', icon: '🥉', minPoints: 0 },
  { name: 'Scholar',  icon: '🥈', minPoints: 100 },
  { name: 'Expert',   icon: '🥇', minPoints: 300 },
  { name: 'Master',   icon: '🏆', minPoints: 600 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const xp = user?.xp || 0;
  const currentBadge = badges.filter(b => xp >= b.minPoints).pop();
  const nextBadge = badges.find(b => xp < b.minPoints);
  const progress = nextBadge
    ? ((xp - (currentBadge.minPoints)) / (nextBadge.minPoints - currentBadge.minPoints)) * 100
    : 100;

  const handleQuiz = (id) => {
    console.log('Navigating to quiz:', id); // debug
    navigate(`/quiz/${id}`);
  };

  return (
    <div style={styles.page}>

      {/* Hero Banner */}
      <div style={styles.hero}>
        <div>
          <h2 style={styles.greeting}>Welcome back, {user?.name} 👋</h2>
          <p style={styles.sub}>Keep learning to earn more XP and badges!</p>
          {nextBadge && (
            <div style={styles.progressWrap}>
              <span style={styles.progressLabel}>
                {xp} / {nextBadge.minPoints} XP → {nextBadge.icon} {nextBadge.name}
              </span>
              <div style={styles.barBg}>
                <div style={{...styles.barFill, width:`${progress}%`}} />
              </div>
            </div>
          )}
        </div>
        <div style={styles.badgeBox}>
          <span style={styles.badgeIcon}>{currentBadge.icon}</span>
          <span style={styles.badgeName}>{currentBadge.name}</span>
          <span style={styles.xpText}>⭐ {xp} XP</span>
        </div>
      </div>

      {/* Quiz Grid */}
      <h3 style={styles.sectionTitle}>📚 Choose a Subject Quiz</h3>
      <div style={styles.grid}>
        {subjects.map(s => (
          <div key={s.id} style={styles.card}>
            <div style={{...styles.cardTop, background: s.color + '22', borderBottom:`2px solid ${s.color}`}}>
              <span style={styles.cardIcon}>{s.icon}</span>
            </div>
            <div style={styles.cardBody}>
              <h4 style={styles.cardTitle}>{s.name}</h4>
              <p style={styles.cardSub}>5 questions • +10 XP each</p>
              <button
                style={{...styles.btn, background: s.color}}
                onClick={() => handleQuiz(s.id)}
              >
                Start Quiz →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page:          { background:'#0f0f1a', minHeight:'100vh', padding:'2rem', color:'#fff' },
  hero:          { background:'#1a1a2e', borderRadius:'1rem', padding:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' },
  greeting:      { margin:0, fontSize:'1.8rem' },
  sub:           { color:'#aaa', marginTop:'0.4rem', marginBottom:'1rem' },
  progressWrap:  { maxWidth:'320px' },
  progressLabel: { color:'#aaa', fontSize:'0.8rem' },
  barBg:         { background:'#0f0f1a', borderRadius:'99px', height:'8px', marginTop:'4px' },
  barFill:       { background:'#7c3aed', borderRadius:'99px', height:'8px', transition:'width 0.5s' },
  badgeBox:      { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem' },
  badgeIcon:     { fontSize:'3.5rem' },
  badgeName:     { color:'#fbbf24', fontWeight:'bold', fontSize:'1.1rem' },
  xpText:        { color:'#7c3aed', fontWeight:'bold' },
  sectionTitle:  { marginBottom:'1.25rem', fontSize:'1.3rem' },
  grid:          { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1.5rem' },
  card:          { background:'#1a1a2e', borderRadius:'1rem', overflow:'hidden', border:'1px solid #2a2a4a', transition:'transform 0.2s', cursor:'pointer' },
  cardTop:       { padding:'1.5rem', display:'flex', justifyContent:'center' },
  cardIcon:      { fontSize:'2.5rem' },
  cardBody:      { padding:'1rem 1.25rem 1.25rem' },
  cardTitle:     { margin:'0 0 0.3rem', fontSize:'1.05rem', fontWeight:'bold' },
  cardSub:       { color:'#aaa', fontSize:'0.82rem', marginBottom:'1rem' },
  btn:           { width:'100%', color:'#fff', border:'none', padding:'0.6rem', borderRadius:'0.5rem', cursor:'pointer', fontWeight:'bold', fontSize:'0.9rem' },
};