const express= require('express');
const Course = require('../models/Course');
const Subject = require('../models/Subject')
require ('../helpers/course.hlp')
const Subjects = require

const router = express.Router();


router.post('/create', async(req, res, next) =>{ //asignar asigmaturas a un curso existente

    const { name } = req.body
    const newCourse = new Course({ name })
    const addCourse = await newCourse.save();
    console.log(addCourse);
    res.status(201).redirect("/subject?" + "name="+addCourse.name +"&id=" + addCourse._id)
})

router.get('/', (req, res, next) => {

        return res.status(200).render('createCourse');
})

router.get('/show', async (req, res, next) =>{
    try{
        courses = await Course.find();
        return res.status(200).render('showCourses' , { courses });
    }catch(error){
        next(error);
    }
})

router.get('/:id/delete', async(req, res, next) => {
try{
    const id = req.params.id
    await Course.findByIdAndDelete(id);
    const response = await Subject.deleteMany({ course : id })
    console.log(response.deletedCount + " delete subjects.") 
    return res.redirect('/course/show');
}
catch(error){
    next(error);
}
})



module.exports = router;