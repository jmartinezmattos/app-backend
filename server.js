const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000);

const login = require('./src/routes/login');
const register = require('./src/routes/register');
const profesores = require('./src/routes/profesores');


app.use('/login', login);
app.use('/register', register)
app.use('/profesores', profesores);

app.listen(app.get('port'), () => console.log(`Server started at port ${app.get('port')}`))

