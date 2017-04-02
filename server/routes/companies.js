const express = require('express');
const router = express.Router();
const companyArray = require('../data/companies.json');

router.get('/', function(req, res) {
  res.send(companyArray);
});//End route

module.exports = router;
