const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const companies = require('./routes/companies.js');
const guests = require('./routes/guests.js');
const LOCALPORT = 3000;
var portDecision = process.env.PORT || LOCALPORT;

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.use('/companies', companies);
app.use('/guests', guests);

app.listen(portDecision, function() {
  console.log("Listening on port: ", portDecision);
})
