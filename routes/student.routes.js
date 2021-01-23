const express = require('express');
const passport = require('passport');
const Student = require('../models/Student');
const Course = require('../models/Course')

const fileMiddleware = require('../middleware/file.middleware');

const router = express.Router();

router.get('/', async(req, res, next) => {
    const courses = await Course.find();
    return res.status(200).render('createStudent', { courses });
});

router.post('/create', [fileMiddleware.upload.single('photo')], async(req, res, async) =>{


    passport.authenticate('registerStudent', (error, user) => {
        if(error){
            return res.render('createStudent', {error});
        }
        req.logIn(user, (error) => {
            if(error){
                return res.render('createProfessor', {error: error.message});
            }
            return res.redirect("/student/show");
        })
   
    })(req);
 
})

router.get('/show', async(req, res, next) => {
    try{
    const allStudents = await Student.find().populate('courses');
       
    res.status(200).render('showStudents', { allStudents });

    }catch(error){
        next(error)
    }
})

router.get('/:id/modify/', async(req, res, next) => {
 
    try{
        const id = req.params.id;
        const student = await Student.findById(id).populate('courses');
        res.status(200).render('student/modifyStudent', { student });

    }catch(error){
        next(error);
    }
})
router.post('/:id/modify/', [fileMiddleware.upload.single('photo')], async(req, res, next) => {
    
    try{
        const {name, lastName, mail, age } = req.query;
        console.log(req.body)
        const id = req.params.id;
        // req.body.photo = `/uploads/${req.body.photo}`
        const student = await Student.findByIdAndUpdate(id, req.body,
        {new : true});
        res.status(200).redirect('/subject');

    }catch(error){
        next(error);
    }
})
router.get('/:id/delete', async (req, res, next) => {
    try{
        const id = req.params.id;
        const deleteUser = await Student.findByIdAndDelete(id);
        res.status(200).redirect('/student/show')

    }catch(error){
        next(error);
    }
})


module.exports = router;