const express= require('express');
const Course = require('../models/Course');
const Subject = require('../models/Subject')
const Professor = require('../models/Professor');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/create', async(req, res, next) =>{ //seleccionar asignaturas a un curso existente

    const { name } = req.body
    const newCourse = new Course({ name })
    const addCourse = await newCourse.save();  //creamos un curso nuevo
    console.log(addCourse);
    
    res.status(201).redirect("/subject?" + "name="+addCourse.name +"&id=" + addCourse._id)
})

router.get('/', async(req, res, next) => {

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
    const response = await Subject.find({ course : id }).lean()  // subjects
    response.forEach(async element => {

        const idSubjectToDelete= JSON.stringify(element._id); //consigo el id de los subjects a borrar
        const IdSubject = idSubjectToDelete.slice(1,idSubjectToDelete.length-1); //casteo para que sea válido el ID
        const ObjectID = mongoose.Types.ObjectId(IdSubject); //construyo el objeto ID
        console.log(IdSubject)
        const allProfessors = await Professor.find({subjects : ObjectID}) //muestra todos los profesores que imparten esa asignatura
        allProfessors.forEach(async element => {  //itero por todos los profesores

            const deleteSubject = await Professor.updateOne(
                {_id :element._id }, 
                {$pull:{subjects : IdSubject}}, 
                {new: true})     
            })

        })
        const response2 = await Subject.deleteMany({ course : id })
        console.log(response2.deletedCount + " delete subjects.") 

   return res.redirect('/course/show');

    }catch(error){
        next(error);
    }
})



module.exports = router;
