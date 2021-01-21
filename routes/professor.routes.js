const express = require('express');
const passport = require('passport');
const Professor = require('../models/Professor');
const Subject = require('../models/Subject');
const router = express.Router();

router.get('/', async(req, res, next) => {
    res.status(200).render('createProfessor')

})

router.post('/create', (req, res, next) => {

    passport.authenticate('registerProfessor', (error, user) => {
        if(error){
            return res.render('createProfessor', {error});
        }
        req.logIn(user, (error) => {
            if(error){
                return res.render('createProfessor', {error: error.message});
            }
            
        })
        return res.redirect("/course");

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

module.exports = router;