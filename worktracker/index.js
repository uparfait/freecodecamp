const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function parseDate(inputDate) {
  if (!inputDate) return new Date().toDateString();
  const date = new Date(inputDate);
  return isNaN(date.getTime()) ? null : date.toDateString();
}

class ExerciseTracker {
  constructor() {
    this.users = [];
    this.exercises = [];
  }

  sendUsers(req, res) {
    res.json(this.users);
  }

  createUser(req, res) {
    const username = req.body.username;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    
    const existingUser = this.users.find((user) => user.username === username);
    if (existingUser) return res.json(existingUser);
    
    const newUser = { username, _id: new Date().getTime().toString() };
    this.users.push(newUser);
    res.json(newUser);
  }

  addExercise(req, res) {
    const userId = req.params._id;
    const { description, duration, date } = req.body;
    
    if (!description || !duration) {
      return res.status(400).json({ error: 'Description and duration are required' });
    }
    
    const parsedDuration = parseInt(duration);
    if (isNaN(parsedDuration)) {
      return res.status(400).json({ error: 'Duration must be a number' });
    }
    
    const user = this.users.find((u) => u._id === userId);
    if (!user) return res.json({ error: 'User ID not found' });

    const parsedDate = parseDate(date);
    if (!parsedDate) return res.status(400).json({ error: 'Invalid date format' });
    
    const newExercise = { description, duration: parsedDuration, date: parsedDate };
    this.exercises.push({ userId, ...newExercise });
    
    res.json({
      _id: user._id,
      username: user.username,
      ...newExercise,
    });
  }

  getLogs(req, res) {
    const userId = req.params._id;
    const user = this.users.find((u) => u._id === userId);
    if (!user) return res.json({ error: 'User ID not found' });
    
    let userExercises = this.exercises.filter((ex) => ex.userId === userId);
    
    if (req.query.from) {
      const fromDate = new Date(req.query.from);
      if (!isNaN(fromDate.getTime())) {
        userExercises = userExercises.filter((ex) => new Date(ex.date) >= fromDate);
      }
    }
    
    if (req.query.to) {
      const toDate = new Date(req.query.to);
      if (!isNaN(toDate.getTime())) {
        userExercises = userExercises.filter((ex) => new Date(ex.date) <= toDate);
      }
    }
    
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      if (!isNaN(limit)) {
        userExercises = userExercises.slice(0, limit);
      }
    }
    
    res.json({
      username: user.username,
      _id: user._id,
      count: userExercises.length,
      log: userExercises.map(({ description, duration, date }) => ({ description, duration, date })),
    });
  }
}

const exerciseTracker = new ExerciseTracker();

app.get('/api/users', (req, res) => exerciseTracker.sendUsers(req, res));
app.post('/api/users', (req, res) => exerciseTracker.createUser(req, res));
app.post('/api/users/:_id/exercises', (req, res) => exerciseTracker.addExercise(req, res));
app.get('/api/users/:_id/logs', (req, res) => exerciseTracker.getLogs(req, res));
app.use(express.static(__dirname + '/public/'))

app.use('*', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


const listener = app.listen(3000, () => {
  console.log('Server running on port ' + listener.address().port);
});

module.exports = app;
