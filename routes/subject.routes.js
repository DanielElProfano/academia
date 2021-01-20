const express= require('express');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const router = express.Router();

router.get ('/', async(req, res, next) => { //recogera el nombre del curso. y la ID y lo desplegara en la pag.
    const { name , id } = req.query;
    return res.status(200).render('createSubject', { name, id });
})
router.post('/create', async(req, res, next) =>{ //asignar asigmaturas a un curso existente
    try{
        let array = [];

        const id = req.query.id  //Id del curso
        
        const { name, students, professors } = req.body
        const newSubject = new Subject({
            course : id,
            name,
            students : students ? students : [],
            professors : professors ? professors : []
        })
        const addSubject = await newSubject.save();

        const addSubjectToCourse = await Course.findByIdAndUpdate(id, 
                {$push: { subjects: addSubject._id}}); //pushea en el array subjects del modelo COURSE la asignatura.
        return res.status(201).render('createSubject', 
            {
                title : "Create subject",
                id
            })
    }catch(error){
        next(error);
    }
})

router.get('/show', async(req, res, next) =>{
    try{
        const subjects = await Subject.find();
        return res.status(200).render('showSubjects', { subjects })
    }catch(error){
        next(error);
    }
})
router.get('/subjects', async(req, res, next) => {  //muestra todos las asignaturas de un curso pasando la ID por Query param
    try{
    const id = req.query.id; //id del curso al que pertenecen las asignaturas.
    const subjects = await Subject.find({course: id});
    return res.status(200).render('modifyCourse', { subjects , id});
    }catch(error){
        next(error);
    }
})

router.get('/:id/delete', async(req, res, next) => {  //borra asignaturs de un curso pasado por Id y vuelve a renderizar la pantalla

    const id = req.params.id;
    const idCourse = req.query.id;
    await Subject.findByIdAndDelete(id);
    return res.redirect('/subject/subjects?id=' + idCourse);
    

})


module.exports = router;