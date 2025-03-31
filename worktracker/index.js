const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function parseDate(timestamp) {
  try {
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) {
      return "{'status': false}";
    }
    return date.toDateString();
  } catch (_) {
    return "{'status': false}";
  }
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
    const existingUser = this.users.find((user) => user.username === username);
    if (existingUser) {
      return res.json({ error: 'user already exists' });
    }

    const newUser = {
      username: username,
      _id: new Date().getTime().toString(),
    };
    this.users.push(newUser);
    res.json(newUser);
  }

  addExercise(req, res) {
    const userId = req.params._id;
    const description = req.body.description;
    const duration = req.body.duration;
    const _date = req.body.date ? parseDate(req.body.date) : new Date().toDateString();
    
    if (_date === "{'status': false}") {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const user = this.users.find((u) => u._id === userId);
    if (!user) {
      return res.json({ error: 'user id not found' });
    }

    const newExercise = {
      description: description,
      duration: duration,
      date: _date,
      _id: user._id,
      username: user.username,
    };

    this.exercises.push({ userId, ...newExercise });
    user.exercises = user.exercises || [];
    user.exercises.push(newExercise);

    res.json(user);
  }

  getLogs(req, res) {
    const userId = req.params._id;

    const user = this.users.find((u) => u._id === userId);
    if (!user) {
      return res.json({ error: 'user id not found' });
    }

    let userExercises = this.exercises.filter((ex) => ex.userId === userId);

    if (req.query.from) {
      userExercises = userExercises.filter((ex) => new Date(ex.date) >= new Date(req.query.from));
    }

    if (req.query.to) {
      userExercises = userExercises.filter((ex) => new Date(ex.date) <= new Date(req.query.to));
    }

    if (req.query.limit) {
      userExercises = userExercises.slice(0, parseInt(req.query.limit));
    }

    res.json({
      username: user.username,
      _id: user._id,
      count: userExercises.length,
      log: userExercises,
    });
  }
}

const exerciseTracker = new ExerciseTracker();

app.get('/api/users', (req, res) => exerciseTracker.sendUsers(req, res));

app.post('/api/users', (req, res) => exerciseTracker.createUser(req, res));

app.post('/api/users/:_id/exercises', (req, res) => exerciseTracker.addExercise(req, res));

app.get('/api/users/:_id/logs', (req, res) => exerciseTracker.getLogs(req, res));

app.use(express.static(__dirname + '/public/'))

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(3000, () => {
  console.log('Flying on ' + listener.address().port);
});

module.exports = app;
