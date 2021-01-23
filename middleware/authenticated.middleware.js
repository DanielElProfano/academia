const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/login');
    }


}
const isAdmin = (req, res, next) => {
    // console.log(req.passport);
    if(req.user.rol === 'admin') {
        return next();
    } else {
        const error = new Error('No tiene permisos de Administrador')
        return res.status(403).render('error', { error });
    }
}
const isProfessor = (req, res, next) => {
    // console.log(req.passport);
    if(req.user.rol === 'professor') {
        return next();
    } else {
        return res.redirect('/');
    }
}
const isStudent = (req, res, next) => {
    // console.log(req.passport);
    if(req.user.rol === 'default') {
        return next();
    } else {
        return res.redirect('/');
    }
}


module.exports = {
    isAuthenticated,
    isAdmin
}