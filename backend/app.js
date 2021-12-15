const express = require('express');
const app = express();
const postsRoutes = require('./routes/posts')
const authRoutes = require('./routes/auth')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect("mongodb+srv://candle:rrjNshtDjPAPBkH1@cluster0.7n4kx.mongodb.net/DB_PostingAppAuth")
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed!!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use("/images",express.static(path.join("backend/images")));   // any url with static /image path is allowed

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/dashboard",postsRoutes);
app.use("/auth",authRoutes);
module.exports = app;
