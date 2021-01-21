const express = require('express');
const passport = require('passport');
const Student = require('../models/Student');
const Course = require('../models/Course')

const router = express.Router();

router.get('/', async(req, res, next) => {
    const courses = await Course.find();
    return res.status(200).render('createStudent', { courses });
});

router.post('/create', async(req, res, async) =>{


    passport.authenticate('registerStudent', (error, user) => {
        if(error){
            return res.render('createStudent', {error});
        }
        req.logIn(user, (error) => {
            if(error){
                return res.render('createProfessor', {error: error.message});
            }
            return res.redirect("/course");
        })
   
    })(req);
 
})

module.exports = router;