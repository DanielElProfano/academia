const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Professor = require('./models/Professor');
const Student = require('./models/Student');

const saltRounds = 10; //nivel de encriptacion

passport.serializeUser((user, done) => {
    return done(null, user._id);
})
passport.deserializeUser(async (userId, done) => {
    try{
        let existingUser = await Professor.findById(userId);
     
        if(!existingUser){
            existingUser = await Student.findById(userId);
         
        }
        return done(null, existingUser)
    }catch(error){
        return done(error)
    }
})

passport.use(
    'registerProfessor',
    new LocalStrategy(
        {
            usernameField: 'mail',
            passwordField   : 'password',
            passReqToCallback : true
        },
        async(req, mail, password, done) => {
            try {
                const {name, lastName, photo, mail, education, age, password } = req.body;
                console.log(req.body)
                // mandar algo por el body para saber si viene del Student o de Professor
                let existUser = await Professor.findOne({ mail : mail});
                if(existUser){
                    const error = new Error('Ya existe el usuario');
                    return done(error);
                }

                const hash = await bcrypt.hash(password, saltRounds);

                const newProfessor = new Professor({
                            name,
                            lastName,
                            photo,
                            mail,
                            education,
                            age,
                            password: hash
                       });
                const saveUser = await newProfessor.save();
                done(null, saveUser);
            }
            catch(error){
                return done(error);
            }
          }
        )
    );
passport.use(
    'registerStudent',
    new LocalStrategy(
        {
            usernameField: 'mail',
            passwordField   : 'password',
            passReqToCallback : true
        },
        async(req, mail, password, done) => {
            try {
                const {name, lastName, mail, password, age, courses} = req.body;
                console.log(req.body)
                // mandar algo por el body para saber si viene del Student o de Professor
                let existUser = await Student.findOne({ mail : mail});
                if(existUser){
                    const error = new Error('Ya existe el usuario');
                    return done(error);
                }

                const hash = await bcrypt.hash(password, saltRounds);

                const newStudent = new Student({
                            name,
                            lastName,
                            mail,
                            age,
                            password: hash,
                            courses
                       });
                const saveUser = await newStudent.save();
                done(null, saveUser);
            }
            catch(error){
                return done(error);
            }
          }
        )
    );
    passport.use(
        'login',
        new LocalStrategy(
          {
            usernameField: 'mail',
            passwordField: 'password',
            passReqToCallback: true,
          },
          async (req, mail, password, done) => {
            try {
            
                let currentUser = await Professor.findOne({ mail: mail });
                if (!currentUser) {

                    currentUser = await Student.findOne({ mail: mail });
                    
                    if(!currentUser){
                        const error = new Error('El usuario no existe');
                        return done(error);
                    }
                }
                
                const isValidPassword = await bcrypt.compare(
                    password,
                    currentUser.password
              );
      
              if (!isValidPassword) {
                const error = new Error(
                  'The mail & password combination is incorrect!'
                );
                return done(error);
              }
      
              // Si todo se valida correctamente, completamos el callback con el usuario
              done(null, currentUser);
            } catch (err) {
              // Si hay un error, resolvemos el callback con el error
              return done(err);
            }
          }
        )
      );