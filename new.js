const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGOLAB_URI;

router.get('/:path', (req, res) => {
  mongodb.connect(url, (err, db) => {
    if (err) throw err;
    const docs = db.collection('urls');
    const rand = findRand();
    const record = {
      short: rand,
      url: req.params.path
    };

    function findRand() {
      const rand = Math.floor(Math.random() * 10000);
      docs.findOne({short: rand}, (err, obj) => {
        if (err) throw err;
        if (obj) {
          rand = findRand();
        }
      });
      return rand;
    }
    docs.insert(record, (err, data) => {
      if (err) throw err;
      db.close();
    });
    res.send(JSON.stringify(record));
  })
});

module.exports = router;
