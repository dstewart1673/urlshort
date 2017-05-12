const express = require('express');
const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGOLAB_URI;
const app = express();
const newe = require('./new');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      throw err;
    } else {
      console.log('Sent index');
    }
  });
});
app.use('/new/', newe);
app.get('/:id', (req, res) => {
  const short = parseInt(req.params.id);
  if (isNaN(short)) {
    res.status(404);
    res.send('Invalid URL');
  } else {
    mongodb.connect(url, (err, db) => {
      if (err) throw err;
      const docs = db.collection('urls');
      console.log(short);
      docs.findOne({short: short}, {url: 1}, (err, obj) => {
        if (err) throw err;
        console.log(obj.url);
        res.redirect(obj.url);
        db.close();
      });
    });
  }
});

app.listen(port, () => {
  console.log("server listening on " + port);
});
