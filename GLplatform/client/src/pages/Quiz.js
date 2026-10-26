import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const quizData = {
  "1": { name:'Data Structures', icon:'🌲', questions:[
    { q:'Which data structure uses LIFO?', options:['Queue','Stack','Tree','Graph'], ans:1 },
    { q:'Time complexity of Binary Search?', options:['O(n)','O(n²)','O(log n)','O(1)'], ans:2 },
    { q:'Which is used in BFS traversal?', options:['Stack','Queue','Heap','Array'], ans:1 },
    { q:'What is the height of a balanced BST with n nodes?', options:['O(n)','O(n²)','O(log n)','O(1)'], ans:2 },
    { q:'Which data structure is used for recursion?', options:['Queue','Stack','Array','Graph'], ans:1 },
  ]},
  "2": { name:'Operating Systems', icon:'💻', questions:[
    { q:'Which scheduling has minimum avg waiting time?', options:['FCFS','SJF','Round Robin','Priority'], ans:1 },
    { q:'Deadlock requires how many necessary conditions?', options:['2','3','4','5'], ans:2 },
    { q:'What is thrashing?', options:['High CPU use','Excessive paging','Memory leak','Cache miss'], ans:1 },
    { q:'Which is NOT a process state?', options:['Running','Waiting','Sleeping','Compiling'], ans:3 },
    { q:'Semaphore is used for?', options:['Memory mgmt','Process sync','CPU scheduling','Disk access'], ans:1 },
  ]},
  "3": { name:'DBMS', icon:'🗄️', questions:[
    { q:'Which key uniquely identifies a row?', options:['Foreign Key','Primary Key','Candidate Key','Super Key'], ans:1 },
    { q:'ACID stands for?', options:['Atomicity Consistency Isolation Durability','All Correct In DB','Advanced Compile In DB','None'], ans:0 },
    { q:'Which normal form removes partial dependency?', options:['1NF','2NF','3NF','BCNF'], ans:1 },
    { q:'JOIN combines rows from how many tables?', options:['1','2 or more','Only 3','Only 2'], ans:1 },
    { q:'Which is a DDL command?', options:['SELECT','INSERT','CREATE','UPDATE'], ans:2 },
  ]},
  "4": { name:'Computer Networks', icon:'🌐', questions:[
    { q:'Which layer handles routing?', options:['Physical','Data Link','Network','Transport'], ans:2 },
    { q:'TCP is?', options:['Connectionless','Connection-oriented','Both','Neither'], ans:1 },
    { q:'DNS converts?', options:['IP to MAC','Domain to IP','IP to Domain','MAC to IP'], ans:1 },
    { q:'HTTP default port?', options:['21','22','80','443'], ans:2 },
    { q:'Which is a private IP range?', options:['8.8.8.8','192.168.0.0','172.217.0.0','142.250.0.0'], ans:1 },
  ]},
  "5": { name:'OOP Concepts', icon:'🧩', questions:[
    { q:'Which OOP concept hides internal data?', options:['Inheritance','Polymorphism','Encapsulation','Abstraction'], ans:2 },
    { q:'Overriding is an example of?', options:['Compile-time polymorphism','Runtime polymorphism','Encapsulation','Abstraction'], ans:1 },
    { q:'Constructor is called?', options:['Manually','At object creation','At object deletion','Never'], ans:1 },
    { q:'Which keyword is used for inheritance in Java?', options:['this','super','extends','implements'], ans:2 },
    { q:'Abstract class can have?', options:['Only abstract methods','Only concrete methods','Both','Neither'], ans:2 },
  ]},
  "6": { name:'Algorithms', icon:'⚡', questions:[
    { q:'Quicksort average time complexity?', options:['O(n)','O(n log n)','O(n²)','O(log n)'], ans:1 },
    { q:'Which is a greedy algorithm?', options:['Merge Sort','Dijkstra','DFS','BFS'], ans:1 },
    { q:'Dynamic programming solves problems by?', options:['Dividing','Storing subproblem results','Greedy choice','Backtracking'], ans:1 },
    { q:'Binary search requires array to be?', options:['Sorted','Unsorted','Linked','Circular'], ans:0 },
    { q:'Worst case of bubble sort?', options:['O(n)','O(n log n)','O(n²)','O(log n)'], ans:2 },
  ]},
};

