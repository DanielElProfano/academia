const express = require('express');
const passport = require('passport');
const Professor = require('../models/Professor');
const Subject = require('../models/Subject');
const router = express.Router();




router.get('/logout', (req, res, next) => {
    console.log("hola")
    if(req.user){
            req.logout();
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('/course');
            })
    }else{
        return res.sendStatus(304);
    }
})
router.get('/', async (req, res, next) =>{
    console.log("holaaaaaa")
    res.status(200).render('login');
})

router.post('/check', (req, res, next) => {
    console.log(req.body)
    passport.authenticate('login', (error, user) => {
        if(error) {
            return res.render('login', { error: error.message });
        }
        req.logIn(user, (err) => {
            // Si hay un error logeando al usuario, resolvemos el controlador
            if (err) {
              return res.render('error', { error: error.message });
            }
            return res.redirect('/course');
        });
    })(req);
});


module.exports = router;