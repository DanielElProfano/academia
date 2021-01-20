const express = require('express');
require('./db')
const Course = require('./models/Course');
const Subject = require('./models/Subject')
const PORT = 3000;
const server = express();

const path = require('path');


server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'hbs');

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const courseRouter = require('./routes/course.routes');
const subjectRouter = require('./routes/subject.routes');
const professorRouter = require('./routes/professor.routes');
const studentRouter = require('./routes/student.routes');


server.use('/professor', professorRouter);
server.use('/course', courseRouter);
server.use('/subject', subjectRouter);
server.use('/student', studentRouter);


server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
 

});