export default function Quiz() {
  const { id } = useParams();
  const { token, updateUser } = useAuth();
  const navigate = useNavigate();

  const quiz = quizData[id];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Safety check
  if (!quiz) return (
    <div style={{...styles.page, flexDirection:'column', gap:'1rem'}}>
      <h2 style={{color:'#f87171'}}>Quiz not found!</h2>
      <button style={styles.btn} onClick={() => navigate('/')}>← Back to Dashboard</button>
    </div>
  );

  const q = quiz.questions[current];
  const isCorrect = selected === q.ans;

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.ans) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (current + 1 < quiz.questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
        setDone(true);
        try {
          const res = await axios.post('http://localhost:5000/api/users/xp',
            { xp: score * 10 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          updateUser({ xp: res.data.xp, badges: res.data.badges });
        } catch(e) { console.log(e); }
      }
  };

  const getOptionStyle = (i) => {
    if (!answered) return styles.option;
    if (i === q.ans) return {...styles.option, background:'#166534', borderColor:'#22c55e'};
    if (i === selected && selected !== q.ans) return {...styles.option, background:'#7f1d1d', borderColor:'#f87171'};
    return {...styles.option, opacity: 0.5};
  };

  if (done) return (
    <div style={styles.page}>
      <div style={styles.resultCard}>
        <div style={styles.resultIcon}>{score >= quiz.questions.length * 0.8 ? '🏆' : score >= quiz.questions.length * 0.5 ? '👍' : '📚'}</div>
        <h2 style={{color:'#fff', margin:'0.5rem 0'}}>Quiz Complete!</h2>
        <p style={styles.scoreText}>{score}<span style={{color:'#aaa', fontSize:'1.5rem'}}>/{quiz.questions.length}</span></p>
        <p style={styles.xpEarned}>+{score * 10} XP earned! ⭐</p>
        <p style={{color:'#aaa'}}>{score >= quiz.questions.length * 0.8 ? 'Excellent work! 🔥' : score >= quiz.questions.length * 0.5 ? 'Good job! Keep practicing.' : 'Keep studying, you got this!'}</p>
        <div style={styles.resultBtns}>
          <button style={styles.btn} onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}>🔄 Retry</button>
          <button style={{...styles.btn, background:'#1a1a2e', border:'1px solid #7c3aed'}} onClick={() => navigate('/')}>← Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.subject}>{quiz.icon} {quiz.name}</span>
          <span style={styles.counter}>{current + 1} / {quiz.questions.length}</span>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBg}>
          <div style={{...styles.progressFill, width:`${((current) / quiz.questions.length) * 100}%`}} />
        </div>

        {/* Score */}
        <p style={styles.scoreLabel}>⭐ Score: {score * 10} XP</p>

        {/* Question */}
        <h3 style={styles.question}>{q.q}</h3>

        {/* Options */}
        <div style={styles.options}>
          {q.options.map((opt, i) => (
            <div key={i} style={getOptionStyle(i)} onClick={() => handleSelect(i)}>
              <span style={styles.optLetter}>{['A','B','C','D'][i]}</span>
              <span>{opt}</span>
              {answered && i === q.ans && <span style={{marginLeft:'auto'}}>✅</span>}
              {answered && i === selected && selected !== q.ans && <span style={{marginLeft:'auto'}}>❌</span>}
            </div>
          ))}
        </div>

        {/* Feedback */}
        {answered && (
          <div style={{...styles.feedback, background: isCorrect ? '#14532d' : '#7f1d1d'}}>
            {isCorrect ? '✅ Correct! +10 XP' : `❌ Correct answer: ${q.options[q.ans]}`}
          </div>
        )}

        {/* Next button */}
        {answered && (
          <button style={styles.btn} onClick={handleNext}>
            {current + 1 === quiz.questions.length ? 'Finish Quiz 🎉' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background:'#0f0f1a', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' },
  card: { background:'#1a1a2e', borderRadius:'1rem', padding:'2rem', width:'100%', maxWidth:'620px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' },
  subject: { color:'#7c3aed', fontWeight:'bold', fontSize:'1rem' },
  counter: { color:'#aaa', fontSize:'0.9rem' },
  progressBg: { background:'#0f0f1a', borderRadius:'99px', height:'6px', marginBottom:'0.75rem' },
  progressFill: { background:'#7c3aed', borderRadius:'99px', height:'6px', transition:'width 0.4s' },
  scoreLabel: { color:'#fbbf24', fontSize:'0.85rem', margin:'0 0 1rem' },
  question: { color:'#fff', fontSize:'1.2rem', marginBottom:'1.5rem', lineHeight:1.5 },
  options: { display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1rem' },
  option: { padding:'0.9rem 1rem', borderRadius:'0.5rem', color:'#fff', cursor:'pointer',borderWidth:'1px', borderStyle:'solid', borderColor:'#2a2a4a', display:'flex', alignItems:'center', gap:'0.75rem', transition:'all 0.2s' },
  optLetter: { background:'#0f0f1a', borderRadius:'50%', width:'28px', height:'28px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:'bold', flexShrink:0 },
  feedback: { padding:'0.75rem 1rem', borderRadius:'0.5rem', color:'#fff', marginBottom:'1rem', fontWeight:'bold' },
  btn: { background:'#7c3aed', color:'#fff', border:'none', padding:'0.75rem 1.5rem', borderRadius:'0.5rem', cursor:'pointer', fontSize:'1rem', width:'100%' },
  resultCard: { background:'#1a1a2e', borderRadius:'1rem', padding:'3rem 2rem', textAlign:'center', color:'#fff', maxWidth:'400px', width:'100%' },
  resultIcon: { fontSize:'4rem' },
  scoreText: { fontSize:'3.5rem', fontWeight:'bold', color:'#7c3aed', margin:'0.5rem 0' },
  xpEarned: { color:'#fbbf24', fontSize:'1.2rem', marginBottom:'0.5rem' },
  resultBtns: { display:'flex', gap:'1rem', marginTop:'1.5rem' },
};