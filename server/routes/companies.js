const express = require('express');
const router = express.Router();
const companyObject = require('../data/companies.json');

console.log(companyObject);

router.get('/', function(req, res) {
  res.send(companyObject);
});//End route

module.exports = router;
