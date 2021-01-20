const express = require('express');

const Student = require('../models/Student');
const Course = require('../models/Course')

const router = express.Router();

router.get('/', async(req, res, next) => {
    const courses = await Course.find();
    return res.status(200).render('createStudent', { courses });
});

router.post('/create', async(req, res, async) =>{
    const {name, lastName, mail, password, age, courses} = req.body;
    const newStudent = new Student({
            name,
            lastName,
            mail,
            password,
            age,
            courses
    })
   
    const student = await newStudent.save()
    const std = await Student.findById(student._id).populate('courses');
    const allStudents = await Student.find().populate('courses');
    console.log(allStudents)
    return res.status(201).render('showStudents', { std, allStudents});
    
})

module.exports = router;