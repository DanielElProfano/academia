const express = require('express');
const passport = require('passport');
const Professor = require('../models/Professor');
const Subject = require('../models/Subject');
const router = express.Router();

router.get('/logout', (req, res, next) => {
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
   res.status(200).render('login');
})

router.post('/check', (req, res, next) => {
    passport.authenticate('login', (error, user) => {
        if(error) {
            return res.render('login', { error: error.message });
        }
        req.logIn(user, (err) => {
            if (err) {
              return res.render('error', { error: error.message });
            }
           if(user.rol === 'professor'){
                return res.redirect(`/professor/${user._id}/students`)}
            if(user.rol === 'default'){
                return res.redirect(`/student/${user._id}`)
            }
            return res.render('admin/admin', { user })
      });
    })(req);
});


module.exports = router;