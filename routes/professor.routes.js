const express = require('express');
const Professor = require('../models/Professor');
const router = express.Router();

router.get('/', async(req, res, next) => {
    res.status(200).render('createProfessor')

})

router.post('/create', async(req, res, next) => {
    const {name, lastName, photo, mail, education, age, password } = req.body;

   const newProfessor = new Professor({
        name,
        lastName,
        photo,
        mail,
        education,
        age,
        password
   });

   const addProfessor = await newProfessor.save();
   return res.json(addProfessor)   
    
})

router.get('/choose', async(req, res, next) => { //inscribe en el curso todos los p
    try{
        const { id, name } = req.query
        let hasProfessor = false;
        const professors = await Professor.find({education : name});
        if(professors.length){
            hasProfessor = true
        }
        professors.forEach(element => { 
            element._doc = {...element._doc, hola : name}
            })
         res.status(200).render('addSubjectToProfessor', {professors, hasProfessor, id , subjectName: name});   
        }
        
    catch(error){
        next(error);
    }
})
router.get('/addsubject', async(req, res, next) => {
    try{
        console.log("hola")
        const {id, name } = req.query;
        const professors = await Professor.updateMany({education : name},{$push: {subjetcs: id}})
        res.json(professors);
    }catch(error){
        next(error);
    }

})











module.exports = router;