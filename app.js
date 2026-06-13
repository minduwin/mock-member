const express = require('express');
const app = express();
const path = require('node:path');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const appRouter = require('./routes/appRouter');

const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Needs to parse incoming body data first
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Then set up sessions and passport
app.use(session({ secret: 'mario', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Global middleware to access local variable as user
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use('/', appRouter);

app.listen(port, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Listening on port ${port}...`);
});