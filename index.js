const express = require('express');
require('./db')
const Course = require('./models/Course');
const Subject = require('./models/Subject')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const PORT = 3000;
const server = express();

const passport = require('passport');
require('./passport');

const path = require('path');

server.use(passport.initialize());
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'hbs');

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(
  session({
    secret: 'upgradehub_node', // ¡Este secreto tendremos que cambiarlo en producción!
    resave: false, // Solo guardará la sesión si hay cambios en ella.
    saveUninitialized: false, // Lo usaremos como false debido a que gestionamos nuestra sesión con Passport
    cookie: {
      maxAge: 3600000 // Milisegundos de duración de nuestra cookie, en este caso será una hora.
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);


server.use(passport.initialize());
server.use(passport.session());

server.use(express.static(path.join(__dirname, 'public')));

const isAuthenticated = require('./middleware/authenticated.middleware');

const courseRouter = require('./routes/course.routes');
const subjectRouter = require('./routes/subject.routes');
const professorRouter = require('./routes/professor.routes');
const studentRouter = require('./routes/student.routes');
const indexRouter = require('./routes/login.routes');

server.use('/professor',[isAuthenticated.isAuthenticated], professorRouter);
server.use('/course', [isAuthenticated.isAuthenticated], courseRouter);
server.use('/subject', subjectRouter);
server.use('/student', studentRouter);
server.use('/login', indexRouter);


server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
 

});