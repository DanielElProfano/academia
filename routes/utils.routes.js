const express= require('express');
const Student = require('../models/Student')
const Course = require('../models/Course');
const router = express.Router();
const nodemailer = require('nodemailer');
const Professor = require('../models/Professor');

router.get('/:id/mailform', async(req, res, next) => {
    try{
        const { from, course } = req.query;
        const id = req.params.id;
        const student = await Student.findById(id); 
        const professor = await Professor.findById(from);
        return res.status(200).render('professor/mailForm', { student, professor, course })
    }catch(error){
        next(error);
    }
});
router.post('/mail/:course/:id', async(req, res, next) => {
    const { from, to, subject, text } = req.body;
    const id = req.params.course;
    const idProf = req.params.id;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com ',
        port: 465,
        auth: {
            user: 'pruebesitasparanode@gmail.com', //pruebesitasparanode Fullstack
            pass: 'Fullstack'
        }
    });
    
    let mailOptions = {
        from: 'pruebesitasparanode@gmail.com',
        to,
        subject, 
        text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return res.redirect(`/professor/allstudents/?id=${ id }&idProf=${ idProf }`)

})

module.exports = router;