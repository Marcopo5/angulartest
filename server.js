const express = require('express'); //ok
const path = require('path'); //ok
const bodyParser = require('body-parser'); //ok
const cors = require('cors'); // invece di questo ha importato morgan
const passport = require('passport'); // non so casa sia
const mongoose = require('mongoose'); //ok
const api = require('./routes/api'); // ok
// Port Number
//const port = process.env.PORT || 8080;
const port = 3000;

// inserito da me perchè dava un errore di deprecato su promise
  mongoose.Promise = global.Promise;

// *********** CONNESSIONE AL DATABASE *********************
database = "mongodb://pongi58:pongi58@ds161640.mlab.com:61640/mytasklist_brad";


//  1) Connect To Database
mongoose.connect(database);
// 2) On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+  database);
  });
// 3) On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});
/*
// oppure 
mongoose.connect(database, function(err) {
    if (err) {
        return 'Database error: ' + err;
    } else {
        console.log('Successfully connected to ' + database);
    }
});
*/

// mette sulla variabile app la funzione express
const app = express();

// CORS Middleware
app.use(cors());
// Body Parser Middleware
app.use(bodyParser.json());
/* 
nell'altro programma era stato importato morgan invece di cors
var morgan = require('morgan');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
*/
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/api', api);

// Index Route: Questo è quello che risponde in caso di accesso diretto alla 
// porta 3000 se non c'è la directory public
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});
// stabilisce il file di partenza
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
