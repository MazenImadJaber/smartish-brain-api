const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const { json } = require('express');
const app = express();

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const images = require('./controllers/images')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        password: '',
        database: 'smart-brain'
    }
});


app.use(express.json())
app.get('/', (req, res) => {
 db.select('*').from('users').then(data => res.json(data))
   
})

app.post('/signin', (req,res) => {signin.handleSignin(req, res, db, bcrypt)})
app.post('/register',(req,res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req,res)=> {profile.handleProfileGet(req,res,db)})
app.put('/image', (req,res)=>{images.handleNewEntry(req,res,db)})

app.listen(3000, () => {
    console.log('app is listening on port 3000.....');
})


