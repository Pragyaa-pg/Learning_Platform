# BPrep: Gamified Learning Platform

A full-stack MERN web app that helps B.Tech students prepare for placements through subject quizzes, XP, ranks, badges and a leaderboard.

## Features
- Register and login with JWT authentication (passwords hashed with bcrypt)
- 6 subject quizzes: Data Structures, Operating Systems, DBMS, Computer Networks, OOP, Algorithms (5 MCQs each, 10 XP per correct answer)
- XP, ranks and badges
- Leaderboard of the top 10 users
- Profile page with editable name, college, branch and semester
- Daily login streak

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, React Router, Context API, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | JSON Web Tokens, bcrypt |

## Project Structure
```
GLplatform/
  client/   React app (pages, components, AuthContext)
  server/   Express API (routes, models, middleware)
```

## Getting Started

**Prerequisites:** Node.js 18+ and a free MongoDB Atlas cluster.

1. Clone the repo
```
git clone https://github.com/Pragyaa-pg/Learning_Platform.git
cd Learning_Platform
```

2. Start the backend
```
cd GLplatform/server
npm install
copy .env.example .env
```
Open `.env` and fill in your values (see below), then:
```
npm run dev
```
The API runs on http://localhost:5000

3. Start the frontend (new terminal)
```
cd GLplatform/client
npm install
npm start
```
The app opens on http://localhost:3000

## Environment Variables (server/.env)
| Variable | Description |
|---|---|
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Long random string used to sign tokens |
| PORT | Server port (5000) |

## API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create an account |
| POST | /api/auth/login | No | Login and get a token |
| GET | /api/users/me | Yes | Get the logged-in user |
| PUT | /api/users/me | Yes | Update profile |
| POST | /api/users/xp | Yes | Add XP after a quiz |
| GET | /api/users/leaderboard | Yes | Top 10 users by XP |

## Screenshots
![Dashboard](screenshots/dashboard.png)
![Quiz](screenshots/quiz.png)
![Leaderboard](screenshots/leaderboard.png)

## Known Limitations and Future Work
- Quiz questions are currently stored in the frontend; plan to move them to a MongoDB collection with random selection
- Answers are checked on the client; plan to verify on the server so XP cannot be tampered with
- Add input validation, rate limiting and tests
- Deploy (Vercel for the frontend, Render for the backend)

## Author
Pragya Gupta
GitHub: https://github.com/Pragyaa-pg
LinkedIn: https://linkedin.com/in/pragya-4568aa376