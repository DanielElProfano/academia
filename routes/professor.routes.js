const express = require('express');
const passport = require('passport');
const Professor = require('../models/Professor');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');
const router = express.Router();
const fileMiddleware = require('../middleware/file.middleware');
const { find } = require('../models/Subject');
const Student = require('../models/Student');
const Course = require('../models/Course');

router.get('/', async(req, res, next) => {
    res.status(200).render('createProfessor')

})

router.post('/create', [fileMiddleware.upload.single('photo')],(req, res, next) => {

    passport.authenticate('registerProfessor', (error, user) => {
        if(error){
            return res.render('createProfessor', {error});
        }
        req.logIn(user, (error) => {
            if(error){
                return res.render('createProfessor', {error: error.message});
            }
            
        })
        return res.redirect("/professor/show");

    })(req, res, next);

    
})

router.get('/choose', async(req, res, next) => { //inscribe en el curso todos los p
    try{
        const { id, name } = req.query
        let hasProfessor = false;
        const professors = await Professor.find({education : name}); //busca todos los profesores que dan la asignatura pasada en NAME
     
        console.log(professors)
           if(professors.length){
            hasProfessor = true
        }
        professors.forEach(element => { 
            element._doc = {...element._doc, subject : name, idSubject : id}
            })
         res.status(200).render('addSubjectToProfessor', {professors, hasProfessor});   
        }
        
    catch(error){
        next(error);
    }
})
router.get('/addsubject', async(req, res, next) => {
    try{
        const {idProf, idSub, name } = req.query;
        const professors = await Professor.findByIdAndUpdate(idProf,{$addToSet: {subjects: idSub}}).populate('subjects');
        const addProfessorToSubject = await Subject.findByIdAndUpdate(idSub, {$addToSet:{professors: idProf}})
        res.json(professors);
    }catch(error){
        next(error);
    }

})
router.get('/show', async(req, res, next) => {
    try{
        const allProfessors = await Professor.find().populate('subjects');
        res.status(200).render('professor/showProfessors', { allProfessors });
    }catch(error){
        next(error);
    }
});
router.get('/:id/modify/', async(req, res, next) => {
 
    try{
        const id = req.params.id;
        const professor = await Professor.findById(id).populate('courses');
        res.status(200).render('professor/modifyProfessor', { professor });

    }catch(error){
        next(error);
    }
})
router.post('/:id/modify/', [fileMiddleware.upload.single('photo')], async(req, res, next) => {
    
    try{
        const {name, lastName, mail, age } = req.query;
        console.log(req.body)
        const id = req.params.id;
     
        const student = await Professor.findByIdAndUpdate(id, req.body,
        {new : true});
        res.status(200).redirect('/professor/show');

    }catch(error){
        next(error);
    }
})
router.get('/:id/delete', async(req, res, next) => {
    try{
        const id = req.params.id
        await Professor.findByIdAndDelete(id);
        const response = await Subject.find({ professors : id }).lean()  // subjects

        response.forEach(async element => {
    
            const idSubjectToDelete = JSON.stringify(element._id); //consigo el id de la asignatura que imparte
            const IdSubject = idSubjectToDelete.slice(1,idSubjectToDelete.length-1); //casteo para que sea válido el ID
            const ObjectID = mongoose.Types.ObjectId(IdSubject); //construyo el objeto ID
            console.log(IdSubject)
            
                const deleteSubject = await Subject.updateOne(
                    {_id : element._id }, 
                    {$pull:{professors : id}}, 
                    {new: true})     
                
    
            })
        
    
       return res.redirect('/course/show');
    
        }catch(error){
            next(error);
        }
    })

router.get('/meet', async(req, res, next) => { //hacer un findONEbyID
    try{
        const id = req.query.id;
        const allStudents = await Student.find({courses : id}).populate('courses');
        res.json(allStudents)
        // res.render('professor/showStudentsByCourse', { allStudents });
    }catch(error){
        next(error);
    }
})
router.get('/:id/students', async(req, res, next) => { //revibe el id del profesor
    try{
        const array = [];
        const idProf = req.params.id;
        const professor = await Professor.findById(idProf);
        const students = false; //para no mostrar el campo de estudiantes
        const allSubjects = await Subject.find({professors : idProf }).distinct('course').lean();

        allSubjects.forEach(async element => {
            const course = await Course.findById(element._id);
            array.push(course)
        })
        return res.status(200).render('professor/showCourses', { array, professor, students });
    }catch(error){
        next(error);
    }
})
router.post('/:id/allstudents', async (req, res, next) => {
    const idProf = req.params.id;
    const id = req.body.id;
    const students = true;
    const allStudents = await Student.find({ courses: id}).populate('courses');
    return res.status(200).render('professor/showCourses', { allStudents, students, idProf })
})

router.get('/allstudents', async (req, res, next) => {
    const { id, idProf } = req.query;
    
    const students = true;
    const allStudents = await Student.find({ courses: id}).populate('courses');
    return res.status(200).render('professor/showCourses', { allStudents, students , idProf})
})




module.exports = router;