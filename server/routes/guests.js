const express = require('express');
const router = express.Router();
const guestsArray = require('../data/guests.json');

router.get('/', function(req, res) {
  res.send(guestsArray);
});//End route

module.exports = router;
