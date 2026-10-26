require('dotenv').config();
const mongoose = require('mongoose');
const Lesson   = require('./models/Lesson');

mongoose.connect(process.env.MONGO_URI);

const lessons = [
  {
    title:       "Arrays - Introduction",
    subject:     "DSA",
    semester:    3,
    branch:      ["CSE","IT","ALL"],
    youtubeId:   "37E9ckMDdTk",
    notes:       "Arrays store elements at contiguous memory locations. Key operations: traversal, insertion, deletion.",
    duration:    "18 mins",
    xpReward:    10,
    relevantFor: ["TCS","Amazon","Google","Infosys"]
  },
  {
    title:       "Linked List - Basics",
    subject:     "DSA",
    semester:    3,
    branch:      ["CSE","IT","ALL"],
    youtubeId:   "R9PTBwOzceo",
    notes:       "Linked lists use nodes with data + pointer to next node. No contiguous memory needed.",
    duration:    "22 mins",
    xpReward:    10,
    relevantFor: ["Amazon","Google"]
  },
  {
    title:       "OS - Process vs Thread",
    subject:     "OS",
    semester:    4,
    branch:      ["CSE","IT","ALL"],
    youtubeId:   "O3EyzlZxx3g",
    notes:       "Process = program in execution. Thread = lightweight process sharing same memory.",
    duration:    "15 mins",
    xpReward:    10,
    relevantFor: ["TCS","Infosys","Amazon"]
  },
  {
    title:       "DBMS - ER Model",
    subject:     "DBMS",
    semester:    4,
    branch:      ["CSE","IT","ALL"],
    youtubeId:   "sTcOwNBGRmY",
    notes:       "Entity Relationship model shows entities, attributes and relationships in a database.",
    duration:    "20 mins",
    xpReward:    10,
    relevantFor: ["TCS","Infosys"]
  }
];

Lesson.insertMany(lessons)
  .then(() => { console.log('Seeded!'); mongoose.disconnect(); })
  .catch(err => console.log(err));