
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session')
const bodyparser = require("body-parser");
const LocalStrategy = require('passport-local').Strategy;


const Alumno = require('./src/models/alumno')

const Profesor = require('./src/models/profesor')

const validPassword = require('./src/lib/passwordUtils').validPassword;

const app = express()

//////Passport begin
    //app.use(cookieParser('secreto'))
    
    app.use(session({
        secret: 'secreto',
        resave: true,
        saveUninitialized: true
    }))

    passport.use(new LocalStrategy(function(username, password, done){

        Alumno.findOne({username: username})
        .then((user) => {

            if(!user){
                
                Profesor.findOne({username: username}).then((userprofe) => {
                    user = userprofe
                })

                if(!user){
                    console.log(`No hay usuario de nombre "${username}"`)
                    return done(null, false)//avisa que no esta el usuario en la bdd null = no hay usuario, false = no hay error
                }
            }
            
        //Aca ya encontro o no esl usuario

            console.log(`Se encontro el usuario "${username}"`)

            //aca nos fijamos si la password esta bien
            const isValid = validPassword(password, user.hash, user.salt)

            if(isValid){
                console.log("la pass esta bien")
                return done(null, user) //nos deja entrar en la ruta
            }else{
                console.log("la pass esta mal")
                return done(null, false) //no entra a la siguiene ruta
            }

        })
        .catch((err)=>{
            done(err);
        })

    }))


/////Passport end




//const MongoStore = require('connect-mongo')(session);

//var cors = require('cors')
//app.use(cors())

app.set('port', process.env.PORT || 3000);

const login = require('./src/routes/login');
const register = require('./src/routes/register');
const profesores = require('./src/routes/profesores');
const alumnos = require('./src/routes/alumnos');
const { Passport } = require('passport');
const alumno = require('./src/models/alumno');

//conectar a bdd
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(db => console.log('DB connected'))//tira este mensaje si se conecto
    .catch(err => console.log(err))//tira esto si no conecto


//Json middleware para que reconozca las entradas como json
app.use(express.json());

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


app.use('/login', login);
app.use('/register', register)
app.use('/profesores', profesores);
app.use('/alumnos', alumnos);

app.listen(app.get('port'), () => console.log(`Server started at port ${app.get('port')}`))

